import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectIntegration } from "@/lib/db/integrations";
import { saveGoogleToken } from "@/lib/db/tokens";
import { syncGoogleData } from "@/lib/syncService";
import type { IntegrationPlatform } from "@/lib/types";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // Contains the platform "gmail" or "google_calendar"
  const error = searchParams.get("error");

  const redirectUrl = new URL("/integrations", req.url);

  if (error) {
    console.error("Google OAuth error:", error);
    redirectUrl.searchParams.set("error", `Google OAuth failed: ${error}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code || !state) {
    redirectUrl.searchParams.set("error", "Missing code or state parameters");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Exchange auth code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
         code,
         client_id: process.env.GOOGLE_CLIENT_ID!,
         client_secret: process.env.GOOGLE_CLIENT_SECRET!,
         redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
         grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Google token exchange error response:", errText);
      redirectUrl.searchParams.set("error", `Token exchange failed: ${tokenResponse.statusText}`);
      return NextResponse.redirect(redirectUrl);
    }

    const tokens = await tokenResponse.json();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Save tokens in JSON store
    await saveGoogleToken(session.userId, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token, // might only be sent on prompt=consent (consent is configured)
      expiresAt,
    });

    // Connect this platform
    const platform = state as IntegrationPlatform; // e.g. "gmail" or "google_calendar"
    await connectIntegration(session.userId, platform);

    // Trigger an initial background sync of live data immediately so user sees their actual data
    try {
      await syncGoogleData(session.userId);
    } catch (syncErr) {
      console.error("Failed initial Google sync:", syncErr);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Callback exception:", err);
    const message = err instanceof Error ? err.message : "Unknown error during callback";
    redirectUrl.searchParams.set("error", message);
    return NextResponse.redirect(redirectUrl);
  }
}
