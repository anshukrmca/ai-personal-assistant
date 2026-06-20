import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findMessageById, updateMessageActions } from "@/lib/db/messages";
import { ChatMessage } from "@/lib/types";
import { enhanceText } from "@/lib/aiService";
import { z } from "zod";

const schema = z.object({
  messageId: z.string().min(1),
  actionId: z.string().optional(),
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

    const { messageId, actionId } = parsed.data;
    const message = await findMessageById(messageId);

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

    const { type, payload } = targetAction as { type: string, payload: any };
    let newPayload = { ...payload };

    if (type === "email" || type === "draft") {
      newPayload.body = await enhanceText(payload.body, "email draft");
    } else if (type === "calendar") {
      if (payload.description) {
        newPayload.description = await enhanceText(payload.description, "calendar event description");
      }
    }

    await updateMessageActions(messageId, (m) => {
        if (m.actions && actionId) {
          const updatedActions = m.actions.map(a => a.id === actionId ? { ...a, payload: newPayload } : a);
          return { ...m, actions: updatedActions };
        }
        return { ...m, action: { ...m.action!, payload: newPayload } };
      }
    );

    return NextResponse.json({ ok: true, payload: newPayload });
  } catch (err) {
    console.error("Enhance action error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
