import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getChatSessions, createChatSession } from "@/lib/db/messages";
import { v4 as uuid } from "uuid";
import type { ChatSession } from "@/lib/types";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const sessions = await getChatSessions(session.userId);
  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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

  return NextResponse.json(newSession);
}
