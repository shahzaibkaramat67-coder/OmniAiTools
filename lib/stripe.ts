import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️  STRIPE_SECRET_KEY is not set. Payments will not work.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2024-04-10" as any,
  typescript: true,
});
