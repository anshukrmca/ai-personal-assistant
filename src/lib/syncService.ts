import { getGoogleToken, saveGoogleToken } from "./db/tokens";
import { readCollection, writeCollection } from "./db/jsonStore";
import type { FeedItem } from "./types";
import { getIntegrationsForUser } from "./db/integrations";
import { syncGmailData, sendGmailEmail as sendGmailEmailService, createGmailDraft as createGmailDraftService, toggleGmailStar as toggleGmailStarredService } from "./sync/gmailSyncService";
import { syncGoogleCalendarData } from "./sync/googleCalendarSyncService";
import { syncSlackData } from "./sync/slackSyncService";
import { syncWhatsAppData } from "./sync/whatsappSyncService";

// Refreshes the Google OAuth token if it's expired or about to expire
async function getOrRefreshAccessToken(userId: string): Promise<string | null> {
  const token = getGoogleToken(userId);
  if (!token) return null;

  const expiresTime = new Date(token.expiresAt).getTime();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer

  if (Date.now() + bufferMs >= expiresTime) {
    if (!token.refreshToken) {
      console.warn("Google token expired, but no refresh token is present.");
      return token.accessToken;
    }

    console.log("Refreshing Google OAuth token for user:", userId);
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: token.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Token refresh failed:", errText);
        return null;
      }

      const data = await response.json();
      const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
      
      saveGoogleToken(userId, {
        accessToken: data.access_token,
        expiresAt,
      });
      return data.access_token;
    } catch (err) {
      console.error("Error refreshing Google token:", err);
      return null;
    }
  }

  return token.accessToken;
}

export async function syncGoogleData(userId: string): Promise<void> {
  const accessToken = await getOrRefreshAccessToken(userId);
  if (!accessToken) return;

  const integrations = getIntegrationsForUser(userId);
  const gmailConnected = integrations.some((i) => i.platform === "gmail" && i.status === "connected");
  const calendarConnected = integrations.some(
    (i) => i.platform === "google_calendar" && i.status === "connected"
  );

  const syncedItems: FeedItem[] = [];

  // 1. Sync Gmail
  if (gmailConnected) {
    const gmailItems = await syncGmailData(userId, accessToken);
    syncedItems.push(...gmailItems);
  }

  // 2. Sync Google Calendar
  if (calendarConnected) {
    const calendarItems = await syncGoogleCalendarData(userId, accessToken);
    syncedItems.push(...calendarItems);
  }

  // Future integrations:
  // if (slackConnected) {
  //   const slackItems = await syncSlackData(userId);
  //   syncedItems.push(...slackItems);
  // }
  // if (whatsappConnected) {
  //   const whatsappItems = await syncWhatsAppData(userId);
  //   syncedItems.push(...whatsappItems);
  // }

  // 3. Write items to the datastore database
  if (syncedItems.length > 0) {
    const all = readCollection<FeedItem>("feedItems");
    
    // Filter out previous Gmail or Google Calendar items for this user to avoid duplication
    const cleanItems = all.filter(
      (item) =>
        item.userId !== userId || (item.source !== "gmail" && item.source !== "google_calendar")
    );

    writeCollection("feedItems", [...cleanItems, ...syncedItems]);
    console.log(`Successfully synced ${syncedItems.length} real Google items for user ${userId}`);
  }
}

// ---------------------------------------------------------------------------

export async function sendGmailEmail(
  userId: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const accessToken = await getOrRefreshAccessToken(userId);
  if (!accessToken) {
    console.error("sendGmailEmail failed: No access token or token refresh failed.");
    return false;
  }
  return sendGmailEmailService(userId, accessToken, to, subject, body);
}

export async function createGmailDraft(
  userId: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const accessToken = await getOrRefreshAccessToken(userId);
  if (!accessToken) {
    console.error("createGmailDraft failed: No access token or token refresh failed.");
    return false;
  }
  return createGmailDraftService(userId, accessToken, to, subject, body);
}

export async function createCalendarEvent(
  userId: string,
  summary: string,
  description: string,
  startTime: string,
  durationMinutes: number = 30,
  attendees: string[] = []
): Promise<boolean> {
  const accessToken = await getOrRefreshAccessToken(userId);
  if (!accessToken) {
    console.error("createCalendarEvent failed: No access token or token refresh failed.");
    return false;
  }

  try {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    console.log(`Creating calendar event "${summary}" at ${start.toISOString()}...`);
    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary,
        description,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        attendees: attendees.map((email) => ({ email })),
      }),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error("Google Calendar event creation API failed:", errMsg);
      return false;
    }

    console.log("Calendar event created successfully!");
    await syncGoogleData(userId).catch(console.error);
    return true;
  } catch (err) {
    console.error("Error creating calendar event:", err);
    return false;
  }
}

