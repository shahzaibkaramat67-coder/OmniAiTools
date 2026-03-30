"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f1117] flex items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
          >
            Try again
          </button>
        </motion.div>
      </body>
    </html>
  );
}
