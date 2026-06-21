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
  if (!token) return null;
  
  try {
    const decodedToken = await adminAuth.verifySessionCookie(token, true);
    return {
      userId: decodedToken.uid,
      phoneNumber: decodedToken.phone_number || "",
    };
  } catch (err) {
    return null;
  }
}
