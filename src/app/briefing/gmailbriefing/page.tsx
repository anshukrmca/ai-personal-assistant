"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import type { FeedItem } from "@/lib/types";

// Extracted Components
import { GmailSidebar } from "@/components/briefing/gmail/GmailSidebar";
import { GmailMobileNav } from "@/components/briefing/gmail/GmailMobileNav";
import { GmailEmailList } from "@/components/briefing/gmail/GmailEmailList";
import { GmailEmailDetail } from "@/components/briefing/gmail/GmailEmailDetail";
import { GmailCompose } from "@/components/briefing/gmail/GmailCompose";

export default function GmailBriefingPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<FeedItem | null>(null);
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [isReplying, setIsReplying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFolder]);

  async function handleRefresh() {
    setRefreshing(true);
    setLoading(true);
    try {
      const res = await api.refreshBriefing();
      setItems(res.items.filter(i => i.type === "email"));
      setCurrentPage(1);
      setSelectedEmail(null);
    } catch (err) {
      console.error("Failed to refresh Gmail briefing:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }

  function toggleStar(itemId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const currentlyStarred = item.priority === "high";
    const nextStarred = !currentlyStarred;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, priority: (nextStarred ? "high" : "low") }
          : item
      )
    );

    fetch("/api/briefing/toggle-star", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, starred: nextStarred }),
    }).catch((err) => console.error("Failed to persist star status:", err));
  }

  function toggleStarDetail(itemId: string) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const currentlyStarred = item.priority === "high";
    const nextStarred = !currentlyStarred;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, priority: (nextStarred ? "high" : "low") }
          : item
      )
    );
    setSelectedEmail((prev) =>
      prev && prev.id === itemId
        ? { ...prev, priority: (nextStarred ? "high" : "low") }
        : prev
    );

    fetch("/api/briefing/toggle-star", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, starred: nextStarred }),
    }).catch((err) => console.error("Failed to persist star status:", err));
  }

  useEffect(() => {
    api.getBriefing().then((r) => {
      setItems(r.items.filter(i => i.type === "email"));
      setLoading(false);
    });
  }, []);

  // Filter items based on active folder
  const displayItems = items.filter(item => {
    if (activeFolder === "Inbox") return item.folder === "inbox" || !item.folder;
    if (activeFolder === "Sent") return item.folder === "sent";
    if (activeFolder === "Drafts") return item.folder === "drafts";
    if (activeFolder === "Starred") return item.priority === "high";
    return false;
  });

  const ITEMS_PER_PAGE = 10;

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-2rem)] md:h-screen bg-bg text-text-primary font-sans pt-2">
        
        <GmailSidebar 
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          setSelectedEmail={setSelectedEmail}
          setIsReplying={setIsReplying}
          items={items}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-surface rounded-3xl overflow-hidden border border-border/60 shadow-sm mx-2 md:ml-0 md:mr-2 mb-2">
          
          <GmailMobileNav 
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
            setSelectedEmail={setSelectedEmail}
            setIsReplying={setIsReplying}
          />

          {isReplying ? (
            <GmailCompose 
              toEmail={selectedEmail ? selectedEmail.from : undefined}
              onClose={() => {
                setIsReplying(false);
                setSelectedEmail(null);
              }}
            />
          ) : selectedEmail ? (
            <GmailEmailDetail 
              email={selectedEmail}
              onBack={() => { setSelectedEmail(null); setIsReplying(false); }}
              onReply={() => setIsReplying(true)}
              toggleStar={toggleStarDetail}
            />
          ) : (
            <GmailEmailList 
              loading={loading}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              items={displayItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              activeFolder={activeFolder}
              onSelectEmail={setSelectedEmail}
              toggleStar={toggleStar}
            />
          )}
        </div>

      </div>
    </AppShell>
  );
}