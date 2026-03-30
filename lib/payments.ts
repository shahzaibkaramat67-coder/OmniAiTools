// Place at: lib/payments.ts
// Central payment config — region-based payment methods.

export type Region = "pk" | "international";

export type PaymentMethod = "payfast" | "twocheckout" | "payoneer" | "bank";

// ── Credit amounts per product key ───────────────────────────
export const PRODUCT_CREDITS: Record<string, number> = {
  starter_monthly:  500,
  pro_monthly:      1500,
  pack_micro:       50,
  pack_standard:    150,
  pack_pro:         500,
  pack_enterprise:  1500,
};

export function getCredits(product: string): number {
  return PRODUCT_CREDITS[product] ?? 0;
}

export function isSubscription(product: string): boolean {
  return product.endsWith("_monthly");
}

export function getPlanName(product: string): "starter" | "pro" | "free" {
  if (product.startsWith("starter")) return "starter";
  if (product.startsWith("pro"))     return "pro";
  return "free";
}

export function isValidProduct(product: string): boolean {
  return Boolean(PRODUCT_CREDITS[product]);
}

export function getDefaultMethods(region: Region): PaymentMethod[] {
  if (region === "pk") return ["payfast", "bank"];
  return ["twocheckout", "payoneer", "bank"];
}

// ── Provider configuration ─────────────────────────────────────
// For hosted checkout links, keep per-product URLs in env so you can
// control pricing and tax/VAT settings in the provider dashboard.

export const PAYFAST_CHECKOUT_URLS: Partial<Record<string, string>> = {
  starter_monthly: process.env.PAYFAST_URL_STARTER_MONTHLY ?? "",
  pro_monthly:     process.env.PAYFAST_URL_PRO_MONTHLY ?? "",
  pack_micro:      process.env.PAYFAST_URL_PACK_MICRO ?? "",
  pack_standard:   process.env.PAYFAST_URL_PACK_STANDARD ?? "",
  pack_pro:        process.env.PAYFAST_URL_PACK_PRO ?? "",
  pack_enterprise: process.env.PAYFAST_URL_PACK_ENTERPRISE ?? "",
};

export const TWOCO_CHECKOUT_URLS: Partial<Record<string, string>> = {
  starter_monthly: process.env.TWOCO_URL_STARTER_MONTHLY ?? "",
  pro_monthly:     process.env.TWOCO_URL_PRO_MONTHLY ?? "",
  pack_micro:      process.env.TWOCO_URL_PACK_MICRO ?? "",
  pack_standard:   process.env.TWOCO_URL_PACK_STANDARD ?? "",
  pack_pro:        process.env.TWOCO_URL_PACK_PRO ?? "",
  pack_enterprise: process.env.TWOCO_URL_PACK_ENTERPRISE ?? "",
};

export const PAYONEER_INSTRUCTIONS_URL =
  process.env.PAYONEER_INSTRUCTIONS_URL ?? "";

export const BANK_TRANSFER_INSTRUCTIONS_URL =
  process.env.BANK_TRANSFER_INSTRUCTIONS_URL ?? "";
