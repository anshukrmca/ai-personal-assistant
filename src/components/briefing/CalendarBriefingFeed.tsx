import React, { useState, useEffect, useRef } from "react";
import { Video, MapPin, Users, Calendar, Flag, ChevronDown, Umbrella } from "lucide-react";
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

import { MonthDivider } from "./calendar/MonthDivider";
import { EventCard } from "./calendar/EventCard";
import { EmptyState } from "./calendar/EmptyState";
import { CalendarTabs } from "./calendar/CalendarTabs";

export function CalendarBriefingFeed({ items, onReply }: CalendarBriefingFeedProps) {
  const [activeTab, setActiveTab] = useState<"all" | "events" | "holidays">("events");

  const filteredItems = items.filter(item => {
    const isHoliday = item.id.includes('-hol-');
    if (activeTab === "events") return !isHoliday;
    if (activeTab === "holidays") return isHoliday;
    return true;
  });

  const groupedItems: Record<string, FeedItem[]> = {};
  filteredItems.forEach(item => {
    const dateStr = new Date(item.receivedAt).toDateString();
    if (!groupedItems[dateStr]) groupedItems[dateStr] = [];
    groupedItems[dateStr].push(item);
  });

  const sortedDates = Object.keys(groupedItems).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const currentMonthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentMonthRef.current) {
      setTimeout(() => {
        currentMonthRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeTab]);

  let currentRenderedMonth = "";

  return (
    <div className="bg-surface px-0 md:px-2 py-4">
      <CalendarTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {filteredItems.length === 0 ? (
        <EmptyState activeTab={activeTab} />
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateStr) => {
            const dayItems = groupedItems[dateStr];
            const dateObj = new Date(dayItems[0].receivedAt);
            const now = new Date();
            
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            const isNewMonth = monthStr !== currentRenderedMonth;
            if (isNewMonth) currentRenderedMonth = monthStr;
            
            const isCurrentMonth = dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear();
            
            const dateStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
            const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            let colorHex = "#4285F4"; // Future
            if (dateStart < nowStart) {
              colorHex = "#ea4335"; // Past
            } else if (dateStart.getTime() === nowStart.getTime()) {
              colorHex = "#34a853"; // Today
            }

            return (
              <React.Fragment key={dateStr}>
                {isNewMonth && (
                  <MonthDivider monthStr={monthStr} isCurrentMonth={isCurrentMonth} currentMonthRef={currentMonthRef} />
                )}
                
                <div className="border-l-2 pl-4 md:pl-6 ml-[60px] md:ml-[80px] relative mt-4" style={{ borderColor: colorHex }}>
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: colorHex }}></div>
                  <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-4">
                    {formatDateHeader(dayItems[0].receivedAt)}
                  </p>
                  
                  <div className="space-y-4">
                    {dayItems.map((item) => (
                      <div key={item.id} className="relative group">
                        {!item.id.includes('-hol-') ? (
                          <div className="absolute -left-[58px] md:-left-[100px] top-1 w-[52px] md:w-16 text-right">
                            <p className="text-[10.5px] md:text-[12px] font-medium text-text-secondary">{formatTime(item.receivedAt)}</p>
                          </div>
                        ) : (
                          <div className="absolute -left-[55px] md:-left-[80px] top-0 w-8 flex justify-end">
                            <div className="bg-[#34a853]/15 text-[#34a853] p-1.5 rounded-full">
                              <Umbrella size={14} strokeWidth={2.5} />
                            </div>
                          </div>
                        )}
                        <EventCard item={item} onReply={onReply} />
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
