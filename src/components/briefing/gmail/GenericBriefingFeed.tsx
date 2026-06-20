import React from "react";
import type { FeedItem } from "@/lib/types";
import { PLATFORM_META } from "@/lib/platformMeta";
import { Clock } from "lucide-react";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

interface GenericBriefingFeedProps {
  items: FeedItem[];
  onReply: (item: FeedItem) => void;
  accentColor?: string;
  actionText?: string;
}

export function GenericBriefingFeed({ items, onReply, accentColor = "#7c3aed", actionText = "Reply" }: GenericBriefingFeedProps) {
  return (
    <>
      {items.map((item) => {
        const meta = PLATFORM_META[item.source as keyof typeof PLATFORM_META];
        const Icon = meta?.icon;
        
        return (
          <div
            key={item.id}
            className="py-4.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-surface-raised/10 transition-colors rounded-xl px-2"
          >
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 shadow-sm"
                style={{
                  background: `${meta?.color ?? accentColor}15`,
                  borderColor: `${meta?.color ?? accentColor}30`,
                  color: meta?.color ?? accentColor
                }}
              >
                {Icon && <Icon className="w-4.5 h-4.5" />}
              </div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-text-primary truncate">
                  {item.title}
                </p>
                <p className="text-[12.5px] text-text-secondary mt-1 font-medium">
                  {item.snippet}
                </p>
                <p className="text-[11.5px] text-text-tertiary mt-2 flex items-center gap-1.5">
                  From: <span className="font-semibold text-text-secondary">{item.from}</span>
                  <span>·</span>
                  <Clock className="w-3 h-3" /> {timeAgo(item.receivedAt)}
                </p>
              </div>
            </div>

            {/* Reply Button Action */}
            <div className="shrink-0 self-end sm:self-center">
              <button
                onClick={() => onReply(item)}
                className="text-[12px] font-bold rounded-xl px-4 py-2 active:scale-97 cursor-pointer transition-all border shadow-sm"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}10`,
                  borderColor: `${accentColor}25`,
                }}
              >
                {actionText}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
