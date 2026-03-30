import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { openai, DEFAULT_MODEL, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from "@/lib/openai";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";
import { getToolBySlug } from "@/lib/tools-data";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { toolSlug, input } = body;

    if (!toolSlug || !input?.trim()) {
      return NextResponse.json({ error: "Tool and input are required" }, { status: 400 });
    }

    const tool = getToolBySlug(toolSlug);
    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }
    if (tool.isMedia) {
      return NextResponse.json({ error: "Use the media endpoint for AI Media tools" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById((session.user as any).id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.credits < tool.credits) {
      return NextResponse.json({
        error: `Not enough credits. This tool costs ${tool.credits} credits. You have ${user.credits}.`,
      }, { status: 402 });
    }

    const completion = await openai.chat.completions.create({
      model:       DEFAULT_MODEL,
      messages: [
        { role: "system", content: tool.systemPrompt },
        { role: "user",   content: input.slice(0, 5000) },
      ],
      max_tokens:  DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
    });

    const output = completion.choices[0]?.message?.content ?? "";

    // Deduct credits & save history atomically-ish
    user.credits -= tool.credits;
    await Promise.all([
      user.save(),
      History.create({
        userId:      user._id,
        toolSlug:    tool.slug,
        toolName:    tool.name,
        category:    tool.category,
        input:       input.slice(0, 1000),
        output:      output.slice(0, 5000),
        creditsUsed: tool.credits,
      }),
    ]);

    return NextResponse.json({ output, creditsRemaining: user.credits });

  } catch (error: any) {
    console.error("[generate] error:", error);
    if (error?.status === 429) {
      return NextResponse.json({ error: "AI rate limit reached. Please wait a moment and try again." }, { status: 429 });
    }
    if (error?.code === "insufficient_quota") {
      return NextResponse.json({ error: "OpenAI quota exceeded. Please contact support." }, { status: 503 });
    }
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}
