import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");
        if (!user || !user.password) return null;
        const valid = await user.comparePassword(credentials.password);
        if (!valid) return null;
        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
          image: user.image ?? null,
          role:  user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name:          user.name,
            email:         user.email,
            image:         user.image,
            googleId:      account.providerAccountId,
            emailVerified: true,
            credits:       10,
            plan:          "free",
          });
        }
      }
      return true;
    },

    // Refresh DB fields every time a JWT is issued or refreshed
    async jwt({ token, user, trigger, session }) {
      // On explicit session update (after credit deduction)
      if (trigger === "update" && session) {
        if (session.credits !== undefined) token.credits = session.credits;
        if (session.name    !== undefined) token.name    = session.name;
        return token;
      }

      // Always re-fetch from DB to keep credits in sync
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).lean() as any;
        if (dbUser) {
          token.id      = dbUser._id.toString();
          token.role    = dbUser.role;
          token.credits = dbUser.credits;
          token.plan    = dbUser.plan;
          token.name    = dbUser.name;
        }
      } catch (_) {
        // DB unreachable — keep existing token values
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id      = token.id;
        (session.user as any).role    = token.role;
        (session.user as any).credits = token.credits;
        (session.user as any).plan    = token.plan;
        (session.user as any).name    = token.name as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  secret:  process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
