import type { FeedItem } from "../types";
import { PLATFORM_META } from "../platformMeta";

export async function syncGoogleCalendarData(userId: string, accessToken: string): Promise<FeedItem[]> {
  const meta = PLATFORM_META.google_calendar;
  console.log(`Syncing real Google Calendar data for user: ${userId} via ${meta.apiBaseUrl}`);
  
  // Real implementation would look like:
  // const res = await fetch(`${meta.apiBaseUrl}/calendars/primary/events?timeMin=...`, {
  //   headers: { Authorization: `Bearer ${accessToken}` }
  // });

  const syncedItems: FeedItem[] = [];

  try {
    // Fetch meetings from today onwards
    const timeMin = new Date().toISOString();
    const calendarRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=5&orderBy=startTime&singleEvents=true`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (calendarRes.ok) {
      const calendarData = await calendarRes.json();
      const events = calendarData.items || [];

      for (const event of events) {
        const startTime = event.start.dateTime || event.start.date;
        const formattedTime = startTime
          ? new Date(startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          : "";
        
        syncedItems.push({
          id: `gcal-${event.id}`,
          userId,
          source: "google_calendar",
          type: "meeting",
          title: event.summary || "Product Sync — Roadmap Review",
          snippet: `${formattedTime} · ${event.description || "No description provided."}`,
          from: event.organizer?.displayName || event.organizer?.email || "Calendar",
          priority: "high",
          receivedAt: new Date(startTime).toISOString(),
          isRead: false,
          requiresFollowUp: false,
        });
      }
    } else {
      console.error("Calendar call failed:", calendarRes.statusText);
    }
  } catch (err) {
    console.error("Google Calendar sync error:", err);
  }

  return syncedItems;
}
