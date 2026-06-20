import { getDb } from "./mongoClient";

export interface OAuthToken {
  userId: string;
  platform: "google";
  accessToken: string;
  refreshToken?: string;
  expiresAt: string; // ISO string
}

const COLLECTION = "tokens";

export async function getGoogleToken(userId: string): Promise<OAuthToken | null> {
  const db = await getDb();
  const token = await db.collection(COLLECTION).findOne({ userId, platform: "google" });
  return token ? (token as unknown as OAuthToken) : null;
}

export async function saveGoogleToken(
  userId: string,
  tokens: { accessToken: string; refreshToken?: string; expiresAt: string }
): Promise<OAuthToken> {
  const db = await getDb();
  
  const updateDoc: any = {
    $set: {
      accessToken: tokens.accessToken,
      expiresAt: tokens.expiresAt,
    },
    $setOnInsert: {
      userId,
      platform: "google",
    }
  };

  // Only update refresh token if a new one is provided
  if (tokens.refreshToken) {
    updateDoc.$set.refreshToken = tokens.refreshToken;
  }

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { userId, platform: "google" },
    updateDoc,
    { returnDocument: "after", upsert: true }
  );

  return result as unknown as OAuthToken;
}
