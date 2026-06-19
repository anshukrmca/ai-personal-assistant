import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getFeedForUser } from "@/lib/db/feed";
import { answerChatQuestion } from "@/lib/aiService";
import { insertOne, findMany, deleteWhere } from "@/lib/db/jsonStore";
import type { ChatAction, ChatMessage } from "@/lib/types";

const schema = z.object({
  question: z.string().min(1),
  activePlatform: z.string().optional(),
  timeZone: z.string().optional(),
  localTime: z.string().optional(),
});
const COLLECTION = "chatMessages";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const history = findMany<ChatMessage>(COLLECTION, (m) => m.userId === session.userId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const userMessage: ChatMessage = {
    id: uuid(),
    userId: session.userId,
    role: "user",
    content: parsed.data.question,
    createdAt: new Date().toISOString(),
    platformContext: parsed.data.activePlatform || "all",
  };
  insertOne<ChatMessage>(COLLECTION, userMessage);

  let items = getFeedForUser(session.userId);
  if (parsed.data.activePlatform && parsed.data.activePlatform !== "all") {
    items = items.filter(i => i.source === parsed.data.activePlatform);
  }

  let answer = await answerChatQuestion(
    parsed.data.question,
    items,
    history,
    parsed.data.timeZone,
    parsed.data.localTime
  );

  let finalAnswer = answer;

  // DEBUG: Log raw AI response to identify parsing issues
  console.log("[chat/ask] Raw AI answer:", JSON.stringify(answer).slice(0, 500));

  // Detect user intent — if they said "draft"/"compose"/"prepare", force draft even if LLM used email_action
  const qLower = parsed.data.question.toLowerCase();
  const userWantsDraft = qLower.includes("draft") || qLower.includes("compose") || qLower.includes("prepare");

  // If the LLM mistakenly used <email_action> but user wanted a draft, rewrite to draft
  if (userWantsDraft && answer.includes("<email_action>") && !answer.includes("<draft_action>")) {
    const rewritten = answer
      .replace("<email_action>", "<draft_action>")
      .replace("</email_action>", "</draft_action>");
    answer = rewritten;
  }
  
  finalAnswer = answer;
  let actionsData: ChatAction[] = [];

  let answerToProcess = answer;
  if (userWantsDraft && answerToProcess.includes("<email_action>")) {
    answerToProcess = answerToProcess.replace(/<email_action>/g, "<draft_action>").replace(/<\/email_action>/g, "</draft_action>");
  }

  // Parse all actions
  const actionTags = [
    { tag: "email_action", type: "email" },
    { tag: "draft_action", type: "draft" },
    { tag: "calendar_action", type: "calendar" },
    { tag: "calendar_update_action", type: "calendar_update" },
    { tag: "calendar_cancel_action", type: "calendar_cancel" },
    { tag: "whatsapp_action", type: "whatsapp" },
    { tag: "whatsapp_read_action", type: "whatsapp_read" },
    { tag: "email_read_action", type: "email_read" },
    { tag: "email_inbox_view", type: "email_inbox_view" },
    { tag: "email_detail_view", type: "email_detail_view" },
    { tag: "email_compose_view", type: "email_compose_view" },
    { tag: "calendar_agenda_view", type: "calendar_agenda_view" },
    { tag: "whatsapp_chat_view", type: "whatsapp_chat_view" },
    { tag: "slack_channel_view", type: "slack_channel_view" }
  ] as const;

  for (const { tag, type } of actionTags) {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "g");
    let match;
    while ((match = regex.exec(answerToProcess)) !== null) {
      try {
        const parsed = JSON.parse(match[1].trim());
        let richData: Record<string, unknown>[] | undefined;
        const arrayKeys = ["emails", "events", "messages"];
        for (const key of arrayKeys) {
          if (Array.isArray(parsed[key])) {
            richData = parsed[key];
            break;
          }
        }
        const status = (type.includes("_view") && type !== "email_compose_view") || type.includes("_read") ? "completed" : "pending";
        
        actionsData.push({
          id: uuid(),
          type: type as ChatAction["type"],
          payload: parsed,
          richData,
          status: status as "pending" | "completed",
        });
        
        // Remove the parsed block from the final answer text
        finalAnswer = finalAnswer.replace(match[0], "").trim();
      } catch (err) {
        console.error(`Failed to parse ${tag} JSON:`, err);
      }
    }
  }

  // SAFETY NET: Never allow an empty response bubble
  if (!finalAnswer || !finalAnswer.trim()) {
    // Strip any XML tags from the raw answer and use that
    const stripped = answer
      .replace(/<email_action>[\s\S]*?<\/email_action>/g, "")
      .replace(/<draft_action>[\s\S]*?<\/draft_action>/g, "")
      .replace(/<calendar_action>[\s\S]*?<\/calendar_action>/g, "")
      .replace(/<calendar_update_action>[\s\S]*?<\/calendar_update_action>/g, "")
      .replace(/<calendar_cancel_action>[\s\S]*?<\/calendar_cancel_action>/g, "")
      .replace(/<whatsapp_action>[\s\S]*?<\/whatsapp_action>/g, "")
      .replace(/<whatsapp_read_action>[\s\S]*?<\/whatsapp_read_action>/g, "")
      .replace(/<email_read_action>[\s\S]*?<\/email_read_action>/g, "")
      .replace(/<email_inbox_view>[\s\S]*?<\/email_inbox_view>/g, "")
      .replace(/<email_detail_view>[\s\S]*?<\/email_detail_view>/g, "")
      .replace(/<email_compose_view>[\s\S]*?<\/email_compose_view>/g, "")
      .replace(/<calendar_agenda_view>[\s\S]*?<\/calendar_agenda_view>/g, "")
      .replace(/<whatsapp_chat_view>[\s\S]*?<\/whatsapp_chat_view>/g, "")
      .replace(/<slack_channel_view>[\s\S]*?<\/slack_channel_view>/g, "")
      .trim();
    finalAnswer = stripped || (actionsData.length > 0 ? "Here's what I found:" : "I processed your request.");
    console.log("[chat/ask] SAFETY NET: finalAnswer was empty, using fallback");
  }

  const assistantMessage: ChatMessage = {
    id: uuid(),
    userId: session.userId,
    role: "assistant",
    content: finalAnswer,
    createdAt: new Date().toISOString(),
    actions: actionsData,
    platformContext: parsed.data.activePlatform || "all",
  };
  insertOne<ChatMessage>(COLLECTION, assistantMessage);

  return NextResponse.json({ answer: finalAnswer, messageId: assistantMessage.id, actions: actionsData });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const history = findMany<ChatMessage>(COLLECTION, (m) => m.userId === session.userId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return NextResponse.json({ history });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  deleteWhere<ChatMessage>(COLLECTION, (m) => m.userId === session.userId);
  return NextResponse.json({ ok: true });
}
