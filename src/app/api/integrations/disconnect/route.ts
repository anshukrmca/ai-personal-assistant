import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { disconnectIntegration, getIntegrationsForUser } from "@/lib/db/integrations";
import { seedFeedForUser, platformToSource } from "@/lib/db/feed";
import type { ItemSource } from "@/lib/types";

const schema = z.object({
  platform: z.enum([
    "gmail",
    "google_calendar",
    "slack",
    "whatsapp",
    "outlook",
    "discord",
    "linkedin",
    "telegram",
  ]),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  await disconnectIntegration(session.userId, parsed.data.platform);

  const allIntegrations = await getIntegrationsForUser(session.userId);
  const connectedSources = allIntegrations
    .filter((i) => i.status === "connected")
    .map((i) => platformToSource(i.platform)) as ItemSource[];

  await seedFeedForUser(session.userId, connectedSources);

  return NextResponse.json({ ok: true });
}
