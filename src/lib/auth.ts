import { cookies } from "next/headers";
import { adminAuth } from "./firebase/admin";
import type { SessionPayload } from "./types";

const SESSION_COOKIE = "ai_assistant_session";
const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SESSION_EXPIRY_MS = SESSION_EXPIRY_SECONDS * 1000;

export async function createAndSetSessionCookie(idToken: string) {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRY_MS });
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  console.log("[AUTH] getSession called, cookie present:", !!token, token ? `(${token.substring(0, 20)}...)` : "");
  if (!token) return null;
  
  try {
    const decodedToken = await adminAuth.verifySessionCookie(token, false);
    return {
      userId: decodedToken.uid,
      phoneNumber: decodedToken.phone_number || "",
    };
  } catch (err) {
    try {
      // Fallback: If it's an ID token instead of a session cookie, try verifying it as an ID token
      const decodedIdToken = await adminAuth.verifyIdToken(token);
      return {
        userId: decodedIdToken.uid,
        phoneNumber: decodedIdToken.phone_number || "",
      };
    } catch (err2) {
      console.error("verifySessionCookie and verifyIdToken both failed:", err2);
      // Clear the corrupted/expired cookie so the user isn't stuck in a redirect loop
      store.delete(SESSION_COOKIE);
      return null;
    }
  }
}
