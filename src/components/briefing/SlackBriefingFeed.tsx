import React from "react";
import { Hash } from "lucide-react";
import type { FeedItem } from "@/lib/types";

function formatSlackTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

interface SlackBriefingFeedProps {
  items: FeedItem[];
  onReply: (item: FeedItem) => void;
}

export function SlackBriefingFeed({ items, onReply }: SlackBriefingFeedProps) {
  return (
    <div className="flex flex-col bg-surface">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 px-5 py-3 hover:bg-surface-raised cursor-pointer transition-colors group border-b border-border/40 last:border-0"
          onClick={() => onReply(item)}
        >
          {/* Avatar (Square) */}
          <div className="w-9 h-9 rounded bg-[#4A154B]/10 flex items-center justify-center shrink-0 overflow-hidden text-[#4A154B] font-bold text-[14px]">
            {item.from.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-baseline gap-2 mb-0.5">
              {/* Sender Name */}
              <span className="font-bold text-[15px] text-text-primary">
                {item.from}
              </span>
              {/* Time */}
              <span className="text-[12px] text-text-secondary font-medium">
                {formatSlackTime(item.receivedAt)}
              </span>
            </div>

            {/* Message Content */}
            <p className="text-[15px] text-text-primary leading-relaxed">
              {item.snippet}
            </p>

            {/* Channel / Context */}
            {item.title && (
              <div className="flex items-center gap-1 text-[12px] text-text-secondary mt-2 bg-surface-raised border border-border self-start inline-flex px-2 py-0.5 rounded-md">
                <Hash className="w-3 h-3" />
                <span className="font-semibold">{item.title.toLowerCase().replace(/\s+/g, '-')}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
