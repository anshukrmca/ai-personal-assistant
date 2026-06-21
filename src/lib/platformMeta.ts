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
  GitBranch,
  FileText,
  HardDrive,
  Kanban,
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
    syncIntervalMs: 1 * 60 * 1000,
    oauthClientIdEnvKey: "TELEGRAM_BOT_TOKEN",
    webhookEndpoint: "/api/webhooks/telegram",
    rateLimitPerMinute: 30,
    docsUrl: "https://core.telegram.org/bots/api",
    supportsRealtime: true,
    features: ["send_messages", "receive_messages", "inline_queries", "files"],
  },
  github: {
    label: "GitHub",
    icon: GitBranch,
    color: "#181717",
    actions: ["Review PRs", "Check issues", "Manage notifications"],
    href: "/briefing/githubbriefing",
    desc: "Stay on top of your code reviews, pull requests, and repository activity.",
    apiBaseUrl: "https://api.github.com",
    authType: "oauth2",
    defaultScopes: ["repo", "notifications", "read:user"],
    syncIntervalMs: 10 * 60 * 1000,
    oauthClientIdEnvKey: "GITHUB_CLIENT_ID",
    oauthClientSecretEnvKey: "GITHUB_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/github/callback",
    webhookEndpoint: "/api/webhooks/github",
    rateLimitPerMinute: 5000, // standard authenticated rate limit is 5000/hour, approx 83/min
    docsUrl: "https://docs.github.com/en/rest",
    supportsRealtime: true,
    features: ["notifications", "pull_requests", "issues", "repositories"],
  },
  notion: {
    label: "Notion",
    icon: FileText,
    color: "#fff",
    actions: ["Read pages", "Search workspace", "Create tasks"],
    href: "/briefing/notionbriefing",
    desc: "Sync your wikis, docs, and project trackers.",
    apiBaseUrl: "https://api.notion.com/v1",
    authType: "oauth2",
    defaultScopes: [],
    syncIntervalMs: 15 * 60 * 1000,
    oauthClientIdEnvKey: "NOTION_CLIENT_ID",
    oauthClientSecretEnvKey: "NOTION_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/notion/callback",
    rateLimitPerMinute: 180, // Notion standard limit is 3 requests per second
    docsUrl: "https://developers.notion.com/reference",
    supportsRealtime: false,
    features: ["pages", "databases", "blocks", "search"],
  },
  drive: {
    label: "Google Drive",
    icon: HardDrive,
    color: "#34A853",
    actions: ["Search files", "View documents", "Share files"],
    href: "/briefing/drivebriefing",
    desc: "Easily search and manage your cloud documents.",
    apiBaseUrl: "https://www.googleapis.com/drive/v3",
    authType: "oauth2",
    defaultScopes: ["https://www.googleapis.com/auth/drive.readonly"],
    syncIntervalMs: 15 * 60 * 1000,
    oauthClientIdEnvKey: "GOOGLE_CLIENT_ID",
    oauthClientSecretEnvKey: "GOOGLE_CLIENT_SECRET",
    oauthRedirectUri: "/api/integrations/google/callback",
    webhookEndpoint: "/api/webhooks/drive",
    rateLimitPerMinute: 1000,
    docsUrl: "https://developers.google.com/drive/api/v3/reference",
    supportsRealtime: true,
    features: ["files", "folders", "permissions", "changes"],
  },
  trello: {
    label: "Trello",
    icon: Kanban,
    color: "#0052CC",
    actions: ["View boards", "Update cards", "Add comments"],
    href: "/briefing/trellobriefing",
    desc: "Manage your agile boards, lists, and cards.",
    apiBaseUrl: "https://api.trello.com/1",
    authType: "oauth2",
    defaultScopes: ["read", "write"],
    syncIntervalMs: 10 * 60 * 1000,
    oauthClientIdEnvKey: "TRELLO_API_KEY",
    oauthClientSecretEnvKey: "TRELLO_API_SECRET",
    webhookEndpoint: "/api/webhooks/trello",
    rateLimitPerMinute: 300,
    docsUrl: "https://developer.atlassian.com/cloud/trello/rest",
    supportsRealtime: true,
    features: ["boards", "lists", "cards", "webhooks"],
  },
};

export const ALL_PLATFORMS = Object.keys(PLATFORM_META) as IntegrationPlatform[];
