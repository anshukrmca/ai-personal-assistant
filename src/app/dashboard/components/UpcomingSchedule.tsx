"use client";

import Link from "next/link";
import { ChevronRight, Clock, Plus, Video } from "lucide-react";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { FeedItem, IntegrationPlatform } from "@/lib/types";

interface UpcomingScheduleProps {
  meetings: FeedItem[];
}

export default function UpcomingSchedule({ meetings }: UpcomingScheduleProps) {
  // Filter out past meetings and sort chronologically
  const now = new Date().getTime();
  const futureMeetings = meetings.filter(
    (m) => new Date(m.receivedAt).getTime() > now
  );
  
  const sortedMeetings = futureMeetings.sort((a, b) => {
    return new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime();
  });

  return (
    <div
      id="upcoming-schedule-card"
      className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 scroll-mt-24"
    >
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
          Upcoming Schedule
        </h3>
        <Link
          href="/briefing"
          className="text-[11.5px] font-extrabold text-accent hover:underline flex items-center gap-0.5 font-display"
        >
          View Calendar <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Meetings List */}
      <div className="flex flex-col gap-3 min-h-[120px]">
        {sortedMeetings.slice(0, 3).map((item) => {
          const platform = item.source as IntegrationPlatform;
          const meta = PLATFORM_META[platform];
          
          let startLabel = "10:00 AM";
          let endLabel = "11:00 AM";
          let isAllDay = false;
          try {
            if (item.receivedAt.endsWith("T00:00:00.000Z")) {
              isAllDay = true;
            }
            const date = new Date(item.receivedAt);
            startLabel = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            const endDate = new Date(date.getTime() + 60 * 60 * 1000); // Default 1 hour duration
            endLabel = endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          } catch (e) {
            // Fallback default
          }

          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-border bg-surface flex items-center justify-between gap-4 dark:bg-surface-raised/5 hover:bg-surface-raised/40 dark:hover:bg-surface-raised/10 transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-border/40"
                  style={{
                    background: `${meta?.color ?? "#888"}0d`,
                    borderColor: `${meta?.color ?? "#888"}20`,
                  }}
                >
                  <Video className="w-5 h-5 text-accent" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-[13.5px] font-bold text-text-primary leading-tight line-clamp-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-text-tertiary flex items-center gap-1 font-semibold mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {isAllDay ? "All Day" : `${startLabel} – ${endLabel}`}
                  </p>
                </div>
              </div>

              {/* JOIN button */}
              <Link
                href="/chat"
                className="px-4 py-1.5 rounded-full bg-accent hover:bg-accent/90 text-white font-extrabold text-[11px] tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 uppercase"
              >
                Join
              </Link>
            </div>
          );
        })}

        {sortedMeetings.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 border border-dashed border-border/60 rounded-2xl bg-surface-raised/10">
            <Video className="w-7 h-7 text-text-tertiary mb-1.5 animate-pulse" />
            <p className="text-text-secondary text-[12.5px] font-semibold">
              No meetings scheduled today.
            </p>
          </div>
        )}
      </div>

      {/* Add Event trigger button */}
      <Link
        href="/chat?q=Add an event to my calendar for "
        className="py-3 px-4 rounded-2xl border border-dashed border-border/80 hover:border-accent/40 bg-surface hover:bg-surface-raised/20 text-center text-[13px] font-extrabold text-text-secondary hover:text-accent transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
      >
        <Plus className="w-4 h-4 stroke-[3]" /> Add Event
      </Link>
    </div>
  );
}
