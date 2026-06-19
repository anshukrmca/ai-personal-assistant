import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOtp, peekOtpForDev } from "@/lib/db/otp";

const schema = z.object({
  phoneNumber: z.string().min(7, "Enter a valid phone number"),
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

  const { phoneNumber, channel } = parsed.data;
  createOtp(phoneNumber, channel);

  // In production this is where Sent.dm's API would be called to actually
  // deliver the OTP over SMS/WhatsApp/RCS. Until SENTDM_API_KEY is wired
  // up, we simulate delivery and surface the code directly for local dev.
  const devCode = process.env.SENTDM_API_KEY ? null : peekOtpForDev(phoneNumber);

  return NextResponse.json({
    ok: true,
    message: `OTP sent via ${channel === "sms" ? "SMS" : "WhatsApp"}.`,
    devCode, // null once a real Sent.dm key is configured
  });
}
