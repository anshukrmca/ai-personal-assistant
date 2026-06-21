"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { FeedItem, IntegrationPlatform } from "@/lib/types";

interface CalendarScheduleProps {
  meetings: FeedItem[];
}

export default function CalendarSchedule({ meetings }: CalendarScheduleProps) {
  const today = new Date();

  // Generate dynamic weekly dates from Monday to Sunday
  function getWeekDates() {
    const dates = [];
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      dates.push(day);
    }
    return dates;
  }
  const weekDates = getWeekDates();

  // Filter meetings to only include events occurring in the current week (Mon-Sun)
  const startOfWeek = weekDates[0];
  const endOfWeek = new Date(weekDates[6]);
  endOfWeek.setHours(23, 59, 59, 999);

  const currentWeekMeetings = meetings.filter((item) => {
    try {
      const itemDate = new Date(item.receivedAt);
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    } catch (e) {
      return false;
    }
  });

  // Sort chronologically
  const sortedMeetings = [...currentWeekMeetings].sort((a, b) => {
    return new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime();
  });

  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5">
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
          Calendar Schedule
        </h3>
        <Link
          href="/briefing"
          className="text-[11.5px] font-extrabold text-accent hover:underline flex items-center gap-0.5 font-display"
        >
          Agenda <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Horizontal Weekday Timeline */}
      <div className="flex items-center justify-between bg-surface-raised dark:bg-surface border border-border/50 rounded-2xl p-2 gap-1 overflow-x-auto scrollbar-hide shrink-0">
        {weekDates.map((day) => {
          const isToday = day.toDateString() === today.toDateString();
          const isPrev = day < today && !isToday;
          const label = day.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 3);
          const dateNum = day.getDate().toString().padStart(2, "0");

          return (
            <div
              key={day.toISOString()}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl flex-1 min-w-[38px] transition-all ${
                isToday
                  ? "bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white shadow-md font-bold"
                  : isPrev
                  ? "text-text-tertiary opacity-70"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className="text-[9px] font-extrabold uppercase tracking-wider">{label}</span>
              <span className="text-[14px] mt-0.5 font-display font-bold">{dateNum}</span>
            </div>
          );
        })}
      </div>

      {/* Today's Meetings list */}
      <div className="flex flex-col gap-3.5 min-h-[120px]">
        {sortedMeetings.slice(0, 3).map((item) => {
          const platform = item.source as IntegrationPlatform;
          const meta = PLATFORM_META[platform];
          const Icon = meta?.icon;
          
          let fullLabel = "";
          try {
            const itemDate = new Date(item.receivedAt);
            const isToday = itemDate.toDateString() === today.toDateString();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const isTomorrow = itemDate.toDateString() === tomorrow.toDateString();

            let dateLabel = "";
            if (isToday) {
              dateLabel = "Today";
            } else if (isTomorrow) {
              dateLabel = "Tomorrow";
            } else {
              dateLabel = itemDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }

            const timeString = itemDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });
            fullLabel = `${dateLabel} • ${timeString}`;
          } catch (e) {
            fullLabel = "Upcoming";
          }

          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-border bg-surface hover:bg-surface-raised/40 transition-all flex flex-col gap-3 relative group dark:bg-surface-raised/5 dark:hover:bg-surface-raised/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-[13.5px] font-bold text-text-primary leading-tight line-clamp-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-text-tertiary flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {fullLabel}
                  </p>
                </div>
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border border-border-soft"
                  style={{ background: `${meta?.color ?? "#888"}0d` }}
                >
                  {Icon && <Icon className="w-4 h-4" style={{ color: meta?.color }} />}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/15">
                  Google Meet
                </span>

                {/* Attendee Avatars Row */}
                <div className="flex -space-x-1.5 overflow-hidden">
                  {["Anshu", "Courtney", "Teammate"].map((name, idx) => (
                    <div
                      key={idx}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-surface bg-gradient-to-tr from-accent/25 to-accent/5 flex items-center justify-center text-[9px] font-extrabold text-accent border border-accent/20 overflow-hidden"
                    >
                      {name[0]}
                    </div>
                  ))}
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-surface bg-surface-raised flex items-center justify-center text-[8.5px] font-bold text-text-tertiary">
                    +2
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {sortedMeetings.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-2xl bg-surface-raised/10">
            <Calendar className="w-7 h-7 text-text-tertiary mb-1.5" />
            <p className="text-text-secondary text-[12.5px] font-semibold">
              No meetings scheduled today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
