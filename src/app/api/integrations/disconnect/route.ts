import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { disconnectIntegration } from "@/lib/db/integrations";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

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

export const POST = withEncryption(async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Not authenticated", 401);
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return ApiResponse.error("Invalid platform", 400);
  }

  await disconnectIntegration(session.userId, parsed.data.platform);

  return ApiResponse.success({ ok: true });
});
