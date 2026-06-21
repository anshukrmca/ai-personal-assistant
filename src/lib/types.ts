// Shared domain types — these mirror the InsForge schema from the
// architecture doc (see Section 10: Database Schema) so swapping the
// storage engine later doesn't require touching application code.

export type AuthProvider = "sms" | "whatsapp" | "google" | "linkedin" | "email";

export interface User {
  userId: string;
  phoneNumber: string;
  authProvider: AuthProvider;
  name: string;
  avatar: string; // emoji placeholder, swap for real URL later
  email: string | null;
  username: string | null;
  country: string | null;
  timezone: string | null;
  bio: string | null;
  createdAt: string;
  lastLogin: string;
  sessionKeys?: {
    key: string;
    iv: string;
  };
}

export interface OtpRecord {
  phoneNumber: string;
  code: string;
  channel: AuthProvider;
  expiresAt: string;
  attempts: number;
}

export type IntegrationPlatform =
  | "gmail"
  | "google_calendar"
  | "slack"
  | "whatsapp"
  | "outlook"
  | "discord"
  | "linkedin"
  | "telegram";

export type IntegrationStatus = "connected" | "disconnected" | "needs_reconnect";

export interface Integration {
  userId: string;
  platform: IntegrationPlatform;
  status: IntegrationStatus;
  connectedAt: string | null;
  lastSyncedAt: string | null;
}

export type ItemSource =
  | "gmail"
  | "google_calendar"
  | "slack"
  | "whatsapp"
  | "outlook"
  | "discord"
  | "linkedin"
  | "telegram";

export type Priority = "high" | "medium" | "low";

export interface FeedItem {
  id: string;
  userId: string;
  source: ItemSource;
  type: "email" | "message" | "meeting" | "mention" | "reminder";
  title: string;
  snippet: string;
  from: string;
  priority: Priority;
  folder?: string;
  receivedAt: string;
  isRead: boolean;
  requiresFollowUp: boolean;
}

export interface Briefing {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  summary: string;
  meetingsCount: number;
  importantAlertsCount: number;
  pendingFollowUpsCount: number;
  generatedAt: string;
}

export interface ChatAction {
  id?: string;
  type:
    //basic email and calendar actions
    | "email" | "draft" | "email_read"
    | "calendar" | "calendar_update" | "calendar_cancel" 
    | "whatsapp" | "whatsapp_read" 
    // Rich platform-specific view types
    | "email_inbox_view" | "email_detail_view" | "email_compose_view"
    | "calendar_agenda_view"
    | "whatsapp_chat_view"
    | "slack_channel_view";
  payload: Record<string, unknown>;
  richData?: Record<string, unknown>[]; // Array data for list views (e.g. inbox emails, agenda events)
  status: "pending" | "completed" | "failed";
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  action?: ChatAction; // Retained for backward compatibility
  actions?: ChatAction[];
  platformContext?: string;
}

export interface SessionPayload {
  userId: string;
  phoneNumber: string;
}
