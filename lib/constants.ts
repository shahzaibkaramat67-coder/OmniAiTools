// App-wide constants — import from here instead of hard-coding values

export const APP_NAME    = "OmniAITool";
export const APP_TAGLINE = "40+ AI-Powered Tools in One Platform";
export const APP_URL     = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Credit plans
export const PLAN_CREDITS: Record<string, number> = {
  free:    10,
  starter: 200,
  pro:     1000,
};

// Credit pack options
export const CREDIT_PACKS = [
  { id: "pack_50",   credits: 50,   price: 4,  label: "Starter Pack"  },
  { id: "pack_150",  credits: 150,  price: 10, label: "Value Pack"    },
  { id: "pack_500",  credits: 500,  price: 28, label: "Power Pack"    },
  { id: "pack_1500", credits: 1500, price: 69, label: "Agency Pack"   },
] as const;

// Subscription plans
export const SUBSCRIPTION_PLANS = [
  { id: "starter_monthly", name: "Starter", price: 9,  credits: 200  },
  { id: "pro_monthly",     name: "Pro",     price: 29, credits: 1000 },
] as const;

// Navigation
export const DASHBOARD_NAV = [
  { href: "/dashboard",  label: "Dashboard",   icon: "⊞" },
  { href: "/tools",      label: "All Tools",   icon: "🛠️" },
  { href: "/history",    label: "History",     icon: "📜" },
  { href: "/settings",   label: "Settings",    icon: "⚙️" },
] as const;

// Limits
export const MAX_INPUT_LENGTH  = 5000;
export const MAX_OUTPUT_LENGTH = 10000;
export const MAX_HISTORY_FREE  = 10;
export const MAX_HISTORY_PAID  = 1000;

// Rate limits (requests per window)
export const RATE_LIMIT_GENERATE = { windowMs: 60_000, max: 10 }; // 10/min
