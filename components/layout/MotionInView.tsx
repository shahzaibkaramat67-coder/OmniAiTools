"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cardReveal, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport" | "variants"> & {
  children: React.ReactNode;
  className?: string;
};

export function MotionInView({ children, className, ...rest }: Props) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={cardReveal}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
