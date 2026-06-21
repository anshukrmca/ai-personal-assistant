import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateItemPriority } from "@/lib/db/feed";
import { toggleGmailStar } from "@/lib/syncService";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const POST = withEncryption(async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Not authenticated", 401);
  }

  try {
    const { itemId, starred } = await req.json();
    if (!itemId || starred === undefined) {
      return ApiResponse.error("Missing required parameters", 400);
    }

    const priority = starred ? "high" : "low";

    // 1. Update local database
    await updateItemPriority(session.userId, itemId, priority);

    // 2. Update Gmail if applicable
    if (itemId.startsWith("gmail-")) {
      const ok = await toggleGmailStar(session.userId, itemId, starred);
      if (!ok) {
        console.warn(`Failed to toggle star for ${itemId} in real Gmail, but updated local DB.`);
      }
    }

    return ApiResponse.success({ ok: true });
  } catch (err) {
    console.error("Error in toggle-star API route:", err);
    return ApiResponse.error("Internal server error", 500);
  }
});
