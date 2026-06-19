import type { FeedItem } from "../types";
import type { BriefingResult } from "./briefing";

export function mockSummarize(items: FeedItem[]): BriefingResult {
  const meetings = items.filter((i) => i.type === "meeting");
  const highPriority = items.filter((i) => i.priority === "high");

  const parts = [];
  if (meetings.length > 0)
    parts.push(`${meetings.length} meeting${meetings.length > 1 ? "s" : ""}`);
  if (highPriority.length > 0)
    parts.push(
      `${highPriority.length} high-priority alert${highPriority.length > 1 ? "s" : ""}`
    );

  const pendingFollowUpsCount = items.filter((i) => i.requiresFollowUp).length;
  if (pendingFollowUpsCount > 0)
    parts.push(
      `${pendingFollowUpsCount} follow-up${pendingFollowUpsCount > 1 ? "s" : ""} pending`
    );

  const topItem = highPriority[0] ?? meetings[0];
  const summary =
    parts.length > 0
      ? `You have ${parts.join(", ")}. ${topItem ? `Top priority: "${topItem.title}" from ${topItem.from}.` : ""}`.trim()
      : "Nothing urgent today — your inbox and calendar are quiet.";

  return { 
    summary,
    meetingsCount: meetings.length,
    importantAlertsCount: highPriority.length,
    pendingFollowUpsCount,
  };
}

