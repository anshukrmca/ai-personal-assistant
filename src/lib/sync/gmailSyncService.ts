import type { FeedItem, Priority } from "../types";
import { buildEmailHtml } from "../emailTemplate";
import { PLATFORM_META } from "../platformMeta";

export async function syncGmailData(userId: string, accessToken: string): Promise<FeedItem[]> {
  const meta = PLATFORM_META.gmail;
  console.log(`Syncing real Gmail data for user: ${userId} via ${meta.apiBaseUrl}`);
  
  // Real implementation would look like:
  // const res = await fetch(`${meta.apiBaseUrl}/users/me/messages?maxResults=10&q=category:primary`, {
  //   headers: { Authorization: `Bearer ${accessToken}` }
  // });

  const syncedItems: FeedItem[] = [];
  const syncedIds = new Set<string>();

  const foldersToSync = [
    { query: "category:primary", folderName: "inbox" },
    { query: "in:sent", folderName: "sent" },
    { query: "in:draft", folderName: "drafts" },
    { query: "is:starred", folderName: "inbox" },
  ];

  for (const { query, folderName } of foldersToSync) {
    try {
      const listRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (listRes.ok) {
        const listData = await listRes.json();
        const messages = listData.messages || [];

        for (const msg of messages) {
          if (syncedIds.has(msg.id)) {
            continue;
          }
          syncedIds.add(msg.id);

          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          if (detailRes.ok) {
            const detail = await detailRes.json();
            const headers = detail.payload?.headers || [];
            const fromHeader = headers.find((h: { name: string; value: string }) => h.name === "From")?.value || "Unknown Sender";
            const subjectHeader = headers.find((h: { name: string; value: string }) => h.name === "Subject")?.value || "No Subject";
            const internalDate = detail.internalDate;

            const labelIds: string[] = detail.labelIds || [];
            const isStarred = labelIds.includes("STARRED");

            // Simple heuristic to evaluate priority & follow up
            const lowerSubject = subjectHeader.toLowerCase();
            const lowerBody = (detail.snippet || "").toLowerCase();
            
            let priority: Priority = "low";
            let requiresFollowUp = false;

            if (
              isStarred ||
              lowerSubject.includes("urgent") ||
              lowerSubject.includes("action needed") ||
              lowerSubject.includes("important") ||
              lowerSubject.includes("attention") ||
              lowerBody.includes("asap") ||
              lowerBody.includes("deadline")
            ) {
              priority = "high";
              requiresFollowUp = true;
            } else if (
              lowerSubject.includes("sync") ||
              lowerSubject.includes("billing") ||
              lowerSubject.includes("invoice") ||
              lowerSubject.includes("roadmap")
            ) {
              priority = "medium";
              requiresFollowUp = true;
            }

            // Dynamically evaluate folder from labels
            let folder = folderName;
            if (labelIds.includes("DRAFT")) {
              folder = "drafts";
            } else if (labelIds.includes("SENT")) {
              folder = "sent";
            } else if (labelIds.includes("INBOX")) {
              folder = "inbox";
            }

            syncedItems.push({
              id: `gmail-${msg.id}`,
              userId,
              source: "gmail",
              type: "email",
              title: subjectHeader,
              snippet: detail.snippet || "",
              from: fromHeader,
              priority,
              folder,
              receivedAt: new Date(parseInt(internalDate)).toISOString(),
              isRead: false,
              requiresFollowUp,
            });
          }
        }
      } else {
        console.error(`Gmail list call failed for query ${query}:`, listRes.statusText);
      }
    } catch (err) {
      console.error(`Gmail sync error for query ${query}:`, err);
    }
  }

  return syncedItems;
}

export async function sendGmailEmail(
  userId: string,
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  try {
    const htmlBody = buildEmailHtml(to, subject, body);
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const messageParts = [
      `To: ${to}`,
      `From: me`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${utf8Subject}`,
      "",
      htmlBody,
    ];
    const message = messageParts.join("\r\n");
    
    // Base64URL encode the message
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log(`Sending email to ${to} using Gmail API...`);
    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gmail send email failed:", errText);
      return false;
    }

    console.log("Email sent successfully!");
    return true;
  } catch (err) {
    console.error("Error in sendGmailEmail:", err);
    return false;
  }
}

export async function createGmailDraft(
  userId: string,
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  try {
    const htmlBody = buildEmailHtml(to, subject, body);
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const messageParts = [
      `To: ${to}`,
      `From: me`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${utf8Subject}`,
      "",
      htmlBody,
    ];
    const message = messageParts.join("\r\n");
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log(`Creating Gmail draft for ${to} using Gmail API...`);
    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          raw: encodedMessage,
        },
      }),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error("Gmail draft creation API failed:", errMsg);
      return false;
    }

    console.log("Gmail draft created successfully!");
    return true;
  } catch (err) {
    console.error("Error creating Gmail draft:", err);
    return false;
  }
}

export async function toggleGmailStar(
  userId: string,
  accessToken: string,
  messageId: string,
  starred: boolean
): Promise<boolean> {
  try {
    const rawId = messageId.replace(/^gmail-/, "");
    console.log(`Toggling Gmail star for message ${rawId} to ${starred}...`);
    const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${rawId}/modify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addLabelIds: starred ? ["STARRED"] : [],
        removeLabelIds: starred ? [] : ["STARRED"],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Gmail modify labels failed for message ${rawId}:`, errText);
      return false;
    }

    console.log(`Gmail message ${rawId} starred status updated to ${starred} successfully.`);
    return true;
  } catch (err) {
    console.error("Error in toggleGmailStar:", err);
    return false;
  }
}

