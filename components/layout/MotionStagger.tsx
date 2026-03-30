"use client";

import { motion } from "framer-motion";
import { listContainer, listItem, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function StaggerList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      viewport={viewportOnce}
      variants={listContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div className={cn(className)} variants={listItem}>
      {children}
    </motion.div>
  );
}
