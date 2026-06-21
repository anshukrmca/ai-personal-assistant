import { v4 as uuid } from "uuid";
import { getDb } from "./mongoClient";
import type { AuthProvider, User } from "../types";

const COLLECTION = "users";

export async function getUserByPhone(phoneNumber: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection(COLLECTION).findOne({ phoneNumber });
  return user ? (user as unknown as User) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection(COLLECTION).findOne({ email });
  return user ? (user as unknown as User) : null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection(COLLECTION).findOne({ userId });
  return user ? (user as unknown as User) : null;
}

export async function createUser(
  authProvider: AuthProvider,
  data: {
    userId?: string;
    phoneNumber?: string;
    email?: string | null;
    name?: string;
    avatar?: string;
    username?: string;
    country?: string;
    timezone?: string;
    bio?: string;
  }
): Promise<User> {
  const now = new Date().toISOString();
  const user: User = {
    userId: data.userId || uuid(),
    phoneNumber: data.phoneNumber || `NONE_${data.userId || Date.now()}`,
    authProvider,
    name: data.name || "New User",
    avatar: data.avatar || "🙂",
    email: data.email || null,
    username: data.username || null,
    country: data.country || null,
    timezone: data.timezone || null,
    bio: data.bio || null,
    createdAt: now,
    lastLogin: now,
  };
  const db = await getDb();
  await db.collection(COLLECTION).insertOne({ ...user });
  return user;
}

export async function touchLastLogin(userId: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { userId },
    { $set: { lastLogin: new Date().toISOString() } }
  );
}

export async function updateUserProfile(
  userId: string,
  fields: Partial<Pick<User, "name" | "email" | "avatar" | "username" | "country" | "timezone" | "bio" | "phoneNumber">>
): Promise<User | null> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { userId },
    { $set: fields },
    { returnDocument: "after" }
  );
  return result ? (result as unknown as User) : null;
}

export async function updateSessionKeys(
  userId: string,
  key: string,
  iv: string
): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { userId },
    { $set: { sessionKeys: { key, iv } } }
  );
}
