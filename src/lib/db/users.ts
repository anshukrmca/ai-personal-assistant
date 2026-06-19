import { v4 as uuid } from "uuid";
import { findOne, insertOne, updateWhere } from "./jsonStore";
import type { AuthProvider, User } from "../types";

const COLLECTION = "users";

export function getUserByPhone(phoneNumber: string): User | undefined {
  return findOne<User>(COLLECTION, (u) => u.phoneNumber === phoneNumber);
}

export function getUserById(userId: string): User | undefined {
  return findOne<User>(COLLECTION, (u) => u.userId === userId);
}

export function createUser(phoneNumber: string, authProvider: AuthProvider): User {
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
  return insertOne<User>(COLLECTION, user);
}

export function touchLastLogin(userId: string): void {
  updateWhere<User>(
    COLLECTION,
    (u) => u.userId === userId,
    (u) => ({ ...u, lastLogin: new Date().toISOString() })
  );
}

export function updateUserProfile(
  userId: string,
  fields: Partial<Pick<User, "name" | "email" | "avatar">>
): User[] {
  return updateWhere<User>(
    COLLECTION,
    (u) => u.userId === userId,
    (u) => ({ ...u, ...fields })
  );
}
