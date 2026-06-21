export type Provider = "openrouter" | "anthropic";

export function detectProvider(): Provider {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "openrouter";
}

export const PROVIDER = detectProvider();

export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

export function getProviderName(): string {
  if (PROVIDER === "anthropic") return "Anthropic Claude";
  return `OpenRouter (${OPENROUTER_MODEL})`;
}
