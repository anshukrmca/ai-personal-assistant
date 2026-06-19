export type Provider = "openrouter" | "anthropic" | "mock";

export function detectProvider(): Provider {
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "mock";
}

export const PROVIDER = detectProvider();

export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

export function getProviderName(): string {
  if (PROVIDER === "openrouter") return `OpenRouter (${OPENROUTER_MODEL})`;
  if (PROVIDER === "anthropic") return "Anthropic Claude";
  return "Mock (no key)";
}
