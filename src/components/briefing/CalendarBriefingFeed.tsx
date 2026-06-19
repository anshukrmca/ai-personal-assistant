import React from "react";
import { Video, MapPin, Users } from "lucide-react";
import type { FeedItem } from "@/lib/types";

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

interface CalendarBriefingFeedProps {
  items: FeedItem[];
  onReply: (item: FeedItem) => void;
}

export function CalendarBriefingFeed({ items, onReply }: CalendarBriefingFeedProps) {
  return (
    <div className="flex flex-col bg-surface px-2 py-4">
      <div className="border-l-2 border-[#ea4335] pl-4 mb-6 ml-16 relative">
        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#ea4335]"></div>
        <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-2">Today</p>
        
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              {/* Time Column */}
              <div className="w-16 shrink-0 text-right">
                <p className="text-[12px] font-medium text-text-secondary mt-1">{formatTime(item.receivedAt)}</p>
              </div>

              {/* Event Block */}
              <div 
                className="flex-1 bg-[#4285F4] text-white rounded-lg p-3 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => onReply(item)}
              >
                <p className="font-bold text-[14px] leading-tight mb-1">{item.title}</p>
                <p className="text-[12px] opacity-90 leading-relaxed mb-2 line-clamp-2">{item.snippet}</p>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] opacity-80 font-medium">
                  <div className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Google Meet
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {item.from}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
