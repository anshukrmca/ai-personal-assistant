import { getDb } from "./mongoClient";
import type { Integration, IntegrationPlatform, IntegrationStatus } from "../types";
import { ALL_PLATFORMS } from "../platformMeta";

const COLLECTION = "integrations";

export async function getIntegrationsForUser(userId: string): Promise<Integration[]> {
  const db = await getDb();
  const cursor = await db.collection(COLLECTION).find({ userId });
  const existing = (await cursor.toArray()) as unknown as Integration[];
  const existingPlatforms = new Set(existing.map((i) => i.platform));

  // Ensure every platform has a row (defaults to disconnected) so the UI
  // always has something to render without special-casing "never seen".
  const missing = ALL_PLATFORMS.filter((p) => !existingPlatforms.has(p)).map(
    (platform): Integration => ({
      userId,
      platform,
      status: "disconnected",
      connectedAt: null,
      lastSyncedAt: null,
    })
  );

  return [...existing, ...missing].sort(
    (a, b) => ALL_PLATFORMS.indexOf(a.platform) - ALL_PLATFORMS.indexOf(b.platform)
  );
}

export async function connectIntegration(
  userId: string,
  platform: IntegrationPlatform
): Promise<Integration> {
  const db = await getDb();
  const now = new Date().toISOString();
  
  const updateDoc = {
    $set: {
      status: "connected" as IntegrationStatus,
      connectedAt: now,
      lastSyncedAt: now,
    },
    $setOnInsert: {
      userId,
      platform,
    }
  };

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { userId, platform },
    updateDoc,
    { returnDocument: "after", upsert: true }
  );

  return result as unknown as Integration;
}

export async function disconnectIntegration(
  userId: string,
  platform: IntegrationPlatform
): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { userId, platform },
    {
      $set: {
        status: "disconnected" as IntegrationStatus,
        connectedAt: null,
      },
    }
  );
}
