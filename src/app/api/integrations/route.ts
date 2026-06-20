import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getIntegrationsForUser } from "@/lib/db/integrations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const integrations = await getIntegrationsForUser(session.userId);
  return NextResponse.json({ integrations });
}
