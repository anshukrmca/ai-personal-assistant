import { findMany, insertOne, updateWhere } from "./jsonStore";
import type { Integration, IntegrationPlatform, IntegrationStatus } from "../types";
import { ALL_PLATFORMS } from "../platformMeta";

const COLLECTION = "integrations";

export function getIntegrationsForUser(userId: string): Integration[] {
  const existing = findMany<Integration>(COLLECTION, (i) => i.userId === userId);
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

export function connectIntegration(
  userId: string,
  platform: IntegrationPlatform
): Integration {
  const now = new Date().toISOString();
  const existing = findMany<Integration>(
    COLLECTION,
    (i) => i.userId === userId && i.platform === platform
  );

  if (existing.length === 0) {
    return insertOne<Integration>(COLLECTION, {
      userId,
      platform,
      status: "connected",
      connectedAt: now,
      lastSyncedAt: now,
    });
  }

  const updated = updateWhere<Integration>(
    COLLECTION,
    (i) => i.userId === userId && i.platform === platform,
    (i) => ({ ...i, status: "connected" as IntegrationStatus, connectedAt: now, lastSyncedAt: now })
  );
  return updated.find((i) => i.userId === userId && i.platform === platform)!;
}

export function disconnectIntegration(
  userId: string,
  platform: IntegrationPlatform
): void {
  updateWhere<Integration>(
    COLLECTION,
    (i) => i.userId === userId && i.platform === platform,
    (i) => ({ ...i, status: "disconnected" as IntegrationStatus, connectedAt: null })
  );
}
