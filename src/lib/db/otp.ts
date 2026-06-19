import { deleteWhere, findOne, insertOne } from "./jsonStore";
import type { AuthProvider, OtpRecord } from "../types";

const COLLECTION = "otps";
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes, matches security doc
const MAX_ATTEMPTS = 3;

function generateCode(): string {
  // 6-digit numeric OTP, e.g. Sent.dm style
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createOtp(phoneNumber: string, channel: AuthProvider): OtpRecord {
  // Invalidate any existing OTP for this number first
  deleteWhere<OtpRecord>(COLLECTION, (o) => o.phoneNumber === phoneNumber);

  const record: OtpRecord = {
    phoneNumber,
    code: generateCode(),
    channel,
    expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    attempts: 0,
  };
  return insertOne<OtpRecord>(COLLECTION, record);
}

export type OtpVerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "incorrect" | "locked" };

export function verifyOtp(phoneNumber: string, code: string): OtpVerifyResult {
  const record = findOne<OtpRecord>(COLLECTION, (o) => o.phoneNumber === phoneNumber);
  if (!record) return { ok: false, reason: "not_found" };

  if (record.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: "locked" };
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    deleteWhere<OtpRecord>(COLLECTION, (o) => o.phoneNumber === phoneNumber);
    return { ok: false, reason: "expired" };
  }

  if (record.code !== code) {
    const updated = { ...record, attempts: record.attempts + 1 };
    deleteWhere<OtpRecord>(COLLECTION, (o) => o.phoneNumber === phoneNumber);
    insertOne<OtpRecord>(COLLECTION, updated);
    return { ok: false, reason: "incorrect" };
  }

  deleteWhere<OtpRecord>(COLLECTION, (o) => o.phoneNumber === phoneNumber);
  return { ok: true };
}

// Dev helper: lets the UI display the "sent" code since there's no real
// SMS/WhatsApp provider wired up yet (see Section 21: mock vs real APIs).
export function peekOtpForDev(phoneNumber: string): string | null {
  const record = findOne<OtpRecord>(COLLECTION, (o) => o.phoneNumber === phoneNumber);
  return record?.code ?? null;
}
