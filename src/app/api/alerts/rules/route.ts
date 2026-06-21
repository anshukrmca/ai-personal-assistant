import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFeedForUser } from "@/lib/db/feed";
import { suggestAlertRules } from "@/lib/ai/alerts";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const GET = withEncryption(async () => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Unauthorized", 401);
  }

  try {
    const items = await getFeedForUser(session.userId);
    const rules = await suggestAlertRules(items);
    return ApiResponse.success({ rules });
  } catch (err) {
    console.error("Alert rules error:", err);
    return ApiResponse.error("Internal server error", 500);
  }
});
