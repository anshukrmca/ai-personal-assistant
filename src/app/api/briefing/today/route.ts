import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFeedForUser } from "@/lib/db/feed";
import { getTodaysBriefing, saveBriefing } from "@/lib/db/briefings";
import { generateBriefing } from "@/lib/aiService";
import { syncGoogleData } from "@/lib/syncService";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const GET = withEncryption(async () => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Not authenticated", 401);
  }

  // Try to pull live Gmail and Google Calendar updates in the background (non-blocking)
  syncGoogleData(session.userId).catch((err) => {
    console.error("Failed to sync Google data in background during dashboard fetch:", err);
  });

  const items = await getFeedForUser(session.userId);
  let briefing = await getTodaysBriefing(session.userId);

  if (!briefing) {
    const result = await generateBriefing(items);
    briefing = await saveBriefing(session.userId, result);
  }

  return ApiResponse.success({ briefing, items });
});
