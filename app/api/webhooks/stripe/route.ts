import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" as any });

// Credit amounts per plan/pack
const PLAN_CREDITS: Record<string, number> = {
  "starter_monthly": 200,
  "pro_monthly":     1000,
  "pack_50":         50,
  "pack_150":        150,
  "pack_500":        500,
  "pack_1500":       1500,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Stripe webhook signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId  = session.metadata?.userId;
      const product = session.metadata?.product;  // e.g. "starter_monthly" or "pack_150"

      if (userId && product) {
        const creditsToAdd = PLAN_CREDITS[product] ?? 0;
        const isPlan       = product.endsWith("_monthly");

        if (isPlan) {
          const plan = product.replace("_monthly", "");
          await User.findByIdAndUpdate(userId, {
            plan,
            credits: creditsToAdd,
          });
        } else {
          // Credit pack — add on top of existing
          await User.findByIdAndUpdate(userId, {
            $inc: { credits: creditsToAdd },
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub    = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { plan: "free", credits: 10 });
      }
      break;
    }

    case "invoice.payment_failed": {
      // Optionally notify user
      console.warn("Payment failed for subscription:", event.data.object);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
