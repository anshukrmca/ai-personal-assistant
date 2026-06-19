import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtp } from "@/lib/db/otp";
import { createUser, getUserByPhone, touchLastLogin } from "@/lib/db/users";
import { signSession, setSessionCookie } from "@/lib/auth";
import { getIntegrationsForUser } from "@/lib/db/integrations";
import { seedFeedForUser } from "@/lib/db/feed";

const schema = z.object({
  phoneNumber: z.string().min(7),
  code: z.string().length(6),
  channel: z.enum(["sms", "whatsapp"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { phoneNumber, code, channel } = parsed.data;
  const result = verifyOtp(phoneNumber, code);

  if (!result.ok) {
    const messages: Record<string, string> = {
      not_found: "No OTP was requested for this number. Please request a new code.",
      expired: "This code has expired. Please request a new one.",
      incorrect: "Incorrect code. Please try again.",
      locked: "Too many failed attempts. Please request a new code.",
    };
    return NextResponse.json({ error: messages[result.reason] }, { status: 400 });
  }

  let user = getUserByPhone(phoneNumber);
  let isNewUser = false;

  if (!user) {
    user = createUser(phoneNumber, channel);
    isNewUser = true;
    // Give new users disconnected rows for every platform up front
    getIntegrationsForUser(user.userId);
    seedFeedForUser(user.userId, []);
  } else {
    touchLastLogin(user.userId);
  }

  const token = signSession({ userId: user.userId, phoneNumber: user.phoneNumber });
  await setSessionCookie(token);

  return NextResponse.json({
    ok: true,
    isNewUser,
    user: { userId: user.userId, phoneNumber: user.phoneNumber, name: user.name },
  });
}
