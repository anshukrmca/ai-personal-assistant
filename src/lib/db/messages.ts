import { getDb } from "./mongoClient";
import type { ChatMessage, ChatSession, ChatAction } from "../types";

const MESSAGES_COLLECTION = "chatMessages";
const SESSIONS_COLLECTION = "chatSessions";

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const db = await getDb();
  const cursor = await db.collection(SESSIONS_COLLECTION)
    .find({ userId })
    .sort({ updatedAt: -1 });
  return (await cursor.toArray()) as unknown as ChatSession[];
}

export async function getChatSessionById(chatId: string): Promise<ChatSession | null> {
  const db = await getDb();
  const session = await db.collection(SESSIONS_COLLECTION).findOne({ id: chatId });
  return session ? (session as unknown as ChatSession) : null;
}

export async function createChatSession(session: ChatSession): Promise<void> {
  const db = await getDb();
  await db.collection(SESSIONS_COLLECTION).insertOne({ ...session });
}

export async function deleteChatSession(userId: string, chatId: string): Promise<void> {
  const db = await getDb();
  // Delete the session
  await db.collection(SESSIONS_COLLECTION).deleteOne({ userId, id: chatId });
  // Delete all messages in the session
  await db.collection(MESSAGES_COLLECTION).deleteMany({ userId, chatId });
}

export async function updateSessionTitle(chatId: string, title: string): Promise<void> {
  const db = await getDb();
  await db.collection(SESSIONS_COLLECTION).updateOne(
    { id: chatId },
    { $set: { title, updatedAt: new Date().toISOString() } }
  );
}

export async function getMessageHistory(userId: string, chatId: string): Promise<ChatMessage[]> {
  const db = await getDb();
  const cursor = await db.collection(MESSAGES_COLLECTION)
    .find({ userId, chatId })
    .sort({ createdAt: 1 });
  return (await cursor.toArray()) as unknown as ChatMessage[];
}

export async function insertMessage(message: ChatMessage): Promise<void> {
  const db = await getDb();
  await db.collection(MESSAGES_COLLECTION).insertOne({ ...message });
  
  // Auto-update the session's updatedAt timestamp
  await db.collection(SESSIONS_COLLECTION).updateOne(
    { id: message.chatId },
    { $set: { updatedAt: message.createdAt } }
  );
}

// Deprecated: For legacy "Clear History" route before sessions were added
export async function clearHistory(userId: string): Promise<void> {
  const db = await getDb();
  await db.collection(MESSAGES_COLLECTION).deleteMany({ userId });
  await db.collection(SESSIONS_COLLECTION).deleteMany({ userId });
}

export async function findMessageById(id: string): Promise<ChatMessage | null> {
  const db = await getDb();
  const msg = await db.collection(MESSAGES_COLLECTION).findOne({ id });
  return msg ? (msg as unknown as ChatMessage) : null;
}

export async function updateMessageActions(
  messageId: string,
  updater: (msg: ChatMessage) => ChatMessage
): Promise<void> {
  const db = await getDb();
  const msg = await findMessageById(messageId);
  if (!msg) return;

  const updatedMsg = updater(msg);

  await db.collection(MESSAGES_COLLECTION).updateOne(
    { id: messageId },
    { $set: { action: updatedMsg.action, actions: updatedMsg.actions } }
  );
}
