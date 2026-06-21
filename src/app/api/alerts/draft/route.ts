import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { draftAlertResponse } from "@/lib/ai/alerts";
import { z } from "zod";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

const schema = z.object({
  item: z.any(),
});

export const POST = withEncryption(async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Unauthorized", 401);
  }

    try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error("Invalid request", 400);
    }

    const { item } = parsed.data;
    if (!item || !item.title) {
      return ApiResponse.error("Invalid item", 400);
    }

    const draft = await draftAlertResponse(item);
    return ApiResponse.success({ draft });
  } catch (err) {
    console.error("Alert draft error:", err);
    return ApiResponse.error("Internal server error", 500);
  }
});
