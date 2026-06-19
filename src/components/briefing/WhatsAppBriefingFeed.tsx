import React from "react";
import { User, CheckCheck } from "lucide-react";
import type { FeedItem } from "@/lib/types";

function formatWhatsAppTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

interface WhatsAppBriefingFeedProps {
  items: FeedItem[];
  onReply: (item: FeedItem) => void;
}

export function WhatsAppBriefingFeed({ items, onReply }: WhatsAppBriefingFeedProps) {
  return (
    <div className="flex flex-col bg-surface">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onReply(item)}
          className="flex items-center gap-4 px-4 py-3 hover:bg-surface-raised cursor-pointer transition-colors group"
        >
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-surface-raised border border-border/30 flex items-center justify-center shrink-0 overflow-hidden">
            <User className="w-8 h-8 text-[#fff] mt-2" />
          </div>

          <div className="flex-1 min-w-0 border-b border-border/40 pb-3 group-last:border-none pt-1">
            <div className="flex justify-between items-baseline mb-0.5">
              {/* Contact Name */}
              <span className="font-semibold text-[16px] text-text-primary truncate pr-2">
                {item.from}
              </span>
              {/* Time */}
              <span className="text-[12px] text-[#25D366] shrink-0 font-medium">
                {formatWhatsAppTime(item.receivedAt)}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              {/* Message Snippet */}
              <div className="flex items-center gap-1 min-w-0 flex-1">
                {item.source !== 'whatsapp' && <CheckCheck className="w-4 h-4 text-[#53bdeb] shrink-0" />}
                <p className="text-[14px] text-text-secondary truncate">
                  {item.snippet}
                </p>
              </div>

              {/* Unread Badge */}
              <div className="shrink-0 flex items-center justify-center bg-[#25D366] text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1.5">
                1
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