export function mockChatAnswer(question: string, items: FeedItem[]): string {
  // Fix common typo
  question = question.replace(/whatapp/ig, "whatsapp");
  const qLower = question.toLowerCase();
  
  // 1. Extract dynamic email recipient
  const emailMatch = question.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  let toEmail = "";
  
  if (emailMatch) {
    toEmail = emailMatch[0];
  } else {
    const nameMatch = question.match(/(?:to|for|with|email|mail|draft|send|meet|schedule)\s+([a-zA-Z]+)/i);
    if (nameMatch) {
      const recipientName = nameMatch[1];
      const nameLower = recipientName.toLowerCase();
      const matchedItem = items.find(item => 
        item.from?.toLowerCase().includes(nameLower) || 
        item.title?.toLowerCase().includes(nameLower) ||
        item.snippet?.toLowerCase().includes(nameLower)
      );
      if (matchedItem) {
        const itemEmailMatch = 
          matchedItem.from.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) ||
          matchedItem.snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (itemEmailMatch) {
          toEmail = itemEmailMatch[0];
        }
      }
      if (!toEmail) {
        toEmail = `${nameLower}@example.com`;
      }
    } else {
      for (const item of items) {
        const itemEmailMatch = item.from?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (itemEmailMatch) {
          toEmail = itemEmailMatch[0];
          break;
        }
      }
      if (!toEmail) {
        toEmail = "anshu121hjp@gmail.com";
      }
    }
  }

  // 2. Extract subject dynamically
  let subject = "";
  const subjectMatch = question.match(/subject\s*[:\-]?\s*(.*?)(?=\s*(?:body|saying|content|message|$))/i);
  if (subjectMatch && subjectMatch[1].trim()) {
    subject = subjectMatch[1].trim();
  } else {
    const aboutMatch = question.match(/about\s+(.*?)(?=\s*(?:body|saying|content|message|and|\.|\,|$))/i);
    if (aboutMatch && aboutMatch[1].trim()) {
      subject = aboutMatch[1].trim();
      const words = subject.split(" ");
      if (words.length > 8) {
        subject = words.slice(0, 8).join(" ") + "...";
      }
    }
  }
  if (!subject) {
    subject = "Follow up from Personal Assistant";
  }

  // 3. Extract body dynamically
  let body = "";
  const bodyMatch = question.match(/(?:body|saying|content|message)\s*[:\-]?\s*(.*)/i);
  if (bodyMatch && bodyMatch[1].trim()) {
    body = bodyMatch[1].trim();
  } else {
    const sayingMatch = question.match(/saying\s+(.*)/i);
    if (sayingMatch && sayingMatch[1].trim()) {
      body = sayingMatch[1].trim();
    } else {
      if (subject && subject !== "Follow up from Personal Assistant") {
        body = `Hi, I wanted to follow up about: ${subject}. Let me know your thoughts.`;
      } else {
        body = "Hi, hope you are doing well. Let's connect soon.";
      }
    }
  }

  if ((qLower.includes("check") || qLower.includes("show") || qLower.includes("view") || qLower.includes("agenda")) && (qLower.includes("calendar") || qLower.includes("meet") || qLower.includes("schedule"))) {
    return `Here is your upcoming schedule:\n\n<calendar_agenda_view>\n{\n  "date": "Upcoming",\n  "events": [\n    {"summary": "Team Meet", "startTime": "${new Date(Date.now() + 3600000).toISOString()}", "durationMinutes": 60, "location": "", "attendees": ["anshukumarhfactor@gmail.com"], "description": ""},\n    {"summary": "Google Meet Sync", "startTime": "${new Date(Date.now() + 7200000).toISOString()}", "durationMinutes": 60, "location": "", "attendees": ["anshukumarhfactor@gmail.com"], "description": "Scheduled via Aria personal assistant."}\n  ]\n}\n</calendar_agenda_view>`;
  }

  if (qLower.includes("cancel") || qLower.includes("delete") || qLower.includes("remove")) {
    let target = "Meeting";
    const cancelMatch = question.match(/(?:cancel|delete|remove)\s+(?:this\s+)?(?:even\s+|event\s+|meeting\s+)?([a-zA-Z0-9\s]+?)(?=\s*(?:at|on|scheduled|$))/i);
    if (cancelMatch && cancelMatch[1].trim()) {
      target = cancelMatch[1].trim();
    }
    return `*⚠️ AI Rate Limited - Auto-Mocked:*\n\nSure, I'm canceling the event for you.\n\n<calendar_cancel_action>\n{\n  "targetEventId": "${target}"\n}\n</calendar_cancel_action>`;
  }

  if (qLower.includes("update") || qLower.includes("change") || qLower.includes("reschedule")) {
    let target = "Meeting";
    const updateMatch = question.match(/(?:update|change|reschedule)\s+(?:this\s+)?(?:even\s+|event\s+|meeting\s+)?([a-zA-Z0-9\s]+?)(?=\s*(?:to|at|from|$))/i);
    if (updateMatch && updateMatch[1].trim()) {
      target = updateMatch[1].trim();
    }
    return `*⚠️ AI Rate Limited - Auto-Mocked:*\n\nSure, I'm updating that event.\n\n<calendar_update_action>\n{\n  "targetEventId": "${target}",\n  "summary": "${target}",\n  "attendees": ["${toEmail}"]\n}\n</calendar_update_action>`;
  }

  if (qLower.includes("schedule") || qLower.includes("meet") || qLower.includes("event") || qLower.includes("calendar")) {
    let meetingSummary = "Google Meet Sync";
    const summaryMatch = question.match(/(?:schedule|meet|event|calendar)\s+(?:about|for|a)?\s*([a-zA-Z0-9\s]+?)(?=\s*(?:with|at|after|tomorrow|on|$))/i);
    if (summaryMatch && summaryMatch[1].trim()) {
      meetingSummary = summaryMatch[1].trim();
    }
    
    let duration = 30;
    const durationMatch = question.match(/(\d+)\s*(?:min|minute)/i);
    if (durationMatch) {
      duration = parseInt(durationMatch[1], 10);
    }

    let startTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    if (qLower.includes("tomorrow")) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      startTime = tomorrow.toISOString();
    } else {
      const hourMatch = question.match(/after\s+(\d+)\s*(?:hour|hr)/i);
      if (hourMatch) {
        const hrs = parseInt(hourMatch[1], 10);
        startTime = new Date(Date.now() + hrs * 60 * 60 * 1000).toISOString();
      }
    }

    return `I am scheduling a Google Calendar meeting for you with ${toEmail}.\n\n<calendar_action>\n{\n  "summary": "${meetingSummary}",\n  "description": "Scheduled via Aria personal assistant.",\n  "startTime": "${startTime}",\n  "durationMinutes": ${duration},\n  "attendees": ["${toEmail}"]\n}\n</calendar_action>`;
  }

  if (qLower.includes("whatsapp")) {
    // If asking to read
    if (qLower.includes("check") || qLower.includes("read") || qLower.includes("show") || qLower.includes("last")) {
      const waItems = items.filter(i => i.source === "whatsapp");
      if (waItems.length > 0) {
        return `Here’s the last WhatsApp message I could find:\n\n<whatsapp_read_action>\n{\n  "from": "${waItems[0].from}",\n  "snippet": "${waItems[0].snippet}"\n}\n</whatsapp_read_action>`;
      } else {
        return "You don't have any recent WhatsApp messages synced.";
      }
    }
    // If asking to send
    if (qLower.includes("send") || qLower.includes("msg") || qLower.includes("message") || qLower.includes("reply")) {
       return `I'm setting up a WhatsApp message to ${toEmail.split('@')[0]}.\n\n<whatsapp_action>\n{\n  "to": "${toEmail.split('@')[0]}",\n  "body": "${body}"\n}\n</whatsapp_action>`;
    }
  }

  if (qLower.includes("draft")) {
    return `I am creating a Gmail draft for you to ${toEmail}.\n\n<draft_action>\n{\n  "to": "${toEmail}",\n  "subject": "${subject}",\n  "body": "${body}"\n}\n</draft_action>`;
  }

  if (qLower.includes("send") || qLower.includes("mail")) {
    return `I am sending that email to ${toEmail} now.\n\n<email_action>\n{\n  "to": "${toEmail}",\n  "subject": "${subject}",\n  "body": "${body}"\n}\n</email_action>`;
  }

  const stopWords = new Set([
    "what", "do", "i", "have", "any", "is", "are", "the", "my", "on",
    "in", "from", "today", "me", "for", "show", "get", "find", "list",
  ]);

  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  const normalize = (w: string) => (w.endsWith("s") ? w.slice(0, -1) : w);

  const matches = items.filter((i) => {
    const hay =
      `${i.title} ${i.snippet} ${i.from} ${i.type} ${i.source}`.toLowerCase();
    return words.some((w) => hay.includes(normalize(w)) || hay.includes(w));
  });

  if (matches.length > 0) {
    return `Found ${matches.length} related item${matches.length > 1 ? "s" : ""}: ${matches
      .slice(0, 3)
      .map((m) => `"${m.title}" (from ${m.from})`)
      .join(", ")}.`;
  }

  return "I couldn't find anything matching that in your connected apps. Add an OpenRouter API key in .env.local to enable full natural language answers — it's free at openrouter.ai.";
}
