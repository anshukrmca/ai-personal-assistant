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
    // Fetch meetings from the start of the current month to capture recent past events
    const timeMinDate = new Date();
    timeMinDate.setMonth(timeMinDate.getMonth() - 1); // 1 month ago
    const timeMin = timeMinDate.toISOString();
    const calendarRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=10&orderBy=startTime&singleEvents=true&showDeleted=true`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (calendarRes.ok) {
      const calendarData = await calendarRes.json();
      const events = calendarData.items || [];

      for (const event of events) {
        const isCancelled = event.status === "cancelled";
        const startTime = event.start?.dateTime || event.start?.date || event.originalStartTime?.dateTime || event.updated;
        if (!startTime) continue; // Skip if we have absolutely no time reference
        
        const formattedTime = startTime && event.start?.dateTime
          ? new Date(startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          : "All Day";
        
        syncedItems.push({
          id: `gcal-${event.id}`,
          userId,
          source: "google_calendar",
          type: "meeting",
          title: `${isCancelled ? "[Cancelled] " : ""}${event.summary || "Calendar Event"}`,
          snippet: `${formattedTime}${event.description ? ` · ${event.description}` : ""}`,
          from: event.organizer?.displayName || event.organizer?.email || "Calendar",
          priority: isCancelled ? "low" : "high",
          receivedAt: new Date(startTime).toISOString(),
          isRead: false,
          requiresFollowUp: false,
        });
      }
    } else {
      console.error("Primary Calendar call failed:", calendarRes.statusText);
    }

    // Now, fetch the user's calendar list to find Holiday calendars
    const listRes = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (listRes.ok) {
      const listData = await listRes.json();
      const calendars = listData.items || [];
      const holidayCalendars = calendars.filter((c: any) => c.id.includes("#holiday@group.v.calendar.google.com"));

      const currentYear = new Date().getFullYear();
      const yearStart = new Date(currentYear, 0, 1).toISOString();
      const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59).toISOString();

      for (const holCal of holidayCalendars) {
        console.log(`Syncing holiday calendar: ${holCal.summary}`);
        const holRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(holCal.id)}/events?timeMin=${yearStart}&timeMax=${yearEnd}&singleEvents=true`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (holRes.ok) {
          const holData = await holRes.json();
          const holEvents = holData.items || [];
          for (const event of holEvents) {
            const startTime = event.start.dateTime || event.start.date;
            syncedItems.push({
              id: `gcal-hol-${event.id}`,
              userId,
              source: "google_calendar",
              type: "meeting", // Render as a calendar event
              title: event.summary || "Holiday",
              snippet: `Holiday · ${holCal.summary}`,
              from: holCal.summary,
              priority: "medium",
              receivedAt: new Date(startTime).toISOString(),
              isRead: true,
              requiresFollowUp: false,
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Google Calendar sync error:", err);
  }

  return syncedItems;
}
