// tailwind.config.ts is intentionally minimal for Tailwind CSS v4.
// All theme tokens are defined in app/globals.css using @theme { }
// This file only exists for IDE tooling / editor autocomplete support.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
