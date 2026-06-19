import type { IntegrationPlatform } from "@/lib/types";
import {
  Mail,
  Calendar,
  MessageSquare,
  Phone,
  Briefcase,
  MessageCircle,
  Users,
  Send,
  type LucideIcon,
} from "lucide-react";

export interface PlatformMeta {
  label: string;
  icon: LucideIcon;
  color: string; // brand-ish accent used sparingly on icon chip
  actions: string[];
  href?: string;
  desc?: string;
  // Future proofing fields for API integration
  apiBaseUrl?: string;
  authType?: "oauth2" | "api_key" | "webhook" | "custom";
  defaultScopes?: string[];
  syncIntervalMs?: number;
  
  // Advanced Integration Details
  oauthClientIdEnvKey?: string;
  oauthClientSecretEnvKey?: string;
  oauthRedirectUri?: string;
  webhookEndpoint?: string;
  rateLimitPerMinute?: number;
  docsUrl?: string;
  supportsRealtime?: boolean;
  features?: string[];
}

export const PLATFORM_META: Record<IntegrationPlatform, PlatformMeta> = {
  gmail: {
    label: "Gmail",
    icon: Mail,
    color: "#EA4335",
    actions: ["Read emails", "Search inbox", "Send email", "Get labels"],
    href: "/briefing/gmailbriefing",
    desc: "Review and respond to your latest unread emails.",
    apiBaseUrl: "https://gmail.googleapis.com/gmail/v1",
    authType: "oauth2",
    defaultScopes: ["https://www.googleapis.com/auth/gmail.modify"],
    syncIntervalMs: 5 * 60 * 1000, // 5 minutes
    oauthClientIdEnvKey: "GOOGLE_CLIENT_ID",
    oauthClientSecretEnvKey: "GOOGLE_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/google/callback",
    webhookEndpoint: "/api/webhooks/gmail",
    rateLimitPerMinute: 250, // Google API standard quota per user
    docsUrl: "https://developers.google.com/gmail/api/reference/rest",
    supportsRealtime: true, // Google Cloud Pub/Sub
    features: ["read", "write", "trash", "drafts", "labels", "attachments"],
  },
  google_calendar: {
    label: "Google Calendar",
    icon: Calendar,
    color: "#6E9FD8",
    actions: ["Check calendar", "Create event", "List meetings"],
    href: "/briefing/calendarbriefing",
    desc: "Review upcoming meetings and schedule changes.",
    apiBaseUrl: "https://www.googleapis.com/calendar/v3",
    authType: "oauth2",
    defaultScopes: ["https://www.googleapis.com/auth/calendar.events"],
    syncIntervalMs: 15 * 60 * 1000, // 15 minutes
    oauthClientIdEnvKey: "GOOGLE_CLIENT_ID",
    oauthClientSecretEnvKey: "GOOGLE_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/google/callback",
    webhookEndpoint: "/api/webhooks/google_calendar",
    rateLimitPerMinute: 500,
    docsUrl: "https://developers.google.com/calendar/api/v3/reference",
    supportsRealtime: true, // Push notifications
    features: ["read_events", "create_events", "update_events", "delete_events", "free_busy"],
  },
  slack: {
    label: "Slack",
    icon: MessageSquare,
    color: "#ECB22E",
    actions: ["Read channels", "Send message", "Search workspace", "Get mentions"],
    href: "/briefing/slackbriefing",
    desc: "Review mentions and direct messages across your Slack workspaces.",
    apiBaseUrl: "https://slack.com/api",
    authType: "oauth2",
    defaultScopes: ["channels:read", "chat:write", "users:read"],
    syncIntervalMs: 5 * 60 * 1000,
    oauthClientIdEnvKey: "SLACK_CLIENT_ID",
    oauthClientSecretEnvKey: "SLACK_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/slack/callback",
    webhookEndpoint: "/api/webhooks/slack",
    rateLimitPerMinute: 50, // Tier 3 usually
    docsUrl: "https://api.slack.com/methods",
    supportsRealtime: true, // Slack Events API
    features: ["read_messages", "send_messages", "read_channels", "threads", "reactions"],
  },
  whatsapp: {
    label: "WhatsApp",
    icon: Phone,
    color: "#25D366",
    actions: ["Read chats", "Send message", "Check contacts", "Get media info"],
    href: "/briefing/whatsappbriefing",
    desc: "Catch up on your latest messages and group chats.",
    apiBaseUrl: "https://graph.facebook.com/v17.0",
    authType: "api_key",
    defaultScopes: ["whatsapp_business_messaging"],
    syncIntervalMs: 1 * 60 * 1000, // 1 minute (realtime preferred)
    oauthClientIdEnvKey: "WHATSAPP_APP_ID",
    oauthClientSecretEnvKey: "WHATSAPP_APP_SECRET",
    webhookEndpoint: "/api/webhooks/whatsapp",
    rateLimitPerMinute: 80, // Cloud API rate limits
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api",
    supportsRealtime: true, // Webhooks are primary
    features: ["send_messages", "receive_messages", "media", "templates", "read_receipts"],
  },
  outlook: {
    label: "Outlook",
    icon: Briefcase,
    color: "#0A66C2",
    actions: ["Read mail", "Check calendar", "Send reply", "Create event"],
    href: "/briefing/outlookbriefing",
    desc: "Review your latest Microsoft Outlook emails and calendar events.",
    apiBaseUrl: "https://graph.microsoft.com/v1.0/me",
    authType: "oauth2",
    defaultScopes: ["Mail.ReadWrite", "Calendars.ReadWrite"],
    syncIntervalMs: 5 * 60 * 1000,
    oauthClientIdEnvKey: "MICROSOFT_CLIENT_ID",
    oauthClientSecretEnvKey: "MICROSOFT_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/outlook/callback",
    webhookEndpoint: "/api/webhooks/outlook",
    rateLimitPerMinute: 10000, // Generous Graph API limits
    docsUrl: "https://learn.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0",
    supportsRealtime: true, // Graph Subscriptions
    features: ["read_mail", "send_mail", "calendar", "contacts", "tasks"],
  },
  discord: {
    label: "Discord",
    icon: MessageCircle,
    color: "#5865F2",
    actions: ["Read server messages", "Send message", "Get members"],
    href: "/briefing/discordbriefing",
    desc: "Catch up on your servers and direct messages.",
    apiBaseUrl: "https://discord.com/api/v10",
    authType: "oauth2",
    defaultScopes: ["messages.read", "guilds"],
    syncIntervalMs: 5 * 60 * 1000,
    oauthClientIdEnvKey: "DISCORD_CLIENT_ID",
    oauthClientSecretEnvKey: "DISCORD_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/discord/callback",
    rateLimitPerMinute: 50, // Per endpoint limits
    docsUrl: "https://discord.com/developers/docs/reference",
    supportsRealtime: false, // User apps cannot use Gateway API easily
    features: ["read_guilds", "read_messages", "send_messages", "dm"],
  },
  linkedin: {
    label: "LinkedIn",
    icon: Users,
    color: "#0A66C2",
    actions: ["Read profile info", "Fetch messages", "Search people"],
    href: "/briefing/linkedinbriefing",
    desc: "Review your professional network updates and messages.",
    apiBaseUrl: "https://api.linkedin.com/v2",
    authType: "oauth2",
    defaultScopes: ["r_liteprofile", "r_emailaddress", "w_member_social"],
    syncIntervalMs: 30 * 60 * 1000,
    oauthClientIdEnvKey: "LINKEDIN_CLIENT_ID",
    oauthClientSecretEnvKey: "LINKEDIN_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/linkedin/callback",
    webhookEndpoint: "/api/webhooks/linkedin",
    rateLimitPerMinute: 100,
    docsUrl: "https://learn.microsoft.com/en-us/linkedin/",
    supportsRealtime: false, // LinkedIn API is heavily rate-limited and lacks robust webhooks
    features: ["profile_read", "post_share", "connections_read"],
  },
  telegram: {
    label: "Telegram",
    icon: Send,
    color: "#26A5E4",
    actions: ["Read chats", "Send message", "Search groups", "Get members"],
    href: "/briefing/telegrambriefing",
    desc: "Review your latest secure chats and channels.",
    apiBaseUrl: "https://api.telegram.org/bot",
    authType: "api_key",
    defaultScopes: ["all"],
    syncIntervalMs: 1 * 60 * 1000, // 1 minute (realtime preferred)
    oauthClientIdEnvKey: "TELEGRAM_BOT_TOKEN", // Telegram uses a single token
    webhookEndpoint: "/api/webhooks/telegram",
    rateLimitPerMinute: 30, // 30 msgs per second max, strict
    docsUrl: "https://core.telegram.org/bots/api",
    supportsRealtime: true, // Webhooks are natively supported
    features: ["send_messages", "receive_messages", "inline_queries", "files"],
  },
};

export const ALL_PLATFORMS = Object.keys(PLATFORM_META) as IntegrationPlatform[];
