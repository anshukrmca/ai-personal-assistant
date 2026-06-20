import { v4 as uuid } from "uuid";
import { getDb } from "./mongoClient";
import type { Briefing } from "../types";

const COLLECTION = "briefings";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getTodaysBriefing(userId: string): Promise<Briefing | null> {
  const db = await getDb();
  const briefing = await db.collection(COLLECTION).findOne({
    userId,
    date: todayKey(),
  });
  return briefing ? (briefing as unknown as Briefing) : null;
}

export async function saveBriefing(
  userId: string,
  fields: Pick<
    Briefing,
    "summary" | "meetingsCount" | "importantAlertsCount" | "pendingFollowUpsCount"
  >
): Promise<Briefing> {
  const date = todayKey();
  const db = await getDb();
  
  const briefing: Briefing = {
    id: uuid(),
    userId,
    date,
    generatedAt: new Date().toISOString(),
    ...fields,
  };

  await db.collection(COLLECTION).findOneAndReplace(
    { userId, date },
    { ...briefing },
    { upsert: true }
  );

  return briefing;
}
