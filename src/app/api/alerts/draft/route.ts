import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { draftAlertResponse } from "@/lib/ai/alerts";
import { z } from "zod";

const schema = z.object({
  item: z.any(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { item } = parsed.data;
    if (!item || !item.title) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }

    const draft = await draftAlertResponse(item);
    return NextResponse.json({ draft });
  } catch (err) {
    console.error("Alert draft error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
