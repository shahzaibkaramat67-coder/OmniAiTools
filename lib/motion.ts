import type { Transition, Variants } from "framer-motion";

/** Editorial-style ease — fast settle, no bounce */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const duration = {
  smooth: 0.55,
  quick: 0.35,
  slow: 0.75,
} as const;

export const transitions = {
  smooth: { duration: duration.smooth, ease: EASE_OUT_EXPO } satisfies Transition,
  quick: { duration: duration.quick, ease: EASE_OUT_EXPO } satisfies Transition,
  spring: { type: "spring" as const, stiffness: 400, damping: 30 } satisfies Transition,
} as const;

export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const chipsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035, delayChildren: 0.15 },
  },
};

export const chipItem: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.quick,
  },
};

export const statsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0 },
  },
};

export const statsItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const sectionHeader: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const staggerSection: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

/** Nested grid under a section (e.g. tool cards) */
export const cardGrid: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
};

export const viewportOnce = {
  once: true,
  margin: "-64px 0px",
  amount: 0.2,
} as const;

/** Scroll-reveal lists (legal sections, admin tables, etc.) */
export const listContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

