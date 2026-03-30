import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
  BANK_TRANSFER_INSTRUCTIONS_URL,
  getDefaultMethods,
  isValidProduct,
  PAYFAST_CHECKOUT_URLS,
  PAYONEER_INSTRUCTIONS_URL,
  Region,
  PaymentMethod,
  TWOCO_CHECKOUT_URLS,
} from "@/lib/payments";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function inferRegion(req: NextRequest): Region {
  const headerCountry =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    req.headers.get("x-country-code") ??
    "";
  const country = headerCountry.trim().toUpperCase();
  return country === "PK" ? "pk" : "international";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product, method, region: regionHint } = await req.json();
  if (!product) return NextResponse.json({ error: "Product required" }, { status: 400 });
  if (!isValidProduct(product)) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  const region: Region =
    regionHint === "pk" || regionHint === "international"
      ? regionHint
      : inferRegion(req);

  const allowedMethods = getDefaultMethods(region);
  const chosen: PaymentMethod | undefined = method ?? allowedMethods[0];
  if (!chosen || !allowedMethods.includes(chosen)) {
    return NextResponse.json(
      { error: "Invalid payment method for region", allowedMethods, region },
      { status: 400 },
    );
  }

  const userId  = (session.user as any).id;
  const email   = session.user.email ?? "";

  await connectDB();
  const user = await User.findById(userId).select("name email suspended");
  if (!user)          return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.suspended) return NextResponse.json({ error: "Account suspended" }, { status: 403 });

  try {
    if (chosen === "payfast") {
      const checkoutUrl = PAYFAST_CHECKOUT_URLS[product];
      if (!checkoutUrl) {
        return NextResponse.json(
          { error: "PayFast checkout URL not configured for this product" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        region,
        method: chosen,
        checkoutUrl,
        returnUrl: `${APP_URL}/dashboard?success=1`,
        cancelUrl: `${APP_URL}/pricing?cancelled=1`,
        prefill: { email, name: user.name ?? "" },
      });
    }

    if (chosen === "twocheckout") {
      const checkoutUrl = TWOCO_CHECKOUT_URLS[product];
      if (!checkoutUrl) {
        return NextResponse.json(
          { error: "2Checkout checkout URL not configured for this product" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        region,
        method: chosen,
        checkoutUrl,
        prefill: { email, name: user.name ?? "" },
      });
    }

    if (chosen === "payoneer") {
      if (!PAYONEER_INSTRUCTIONS_URL) {
        return NextResponse.json(
          { error: "Payoneer instructions URL not configured" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        region,
        method: chosen,
        instructionsUrl: PAYONEER_INSTRUCTIONS_URL,
      });
    }

    if (chosen === "bank") {
      if (!BANK_TRANSFER_INSTRUCTIONS_URL) {
        return NextResponse.json(
          { error: "Bank transfer instructions URL not configured" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        region,
        method: chosen,
        instructionsUrl: BANK_TRANSFER_INSTRUCTIONS_URL,
      });
    }

    return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
  } catch (err: any) {
    console.error(`[payment checkout]`, err.message);
    return NextResponse.json({ error: err.message ?? "Checkout failed" }, { status: 500 });
  }
}
