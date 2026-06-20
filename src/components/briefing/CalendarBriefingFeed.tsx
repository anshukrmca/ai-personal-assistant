import React from "react";
import { Video, MapPin, Users } from "lucide-react";
import type { FeedItem } from "@/lib/types";

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDateHeader(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  
  // Check if it's today
  if (date.toDateString() === now.toDateString()) {
    return "Today";
  }
  
  // Otherwise format as "Sat, Jun 20"
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

interface CalendarBriefingFeedProps {
  items: FeedItem[];
  onReply: (item: FeedItem) => void;
}

export function CalendarBriefingFeed({ items, onReply }: CalendarBriefingFeedProps) {
  // Group items by date
  const groupedItems: Record<string, FeedItem[]> = {};
  items.forEach(item => {
    const dateStr = new Date(item.receivedAt).toDateString();
    if (!groupedItems[dateStr]) groupedItems[dateStr] = [];
    groupedItems[dateStr].push(item);
  });

  return (
    <div className="bg-surface px-0 md:px-2 py-4">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-text-secondary border border-dashed border-border/60 rounded-xl bg-surface-raised/30">
          <p className="font-semibold text-text-primary text-[14px]">No events found</p>
          <p className="text-[12px] mt-1">Enjoy your free time!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([dateStr, dayItems]) => {
            const dateObj = new Date(dayItems[0].receivedAt);
            const now = new Date();
            
            // Normalize both to start of day for accurate comparison
            const dateStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
            const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            let colorHex = "#4285F4"; // Future (Blue)
            if (dateStart < nowStart) {
              colorHex = "#ea4335"; // Past (Red)
            } else if (dateStart.getTime() === nowStart.getTime()) {
              colorHex = "#34a853"; // Today (Green)
            }

            return (
            <div key={dateStr} className="border-l-2 pl-4 md:pl-6 ml-[60px] md:ml-[80px] relative" style={{ borderColor: colorHex }}>
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: colorHex }}></div>
              <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-4">
                {formatDateHeader(dayItems[0].receivedAt)}
              </p>
              
              <div className="space-y-4">
                {dayItems.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Time Column positioned to the left of the line */}
                    <div className="absolute -left-[68px] md:-left-[90px] top-1 w-[52px] md:w-16 text-right">
                      <p className="text-[10.5px] md:text-[12px] font-medium text-text-secondary">{formatTime(item.receivedAt)}</p>
                    </div>

                    {/* Event Block */}
                    <div 
                      className="bg-[#4285F4] text-white rounded-lg p-3 hover:shadow-md cursor-pointer transition-shadow overflow-hidden break-words"
                      onClick={() => onReply(item)}
                    >
                      <p className="font-bold text-[13px] md:text-[14px] leading-tight mb-1">{item.title}</p>
                      <p className="text-[11px] md:text-[12px] opacity-90 leading-relaxed mb-2 line-clamp-2">{item.snippet}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] md:text-[11px] opacity-80 font-medium">
                        <div className="flex items-center gap-1 min-w-0 max-w-full">
                          <Video className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Google Meet</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0 max-w-full">
                          <Users className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{item.from}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
