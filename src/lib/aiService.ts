/**
 * AI Service Facade
 * 
 * Re-exports the modularized AI components.
 * This maintains backwards compatibility with the rest of the application
 * so that existing imports from "@/lib/aiService" continue to work.
 */

export { detectProvider, getProviderName, OPENROUTER_MODEL, PROVIDER } from "./ai/config";
export type { Provider } from "./ai/config";

export { callAI, callAnthropic, callOpenAICompatible } from "./ai/core";


export { computeCounts, generateBriefing } from "./ai/briefing";
export type { BriefingResult } from "./ai/briefing";

export { answerChatQuestion, enhanceText, generateChatTitle } from "./ai/chat";
