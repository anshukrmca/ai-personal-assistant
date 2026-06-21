import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const POST = withEncryption(async () => {
  await clearSessionCookie();
  return ApiResponse.success({ ok: true });
});
