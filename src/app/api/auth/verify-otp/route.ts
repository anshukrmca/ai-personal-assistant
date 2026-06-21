import { NextResponse } from "next/server";

// Legacy OTP route - Disabled in favor of Firebase Auth
export async function POST() {
  return NextResponse.json(
    { error: "OTP Authentication has been migrated to Firebase. Please update your client." },
    { status: 410 }
  );
}
