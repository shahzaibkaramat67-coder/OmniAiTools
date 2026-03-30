import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️  OPENAI_API_KEY is not set. AI tools will not work.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "sk-placeholder",
});

export const DEFAULT_MODEL     = "gpt-4o-mini";
export const DEFAULT_MAX_TOKENS = 2000;
export const DEFAULT_TEMPERATURE = 0.7;
