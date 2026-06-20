import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFeedForUser } from "@/lib/db/feed";
import { saveBriefing } from "@/lib/db/briefings";
import { generateBriefing } from "@/lib/aiService";
import { syncGoogleData } from "@/lib/syncService";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Pull live updates on refresh
  try {
    await syncGoogleData(session.userId);
  } catch (err) {
    console.error("Failed to sync Google data during manual briefing refresh:", err);
  }

  const items = await getFeedForUser(session.userId);
  const result = await generateBriefing(items);
  const briefing = await saveBriefing(session.userId, result);

  return NextResponse.json({ briefing, items });
}
