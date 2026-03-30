import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-500/6 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      {children}
    </div>
  );
}
