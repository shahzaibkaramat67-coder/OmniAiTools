import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";
import MotionProvider from "@/components/providers/MotionProvider";
import RouteTransition from "@/components/layout/RouteTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OmniAITool – 40+ AI-Powered Tools in One Platform",
    template: "%s | OmniAITool",
  },
  description:
    "Generate content, create AI media, automate workflows with 40+ AI tools. Writing, SEO, Social Media, Image Generation and more.",
  keywords: ["AI tools", "content generator", "SEO tools", "image generator", "AI SaaS"],
  openGraph: {
    title: "OmniAITool – 40+ AI-Powered Tools",
    description: "Your all-in-one AI toolkit for content, SEO, media, and productivity.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${jetbrains.variable}`}>
      <body className="noise">
        <MotionProvider>
          <AuthProvider>
            <RouteTransition>{children}</RouteTransition>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#161b27",
                color: "#e2e8f0",
                border: "1px solid #1e2535",
                borderRadius: "10px",
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#2455f5", secondary: "#0f1117" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#0f1117" },
              },
            }}
          />
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
