import type { FeedItem } from "../types";
import { PROVIDER } from "./config";
import { callAI } from "./core";

export async function draftAlertResponse(item: FeedItem): Promise<string> {
  const system = "You are a professional assistant. Draft a short, concise 2-3 sentence response/acknowledgement to the following incoming alert. Output ONLY the response body text. Do not include subject lines or conversational filler.";
  const prompt = `Source: ${item.source}\nFrom: ${item.from}\nTitle: ${item.title}\nContent: ${item.snippet}`;
  
  try {
    return await callAI(system, prompt, 300);
  } catch (err) {
    console.warn("[aiService] draftAlertResponse failed:", err);
    return "I am currently unable to draft a response. Please try again later.";
  }
}

export async function suggestAlertRules(items: FeedItem[]): Promise<Array<{ id: string, title: string, desc: string, active: boolean }>> {
  const defaultRules = [
    { id: "rule-1", title: "Urgent Meeting Requests", desc: "Alert me when high-priority calendar invites are received.", active: false },
    { id: "rule-2", title: "Important Client Emails", desc: "Notify me immediately for emails flagged as action required.", active: false },
    { id: "rule-3", title: "Project Deadlines", desc: "Scan for approaching deadlines mentioned in messages.", active: false },
  ];

  const itemsText = items.slice(0, 10).map(i => `- ${i.title}: ${i.snippet}`).join("\n");
  const system = "You are an AI assistant. Based on the user's recent inbox data, suggest 3 intelligent alert rules they should set up. Return ONLY a valid JSON array of objects. Each object must have 'id' (string, e.g. rule-1), 'title' (short string), 'desc' (1-sentence description), and 'active' (boolean false). Do not use markdown blocks like ```json.";
  const prompt = `Recent Data:\n${itemsText}\n\nOutput JSON array:`;

  try {
    const res = await callAI(system, prompt, 400);
    const cleaned = res.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 3);
    }
    return defaultRules;
  } catch (err) {
    console.warn("[aiService] suggestAlertRules failed:", err);
    return defaultRules;
  }
}
