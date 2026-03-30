import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id:      string;
      role:    "user" | "admin";
      credits: number;
      plan:    "free" | "starter" | "pro";
    };
  }

  interface User extends DefaultUser {
    id:      string;
    role:    "user" | "admin";
    credits: number;
    plan:    "free" | "starter" | "pro";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id:      string;
    role:    "user" | "admin";
    credits: number;
    plan:    "free" | "starter" | "pro";
  }
}
