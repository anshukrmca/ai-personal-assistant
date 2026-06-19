import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readCollection, updateWhere } from "@/lib/db/jsonStore";
import { ChatMessage } from "@/lib/types";
import { sendGmailEmail, createGmailDraft, createCalendarEvent } from "@/lib/syncService";
import { z } from "zod";

const schema = z.object({
  messageId: z.string().min(1),
  actionId: z.string().optional(),
  payloadOverride: z.record(z.string(), z.any()).optional(),
});

const COLLECTION = "chatMessages";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { messageId, actionId, payloadOverride } = parsed.data;
    const messages = readCollection<ChatMessage>(COLLECTION);
    const message = messages.find((m) => m.id === messageId);

    if (!message || message.userId !== session.userId) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    let targetAction = message.actions?.find((a) => a.id === actionId) || message.action;

    if (!targetAction) {
      return NextResponse.json({ error: "No action associated with this message" }, { status: 400 });
    }

    if (targetAction.status !== "pending") {
      return NextResponse.json({ error: "Action is no longer pending" }, { status: 400 });
    }

    let success = false;
    let { type, payload } = targetAction as { type: string, payload: any };

    if (payloadOverride) {
      payload = { ...payload, ...payloadOverride };
      updateWhere<ChatMessage>(
        COLLECTION,
        (m) => m.id === messageId,
        (m) => {
          if (m.actions && actionId) {
            const updatedActions = m.actions.map(a => a.id === actionId ? { ...a, payload } : a);
            return { ...m, actions: updatedActions };
          }
          return { ...m, action: { ...m.action!, payload } };
        }
      );
    }

    if (type === "email") {
      success = await sendGmailEmail(session.userId, payload.to, payload.subject, payload.body);
    } else if (type === "draft") {
      success = await createGmailDraft(session.userId, payload.to, payload.subject, payload.body);
    } else if (type === "calendar") {
      success = await createCalendarEvent(
        session.userId,
        payload.summary,
        payload.description || "",
        payload.startTime,
        payload.durationMinutes || 30,
        payload.attendees || []
      );
    } else if (type === "calendar_update") {
      const { updateCalendarEvent } = await import("@/lib/syncService");
      success = await updateCalendarEvent(
        session.userId,
        payload.targetEventId || payload.targetEvent, // Accept either ID or name, though ID is preferred
        {
          summary: payload.summary,
          description: payload.description,
          startTime: payload.startTime,
          durationMinutes: payload.durationMinutes,
          attendees: payload.attendees,
        }
      );
    } else if (type === "calendar_cancel") {
      const { cancelCalendarEvent } = await import("@/lib/syncService");
      success = await cancelCalendarEvent(
        session.userId,
        payload.targetEventId || payload.targetEvent
      );
    } else if (type === "whatsapp") {
      console.log("[Mock] Sending WhatsApp to:", payload.to, "Body:", payload.body);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
      success = true;
    }

    if (success) {
      updateWhere<ChatMessage>(
        COLLECTION,
        (m) => m.id === messageId,
        (m) => {
          if (m.actions && actionId) {
            const updatedActions = m.actions.map(a => a.id === actionId ? { ...a, status: "completed" as const } : a);
            return { ...m, actions: updatedActions };
          }
          return { ...m, action: { ...m.action!, status: "completed" as const } };
        }
      );
      return NextResponse.json({ ok: true });
    } else {
      updateWhere<ChatMessage>(
        COLLECTION,
        (m) => m.id === messageId,
        (m) => {
          if (m.actions && actionId) {
            const updatedActions = m.actions.map(a => a.id === actionId ? { ...a, status: "failed" as const } : a);
            return { ...m, actions: updatedActions };
          }
          return { ...m, action: { ...m.action!, status: "failed" as const } };
        }
      );
      return NextResponse.json({ error: "Action failed to execute via external API" }, { status: 500 });
    }
  } catch (err) {
    console.error("Execute action error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const messageId = url.searchParams.get("messageId");
    const actionId = url.searchParams.get("actionId");
    if (!messageId) return NextResponse.json({ error: "Missing messageId" }, { status: 400 });

    updateWhere<ChatMessage>(
      COLLECTION,
      (m) => m.id === messageId,
      (m) => {
          if (m.actions && actionId) {
            const updatedActions = m.actions.map(a => a.id === actionId ? { ...a, status: "failed" as const } : a);
            return { ...m, actions: updatedActions };
          }
          return { ...m, action: { ...m.action!, status: "failed" as const } };
      }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
