import { NextResponse } from "next/server";
import { getProviderName } from "@/lib/aiService";

export async function GET() {
  return NextResponse.json({
    aiProvider: getProviderName(),
    mockOtp: !process.env.SENTDM_API_KEY,
    mockData: true, // always true until real OAuth is wired
  });
}
