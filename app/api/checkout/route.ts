import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" as any });

// Price IDs — set these after creating products in your Stripe dashboard
const PRICE_IDS: Record<string, string> = {
  starter_monthly: process.env.STRIPE_PRICE_STARTER ?? "price_starter",
  pro_monthly:     process.env.STRIPE_PRICE_PRO     ?? "price_pro",
  pack_50:         process.env.STRIPE_PRICE_PACK50   ?? "price_pack50",
  pack_150:        process.env.STRIPE_PRICE_PACK150  ?? "price_pack150",
  pack_500:        process.env.STRIPE_PRICE_PACK500  ?? "price_pack500",
  pack_1500:       process.env.STRIPE_PRICE_PACK1500 ?? "price_pack1500",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { product } = await req.json();
    if (!product || !PRICE_IDS[product]) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const userId  = (session.user as any).id;
    const isPlan  = product.endsWith("_monthly");
    const priceId = PRICE_IDS[product];

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: isPlan ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, product },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=1`,
      customer_email: session.user.email ?? undefined,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
