import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFeedForUser } from "@/lib/db/feed";
import { saveBriefing } from "@/lib/db/briefings";
import { generateBriefing } from "@/lib/aiService";
import { syncGoogleData } from "@/lib/syncService";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const POST = withEncryption(async () => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Not authenticated", 401);
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

  return ApiResponse.success({ briefing, items });
});
