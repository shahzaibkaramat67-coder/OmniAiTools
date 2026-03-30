"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 1, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: transitions.smooth.ease }}
      className="min-h-0"
    >
      {children}
    </motion.div>
  );
}
