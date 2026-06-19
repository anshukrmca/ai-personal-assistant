import { findOne, insertOne, updateWhere } from "./jsonStore";

export interface OAuthToken {
  userId: string;
  platform: "google";
  accessToken: string;
  refreshToken?: string;
  expiresAt: string; // ISO string
}

const COLLECTION = "tokens";

export function getGoogleToken(userId: string): OAuthToken | undefined {
  return findOne<OAuthToken>(COLLECTION, (t) => t.userId === userId && t.platform === "google");
}

export function saveGoogleToken(
  userId: string,
  tokens: { accessToken: string; refreshToken?: string; expiresAt: string }
): OAuthToken {
  const existing = getGoogleToken(userId);
  if (!existing) {
    return insertOne<OAuthToken>(COLLECTION, {
      userId,
      platform: "google",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    });
  }

  const updated = updateWhere<OAuthToken>(
    COLLECTION,
    (t) => t.userId === userId && t.platform === "google",
    (t) => ({
      ...t,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || t.refreshToken,
      expiresAt: tokens.expiresAt,
    })
  );
  return updated.find((t) => t.userId === userId && t.platform === "google")!;
}
