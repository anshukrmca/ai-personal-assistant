import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { createUser, getUserById, updateSessionKeys } from "@/lib/db/users";
import { getIntegrationsForUser } from "@/lib/db/integrations";
import type { AuthProvider } from "@/lib/types";
import { CryptoUtil } from "@/lib/crypto";
import { ApiResponse } from "@/lib/apiResponse";

const SESSION_EXPIRY_MS = 60 * 60 * 24 * 7 * 1000; // 7 days
const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return ApiResponse.error("No ID token provided", 400);
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
      user = await createUser(provider, {
        userId: uid,
        phoneNumber: phone_number || "",
        email: email || null,
        name: name || "New User",
        avatar: picture || "🙂"
      });
      isNewUser = true;
      await getIntegrationsForUser(uid);
    } else {
      import("@/lib/db/users").then(m => m.touchLastLogin(uid));
    }

    // Generate Dynamic Keys for E2EE Session
    const encryptionKey = CryptoUtil.generateDynamicKey();
    const encryptionIv = CryptoUtil.generateDynamicIv();
    await updateSessionKeys(uid, encryptionKey, encryptionIv);

    // Create Firebase session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRY_MS });

    // Set cookie using next/headers (most reliable method in App Router)
    const cookieStore = await cookies();
    cookieStore.set("ai_assistant_session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_EXPIRY_SECONDS,
    });

    console.log("[SESSION] Cookie set successfully using next/headers for user:", uid);
    return ApiResponse.success({ ok: true, isNewUser, user, encryptionKey, encryptionIv });
  } catch (error: any) {
    console.error("Session creation failed:", error);
    return ApiResponse.error("Invalid token", 401);
  }
}
