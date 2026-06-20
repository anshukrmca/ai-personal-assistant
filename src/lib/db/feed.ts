import { v4 as uuid } from "uuid";
import { getDb } from "./mongoClient";
import type { FeedItem, IntegrationPlatform, ItemSource, Priority } from "../types";

const COLLECTION = "feedItems";

interface SeedTemplate {
  source: ItemSource;
  type: FeedItem["type"];
  title: string;
  snippet: string;
  from: string;
  priority: Priority;
  requiresFollowUp: boolean;
  minutesAgo: number;
}

const SEED_TEMPLATES: SeedTemplate[] = [
  {
    source: "gmail",
    type: "email",
    title: "Q3 Report — Action Needed",
    snippet: "Please review the attached numbers before the board call tomorrow.",
    from: "priya.sharma@company.com",
    priority: "high",
    requiresFollowUp: true,
    minutesAgo: 42,
  },
  {
    source: "gmail",
    type: "email",
    title: "Invoice #4471 from CloudHost",
    snippet: "Your monthly hosting invoice is ready. Payment due in 14 days.",
    from: "billing@cloudhost.io",
    priority: "low",
    requiresFollowUp: false,
    minutesAgo: 130,
  },
  {
    source: "gmail",
    type: "email",
    title: "Re: Contract renewal terms",
    snippet: "We can extend the deadline to Friday — let me know if that works.",
    from: "legal@partnerfirm.com",
    priority: "medium",
    requiresFollowUp: true,
    minutesAgo: 260,
  },
  {
    source: "google_calendar",
    type: "meeting",
    title: "Product Sync — Roadmap Review",
    snippet: "10:30 AM · 30 min · with Design + Eng leads",
    from: "Calendar",
    priority: "high",
    requiresFollowUp: false,
    minutesAgo: 15,
  },
  {
    source: "google_calendar",
    type: "meeting",
    title: "1:1 with Manager",
    snippet: "3:00 PM · 25 min",
    from: "Calendar",
    priority: "medium",
    requiresFollowUp: false,
    minutesAgo: 5,
  },
  {
    source: "slack",
    type: "mention",
    title: "Mentioned in #launch-readiness",
    snippet: "@you can you confirm the rollback plan before EOD?",
    from: "Arjun (#launch-readiness)",
    priority: "high",
    requiresFollowUp: true,
    minutesAgo: 22,
  },
  {
    source: "slack",
    type: "message",
    title: "New message in #design-reviews",
    snippet: "Updated mockups are up for the onboarding flow — thoughts welcome.",
    from: "Meera (#design-reviews)",
    priority: "low",
    requiresFollowUp: false,
    minutesAgo: 95,
  },
  {
    source: "whatsapp",
    type: "message",
    title: "WhatsApp from Rohan",
    snippet: "Are we still on for the 6pm call? Can shift to 6:30 if needed.",
    from: "Rohan",
    priority: "medium",
    requiresFollowUp: true,
    minutesAgo: 8,
  },
  {
    source: "outlook",
    type: "email",
    title: "Vendor proposal — pricing attached",
    snippet: "Attached is the revised pricing sheet you asked for last week.",
    from: "sales@vendorco.com",
    priority: "low",
    requiresFollowUp: false,
    minutesAgo: 310,
  },
  {
    source: "discord",
    type: "mention",
    title: "Mentioned in #dev-alerts",
    snippet: "Build #2291 failed on main — needs a look before deploy.",
    from: "CI Bot (#dev-alerts)",
    priority: "high",
    requiresFollowUp: true,
    minutesAgo: 3,
  },
];

export async function seedFeedForUser(userId: string, connectedSources: ItemSource[]): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteMany({ userId });

  const now = Date.now();
  const items: FeedItem[] = SEED_TEMPLATES.filter((t) =>
    connectedSources.includes(t.source)
  ).map((t) => ({
    id: uuid(),
    userId,
    source: t.source,
    type: t.type,
    title: t.title,
    snippet: t.snippet,
    from: t.from,
    priority: t.priority,
    receivedAt: new Date(now - t.minutesAgo * 60_000).toISOString(),
    isRead: false,
    requiresFollowUp: t.requiresFollowUp,
  }));

  if (items.length > 0) {
    await db.collection(COLLECTION).insertMany(items as any[]);
  }
}

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
