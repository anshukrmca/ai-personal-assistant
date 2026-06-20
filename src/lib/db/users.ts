import { v4 as uuid } from "uuid";
import { getDb } from "./mongoClient";
import type { AuthProvider, User } from "../types";

const COLLECTION = "users";

export async function getUserByPhone(phoneNumber: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection(COLLECTION).findOne({ phoneNumber });
  return user ? (user as unknown as User) : null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection(COLLECTION).findOne({ userId });
  return user ? (user as unknown as User) : null;
}

export async function createUser(phoneNumber: string, authProvider: AuthProvider): Promise<User> {
  const now = new Date().toISOString();
  const user: User = {
    userId: uuid(),
    phoneNumber,
    authProvider,
    name: "New User",
    avatar: "🙂",
    email: null,
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
  fields: Partial<Pick<User, "name" | "email" | "avatar">>
): Promise<User | null> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { userId },
    { $set: fields },
    { returnDocument: "after" }
  );
  return result ? (result as unknown as User) : null;
}
