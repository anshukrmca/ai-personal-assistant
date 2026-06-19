import type { FeedItem } from "../types";
import { PROVIDER } from "./config";
import { callAI } from "./core";
import { mockSummarize } from "./mock";

export interface BriefingResult {
  summary: string;
  meetingsCount: number;
  importantAlertsCount: number;
  pendingFollowUpsCount: number;
}

export function computeCounts(items: FeedItem[]): Omit<BriefingResult, "summary"> {
  return {
    meetingsCount: items.filter((i) => i.type === "meeting").length,
    importantAlertsCount: items.filter((i) => i.priority === "high").length,
    pendingFollowUpsCount: items.filter((i) => i.requiresFollowUp).length,
  };
}

export async function generateBriefing(items: FeedItem[]): Promise<BriefingResult> {
  const counts = computeCounts(items);

  if (PROVIDER === "mock") {
    return mockSummarize(items);
  }

  const itemsText = items
    .slice(0, 20)
    .map((i) => `- [${i.priority.toUpperCase()}] (${i.source}) ${i.title}: ${i.snippet}`)
    .join("\n");

  try {
    const summary = await callAI(
      "You are a concise daily briefing assistant. Respond in 2-3 sentences only. No lists. No markdown.",
      `Write a daily briefing summary based on these synced items from the user's apps. Be direct and conversational. Mention the single most urgent item by name.\n\nItems:\n${itemsText}`,
      180
    );
    return { ...counts, summary: summary || mockSummarize(items).summary };
  } catch (err) {
    console.error("[aiService] generateBriefing failed:", err);
    return mockSummarize(items);
  }
}
