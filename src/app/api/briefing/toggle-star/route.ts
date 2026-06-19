import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateItemPriority } from "@/lib/db/feed";
import { toggleGmailStar } from "@/lib/syncService";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { itemId, starred } = await req.json();
    if (!itemId || starred === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const priority = starred ? "high" : "low";

    // 1. Update local database
    updateItemPriority(session.userId, itemId, priority);

    // 2. Update Gmail if applicable
    if (itemId.startsWith("gmail-")) {
      const ok = await toggleGmailStar(session.userId, itemId, starred);
      if (!ok) {
        console.warn(`Failed to toggle star for ${itemId} in real Gmail, but updated local DB.`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error in toggle-star API route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
