import React from "react";
import { Star, Square } from "lucide-react";
import type { FeedItem } from "@/lib/types";

function formatGmailTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface GmailBriefingFeedProps {
  items: FeedItem[];
  onReply: (item: FeedItem) => void;
}

export function GmailBriefingFeed({ items, onReply }: GmailBriefingFeedProps) {
  return (
    <div className="flex flex-col bg-surface rounded-xl overflow-hidden border border-border/50">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onReply(item)}
          className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 hover:bg-surface-raised hover:z-10 cursor-pointer bg-surface transition-colors group"
        >
          {/* Checkbox & Star */}
          <div className="flex items-center gap-3 shrink-0 text-text-tertiary group-hover:text-text-secondary">
            <Square className="w-4 h-4 opacity-50" />
            <Star className="w-4 h-4 opacity-50" />
          </div>

          {/* Sender */}
          <div className="w-32 md:w-48 shrink-0 truncate font-bold text-[14px] text-text-primary">
            {item.from}
          </div>

          {/* Subject & Snippet */}
          <div className="flex-1 truncate text-[14px]">
            <span className="font-bold text-text-primary mr-1">{item.title}</span>
            <span className="text-text-tertiary">-</span>
            <span className="text-text-secondary ml-1">{item.snippet}</span>
          </div>

          {/* Time */}
          <div className="shrink-0 text-[12px] font-bold text-text-primary w-16 text-right group-hover:opacity-0 transition-opacity">
            {formatGmailTime(item.receivedAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
