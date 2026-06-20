import { Db } from "mongodb";

export async function setupIndexes(db: Db) {
  try {
    // Users collection
    await db.collection("users").createIndex({ phoneNumber: 1 }, { unique: true });
    await db.collection("users").createIndex({ userId: 1 }, { unique: true });

    // OTPs collection
    await db.collection("otps").createIndex({ phoneNumber: 1 });
    // TTL index: auto-deletes document when current time > expiresAt
    await db.collection("otps").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Integrations collection
    await db.collection("integrations").createIndex({ userId: 1, platform: 1 }, { unique: true });

    // FeedItems collection
    await db.collection("feedItems").createIndex({ userId: 1, receivedAt: -1 });

    // Briefings collection
    await db.collection("briefings").createIndex({ userId: 1, date: 1 }, { unique: true });

    // ChatSessions collection
    await db.collection("chatSessions").createIndex({ userId: 1, updatedAt: -1 });

    // ChatMessages collection
    await db.collection("chatMessages").createIndex({ userId: 1, chatId: 1, createdAt: 1 });

    // Tokens collection
    await db.collection("tokens").createIndex({ userId: 1, platform: 1 }, { unique: true });

    console.log("[MongoDB] Indexes verified/created successfully.");
  } catch (error) {
    console.error("[MongoDB] Failed to setup indexes:", error);
  }
}
