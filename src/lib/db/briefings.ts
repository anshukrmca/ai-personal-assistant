import { v4 as uuid } from "uuid";
import { deleteWhere, findOne, insertOne } from "./jsonStore";
import type { Briefing } from "../types";

const COLLECTION = "briefings";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getTodaysBriefing(userId: string): Briefing | undefined {
  return findOne<Briefing>(
    COLLECTION,
    (b) => b.userId === userId && b.date === todayKey()
  );
}

export function saveBriefing(
  userId: string,
  fields: Pick<
    Briefing,
    "summary" | "meetingsCount" | "importantAlertsCount" | "pendingFollowUpsCount"
  >
): Briefing {
  const date = todayKey();
  deleteWhere<Briefing>(COLLECTION, (b) => b.userId === userId && b.date === date);
  const briefing: Briefing = {
    id: uuid(),
    userId,
    date,
    generatedAt: new Date().toISOString(),
    ...fields,
  };
  return insertOne<Briefing>(COLLECTION, briefing);
}
