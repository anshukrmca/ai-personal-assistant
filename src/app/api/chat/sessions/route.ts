import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getChatSessions, createChatSession } from "@/lib/db/messages";
import { v4 as uuid } from "uuid";
import type { ChatSession } from "@/lib/types";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const GET = withEncryption(async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Not authenticated", 401);
  }
  const sessions = await getChatSessions(session.userId);
  return ApiResponse.success({ sessions });
});

export const POST = withEncryption(async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Not authenticated", 401);
  }

  const { title } = await req.json().catch(() => ({ title: "New Chat" }));

  const newSession: ChatSession = {
    id: `chat-${uuid()}`,
    userId: session.userId,
    title: title || "New Chat",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await createChatSession(newSession);

  return ApiResponse.success(newSession);
});
