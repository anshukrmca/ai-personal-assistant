import { NextResponse } from "next/server";
import { createAndSetSessionCookie } from "@/lib/auth";
import { adminAuth } from "@/lib/firebase/admin";
import { createUser, getUserById } from "@/lib/db/users";
import { getIntegrationsForUser } from "@/lib/db/integrations";
import type { AuthProvider } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 400 });
    }

    // DEBUG: check environment variables
    const pk = process.env.FIREBASE_PRIVATE_KEY;
    const em = process.env.FIREBASE_CLIENT_EMAIL;
    const pid = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!pk || !em || !pid) {
      return NextResponse.json({ error: "Firebase Admin is missing environment variables", details: { hasPk: !!pk, hasEm: !!em, hasPid: !!pid, pkStart: pk?.substring(0, 10) } }, { status: 500 });
    }

    // Verify token to get user info
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture, phone_number, firebase } = decodedToken;
    
    // Determine provider from firebase.sign_in_provider
    let provider: AuthProvider = "email";
    if (firebase.sign_in_provider === "google.com") provider = "google";
    else if (firebase.sign_in_provider === "linkedin.com") provider = "linkedin";
    else if (firebase.sign_in_provider === "phone") provider = "sms";

    // Check if user exists
    let user = await getUserById(uid);
    let isNewUser = false;

    if (!user) {
      // Create user mapping uid to internal userId
      user = await createUser(provider, {
        userId: uid,
        phoneNumber: phone_number || "",
        email: email || null,
        name: name || "New User",
        avatar: picture || "🙂"
      });
      isNewUser = true;
      // Initialize integrations
      await getIntegrationsForUser(uid);
    }

    // Set secure HTTP-only cookie
    await createAndSetSessionCookie(idToken);

    return NextResponse.json({ ok: true, isNewUser, user });
  } catch (error: any) {
    console.error("Session creation failed", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
