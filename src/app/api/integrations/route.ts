import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getIntegrationsForUser } from "@/lib/db/integrations";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const GET = withEncryption(async () => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Not authenticated", 401);
  }

  const integrations = await getIntegrationsForUser(session.userId);
  return ApiResponse.success({ integrations });
});
