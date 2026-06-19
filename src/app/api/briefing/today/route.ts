import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFeedForUser } from "@/lib/db/feed";
import { getTodaysBriefing, saveBriefing } from "@/lib/db/briefings";
import { generateBriefing } from "@/lib/aiService";
import { syncGoogleData } from "@/lib/syncService";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Try to pull live Gmail and Google Calendar updates in the background (non-blocking)
  syncGoogleData(session.userId).catch((err) => {
    console.error("Failed to sync Google data in background during dashboard fetch:", err);
  });

  const items = getFeedForUser(session.userId);
  let briefing = getTodaysBriefing(session.userId);

  if (!briefing) {
    const result = await generateBriefing(items);
    briefing = saveBriefing(session.userId, result);
  }

  return NextResponse.json({ briefing, items });
}
