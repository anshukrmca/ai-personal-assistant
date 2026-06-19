import { v4 as uuid } from "uuid";
import { findMany, readCollection, writeCollection } from "./jsonStore";
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

// Realistic-looking mock data standing in for synced platform content
// (see Section 5: Example MCP Actions — this simulates what gmail_search_inbox,
// calendar list, slack history, etc. would return).
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

export function seedFeedForUser(userId: string, connectedSources: ItemSource[]): void {
  const all = readCollection<FeedItem>(COLLECTION);
  const withoutUser = all.filter((item) => item.userId !== userId);

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

  writeCollection(COLLECTION, [...withoutUser, ...items]);
}

export function getFeedForUser(userId: string): FeedItem[] {
  return findMany<FeedItem>(COLLECTION, (i) => i.userId === userId).sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
}

export function markRead(userId: string, itemId: string): void {
  const items = readCollection<FeedItem>(COLLECTION);
  const updated = items.map((i) =>
    i.userId === userId && i.id === itemId ? { ...i, isRead: true } : i
  );
  writeCollection(COLLECTION, updated);
}

export function updateItemPriority(userId: string, itemId: string, priority: Priority): void {
  const items = readCollection<FeedItem>(COLLECTION);
  const updated = items.map((i) =>
    i.userId === userId && i.id === itemId ? { ...i, priority } : i
  );
  writeCollection(COLLECTION, updated);
}

export function platformToSource(platform: IntegrationPlatform): ItemSource {
  return platform as unknown as ItemSource;
}