export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  updates: {
    summary?: string;
    description?: string;
    startTime?: string;
    durationMinutes?: number;
    attendees?: string[];
  }
): Promise<boolean> {
  const accessToken = await getOrRefreshAccessToken(userId);
  if (!accessToken) {
    console.error("updateCalendarEvent failed: No access token or token refresh failed.");
    return false;
  }

  try {
    let googleEventId = eventId;
    if (eventId.startsWith('gcal-')) {
      googleEventId = eventId.slice(5);
    } else {
      // Smart lookup: if the AI passed a title, find the real ID from the local feed cache
      const allItems = readCollection<FeedItem>("feedItems");
      const match = allItems.find(i => i.source === "google_calendar" && i.userId === userId && i.title.toLowerCase() === eventId.toLowerCase());
      if (match && match.id.startsWith('gcal-')) {
        googleEventId = match.id.slice(5);
      } else {
        // Fallback: search live Google Calendar
        const listRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?q=${encodeURIComponent(eventId)}&maxResults=1`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.items && listData.items.length > 0) {
            googleEventId = listData.items[0].id;
          }
        }
      }
    }
    console.log(`Updating calendar event "${googleEventId}"...`);
    
    const requestBody: any = {};
    if (updates.summary !== undefined) requestBody.summary = updates.summary;
    if (updates.description !== undefined) requestBody.description = updates.description;
    if (updates.attendees !== undefined) {
      requestBody.attendees = updates.attendees.map((email) => ({ email }));
    }
    
    if (updates.startTime) {
      const start = new Date(updates.startTime);
      requestBody.start = { dateTime: start.toISOString() };
      
      // If start time is updated, we usually need to update end time too. We assume 30m if duration is missing.
      const duration = updates.durationMinutes || 30;
      const end = new Date(start.getTime() + duration * 60 * 1000);
      requestBody.end = { dateTime: end.toISOString() };
    }

    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error("Google Calendar event update API failed:", errMsg);
      return false;
    }

    console.log("Calendar event updated successfully!");
    await syncGoogleData(userId).catch(console.error);
    return true;
  } catch (err) {
    console.error("Error updating calendar event:", err);
    return false;
  }
}

export async function cancelCalendarEvent(
  userId: string,
  eventId: string
): Promise<boolean> {
  const accessToken = await getOrRefreshAccessToken(userId);
  if (!accessToken) {
    console.error("cancelCalendarEvent failed: No access token or token refresh failed.");
    return false;
  }

  try {
    let googleEventId = eventId;
    if (eventId.startsWith('gcal-')) {
      googleEventId = eventId.slice(5);
    } else {
      // Smart lookup: if the AI passed a title, find the real ID from the local feed cache
      const allItems = readCollection<FeedItem>("feedItems");
      const match = allItems.find(i => i.source === "google_calendar" && i.userId === userId && i.title.toLowerCase() === eventId.toLowerCase());
      if (match && match.id.startsWith('gcal-')) {
        googleEventId = match.id.slice(5);
      } else {
        // Fallback: search live Google Calendar
        const listRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?q=${encodeURIComponent(eventId)}&maxResults=1`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.items && listData.items.length > 0) {
            googleEventId = listData.items[0].id;
          }
        }
      }
    }
    console.log(`Canceling calendar event "${googleEventId}"...`);
    
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error("Google Calendar event delete API failed:", errMsg);
      return false;
    }

    console.log("Calendar event deleted successfully!");
    await syncGoogleData(userId).catch(console.error);
    return true;
  } catch (err) {
    console.error("Error deleting calendar event:", err);
    return false;
  }
}

export async function toggleGmailStar(
  userId: string,
  messageId: string,
  starred: boolean
): Promise<boolean> {
  const accessToken = await getOrRefreshAccessToken(userId);
  if (!accessToken) {
    console.error("toggleGmailStar failed: No access token or token refresh failed.");
    return false;
  }
  return toggleGmailStarredService(userId, accessToken, messageId, starred);
}

