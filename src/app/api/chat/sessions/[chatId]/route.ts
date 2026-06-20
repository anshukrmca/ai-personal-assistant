import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteChatSession } from "@/lib/db/messages";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { chatId } = await params;
  if (!chatId) {
    return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
  }

  await deleteChatSession(session.userId, chatId);

  return NextResponse.json({ success: true });
}
