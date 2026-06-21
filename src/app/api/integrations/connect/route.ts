import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectIntegration, getIntegrationsForUser } from "@/lib/db/integrations";
import type { ItemSource } from "@/lib/types";
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

  const platform = parsed.data.platform;

  // Gmail & Google Calendar connect with real Google OAuth
  if (platform === "gmail" || platform === "google_calendar") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return ApiResponse.error("Google OAuth credentials are not fully configured in your .env.local file", 500);
    }

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: redirectUri,
      client_id: clientId,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/calendar",
      ].join(" "),
      state: platform, // Pass platform so callback knows whether to mark Gmail or Google Calendar as connected
    };
    const qs = new URLSearchParams(options).toString();
    const redirectUrl = `${rootUrl}?${qs}`;

    return ApiResponse.success({ ok: true, redirectUrl });
  }

  // Other platforms fall back to instant simulation connection
  const integration = await connectIntegration(session.userId, platform);

  return ApiResponse.success({ ok: true, integration });
});
