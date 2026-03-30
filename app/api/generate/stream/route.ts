import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { openai, DEFAULT_MODEL, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from "@/lib/openai";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";
import { getToolBySlug } from "@/lib/tools-data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Auth check
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response(
      `data: ${JSON.stringify({ error: "Unauthorized" })}\n\n`,
      { status: 401, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  let toolSlug: string, input: string;
  try {
    const body = await req.json();
    toolSlug   = body.toolSlug;
    input      = body.input;
  } catch {
    return new Response(
      `data: ${JSON.stringify({ error: "Invalid request body" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  if (!toolSlug || !input?.trim()) {
    return new Response(
      `data: ${JSON.stringify({ error: "Tool and input required" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const tool = getToolBySlug(toolSlug);
  if (!tool) {
    return new Response(
      `data: ${JSON.stringify({ error: "Tool not found" })}\n\n`,
      { status: 404, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  await connectDB();
  const user = await User.findById((session.user as any).id);
  if (!user) {
    return new Response(
      `data: ${JSON.stringify({ error: "User not found" })}\n\n`,
      { status: 404, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  if (user.credits < tool.credits) {
    return new Response(
      `data: ${JSON.stringify({ error: `Not enough credits. Need ${tool.credits}, have ${user.credits}.` })}\n\n`,
      { status: 402, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  // Deduct credits upfront
  user.credits -= tool.credits;
  await user.save();

  const encoder   = new TextEncoder();
  let fullOutput  = "";
  const userId    = user._id;
  const creditsLeft = user.credits;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      try {
        const completion = await openai.chat.completions.create({
          model:       DEFAULT_MODEL,
          messages: [
            { role: "system", content: tool.systemPrompt },
            { role: "user",   content: input.slice(0, 5000) },
          ],
          max_tokens:  DEFAULT_MAX_TOKENS,
          temperature: DEFAULT_TEMPERATURE,
          stream:      true,
        });

        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            fullOutput += text;
            send({ text });
          }
        }

        // Save history after full stream
        await History.create({
          userId,
          toolSlug:    tool.slug,
          toolName:    tool.name,
          category:    tool.category,
          input:       input.slice(0, 1000),
          output:      fullOutput.slice(0, 5000),
          creditsUsed: tool.credits,
        });

        send({ done: true, creditsRemaining: creditsLeft });
        controller.close();

      } catch (err: any) {
        console.error("[stream] error:", err);
        // Refund credits on AI error
        await User.findByIdAndUpdate(userId, { $inc: { credits: tool.credits } });
        send({ error: err?.message ?? "Stream failed. Credits refunded." });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection":    "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
