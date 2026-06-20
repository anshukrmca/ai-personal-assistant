import { getDb } from "./mongoClient";
import type { AuthProvider, OtpRecord } from "../types";

const COLLECTION = "otps";
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes, matches security doc
const MAX_ATTEMPTS = 3;

function generateCode(): string {
  // 6-digit numeric OTP, e.g. Sent.dm style
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(phoneNumber: string, channel: AuthProvider): Promise<OtpRecord> {
  const db = await getDb();
  // Invalidate any existing OTP for this number first
  await db.collection(COLLECTION).deleteMany({ phoneNumber });

  // Use a proper JS Date so MongoDB TTL index can work with expiresAt
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  
  const record = {
    phoneNumber,
    code: generateCode(),
    channel,
    expiresAt,
    attempts: 0,
  };
  await db.collection(COLLECTION).insertOne({ ...record });
  
  // Return the record mapped back to string dates for the rest of the app
  return {
    ...record,
    expiresAt: expiresAt.toISOString(),
  } as OtpRecord;
}

export type OtpVerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "incorrect" | "locked" };

export async function verifyOtp(phoneNumber: string, code: string): Promise<OtpVerifyResult> {
  const db = await getDb();
  const record = await db.collection(COLLECTION).findOne({ phoneNumber });
  
  if (!record) return { ok: false, reason: "not_found" };

  if (record.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: "locked" };
  }

  // MongoDB TTL should handle expiry, but we do a sanity check here too
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    await db.collection(COLLECTION).deleteMany({ phoneNumber });
    return { ok: false, reason: "expired" };
  }

  if (record.code !== code) {
    await db.collection(COLLECTION).updateOne(
      { phoneNumber },
      { $inc: { attempts: 1 } }
    );
    return { ok: false, reason: "incorrect" };
  }

  await db.collection(COLLECTION).deleteMany({ phoneNumber });
  return { ok: true };
}

// Dev helper: lets the UI display the "sent" code since there's no real
// SMS/WhatsApp provider wired up yet (see Section 21: mock vs real APIs).
export async function peekOtpForDev(phoneNumber: string): Promise<string | null> {
  const db = await getDb();
  const record = await db.collection(COLLECTION).findOne({ phoneNumber });
  return record?.code ?? null;
}
