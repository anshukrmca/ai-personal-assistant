import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFeedForUser } from "@/lib/db/feed";
import { suggestAlertRules } from "@/lib/ai/alerts";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await getFeedForUser(session.userId);
    const rules = await suggestAlertRules(items);
    return NextResponse.json({ rules });
  } catch (err) {
    console.error("Alert rules error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
