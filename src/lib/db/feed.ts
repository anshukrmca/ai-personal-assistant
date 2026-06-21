import { v4 as uuid } from "uuid";
import { getDb } from "./mongoClient";
import type { FeedItem, IntegrationPlatform, ItemSource, Priority } from "../types";

const COLLECTION = "feedItems";
export async function insertFeedItems(items: FeedItem[]): Promise<void> {
  if (items.length === 0) return;
  const db = await getDb();
  await db.collection(COLLECTION).insertMany(items as any[]);
}

export async function deleteFeedItemsBySource(userId: string, sources: string[]): Promise<void> {
  if (sources.length === 0) return;
  const db = await getDb();
  await db.collection(COLLECTION).deleteMany({ 
    userId, 
    source: { $in: sources } 
  });
}

export async function getFeedForUser(userId: string): Promise<FeedItem[]> {
  const db = await getDb();
  const cursor = await db.collection(COLLECTION)
    .find({ userId })
    .sort({ receivedAt: -1 }); // relies on ISO strings sorting naturally, or convert to dates
  return (await cursor.toArray()) as unknown as FeedItem[];
}

export async function markRead(userId: string, itemId: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { userId, id: itemId },
    { $set: { isRead: true } }
  );
}

export async function updateItemPriority(userId: string, itemId: string, priority: Priority): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { userId, id: itemId },
    { $set: { priority } }
  );
}

export function platformToSource(platform: IntegrationPlatform): ItemSource {
  return platform as unknown as ItemSource;
}
