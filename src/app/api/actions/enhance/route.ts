import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findMessageById, updateMessageActions } from "@/lib/db/messages";
import { ChatMessage } from "@/lib/types";
import { enhanceText } from "@/lib/aiService";
import { z } from "zod";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

const schema = z.object({
  messageId: z.string().min(1),
  actionId: z.string().optional(),
});

const COLLECTION = "chatMessages";

export const POST = withEncryption(async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Unauthorized", 401);
  }

    try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error("Invalid request payload", 400);
    }

    const { messageId, actionId } = parsed.data;
    const message = await findMessageById(messageId);

    if (!message || message.userId !== session.userId) {
      return ApiResponse.error("Message not found", 404);
    }

    let targetAction = message.actions?.find((a) => a.id === actionId) || message.action;

    if (!targetAction) {
      return ApiResponse.error("No action associated with this message", 400);
    }

    if (targetAction.status !== "pending") {
      return ApiResponse.error("Action is no longer pending", 400);
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

    return ApiResponse.success({ ok: true, payload: newPayload });
  } catch (err) {
    console.error("Enhance action error:", err);
    return ApiResponse.error("Internal server error", 500);
  }
});
