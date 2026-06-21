import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteChatSession } from "@/lib/db/messages";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const DELETE = withEncryption(async (
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Not authenticated", 401);
  }

  const { chatId } = await params;
  if (!chatId) {
    return ApiResponse.error("Missing chatId", 400);
  }

  await deleteChatSession(session.userId, chatId);

  return ApiResponse.success({ success: true });
});
