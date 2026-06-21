"use client";

import Link from "next/link";
import { ChevronRight, Mail, CheckCircle, Video, Sparkles, MessageSquare } from "lucide-react";
import type { FeedItem } from "@/lib/types";

interface RecentActivityProps {
  items: FeedItem[];
  completedItems: Record<string, boolean>;
}

export default function RecentActivity({ items, completedItems }: RecentActivityProps) {
  // 1. Get relative time string helper
  function getRelativeTimeString(dateStr: string) {
    try {
      if (dateStr.endsWith("T00:00:00.000Z")) {
        return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      }
      const diffMs = new Date().getTime() - new Date(dateStr).getTime();
      if (diffMs < 0) {
        // Future time (e.g. meetings today or later)
        const diffMin = Math.round(Math.abs(diffMs) / 60000);
        if (diffMin < 60) return `in ${diffMin}m`;
        const diffHours = Math.round(diffMin / 60);
        if (diffHours < 24) return `in ${diffHours}h`;
        return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      }
      const diffMin = Math.round(diffMs / 60000);
      if (diffMin < 1) return "just now";
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.round(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) {
      return "recently";
    }
  }

  // 2. Build logs from completed tasks and active feed items
  const logsList: Array<{
    action: string;
    time: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
    timestamp: number;
  }> = [];

  // Completed items logs
  items.forEach((item) => {
    if (completedItems[item.id]) {
      logsList.push({
        action: `Completed: ${item.title}`,
        time: "just now",
        icon: CheckCircle,
        color: "text-success",
        bgColor: "bg-success-soft",
        borderColor: "border-success/20",
        timestamp: Date.now(), // completed items come first / now
      });
    }
  });

  // Latest feed items logs
  items.forEach((item) => {
    if (completedItems[item.id]) return; // already added above as completed

    let action = "";
    let icon = Sparkles;
    let color = "text-accent";
    let bgColor = "bg-accent-soft";
    let borderColor = "border-accent/20";

    if (item.type === "email") {
      action = `Email from ${item.from || "sender"}: ${item.title}`;
      icon = Mail;
      color = "text-blue-500";
      bgColor = "bg-blue-500/10";
      borderColor = "border-blue-500/20";
    } else if (item.type === "meeting") {
      action = `Scheduled: ${item.title}`;
      icon = Video;
      color = "text-amber-500";
      bgColor = "bg-amber-500/10";
      borderColor = "border-amber-500/20";
    } else if (item.type === "message") {
      action = `Chat message: ${item.title || item.snippet}`;
      icon = MessageSquare;
      color = "text-emerald-500";
      bgColor = "bg-emerald-500/10";
      borderColor = "border-emerald-500/20";
    } else {
      action = `New Task: ${item.title}`;
      icon = Sparkles;
      color = "text-accent";
      bgColor = "bg-accent-soft";
      borderColor = "border-accent/20";
    }

    logsList.push({
      action,
      time: getRelativeTimeString(item.receivedAt),
      icon,
      color,
      bgColor,
      borderColor,
      timestamp: new Date(item.receivedAt).getTime(),
    });
  });

  // Sort logs by timestamp descending, but filter out FUTURE events
  const now = Date.now();
  const pastLogs = logsList.filter(log => log.timestamp <= now);
  const sortedLogs = pastLogs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);

  // If no logs, add a default connected message
  if (sortedLogs.length === 0) {
    sortedLogs.push({
      action: "Connected workspace apps successfully",
      time: "just now",
      icon: Sparkles,
      color: "text-accent",
      bgColor: "bg-accent-soft",
      borderColor: "border-accent/20",
      timestamp: Date.now(),
    });
  }

  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5 flex-1 w-full text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
          Recent Activity
        </h3>
        <Link
          href="/briefing"
          className="text-[11.5px] font-extrabold text-accent hover:underline flex items-center gap-0.5 font-display"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Timeline List */}
      <div className="relative flex flex-col gap-4 pl-4 border-l border-border/60 dark:border-white/5 mt-1">
        {sortedLogs.map((log, idx) => {
          const Icon = log.icon;

          return (
            <div key={idx} className="relative flex flex-col gap-1 text-left">
              {/* Timeline Bullet node dot */}
              <div
                className={`absolute -left-[28px] top-1.5 w-3.5 h-3.5 rounded-full bg-surface dark:bg-[#100d22] border-2 border-border/80 dark:border-white/10 flex items-center justify-center transition-colors group-hover:border-accent`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              </div>

              {/* Log Card */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-border bg-surface hover:bg-surface-raised/40 transition-all dark:bg-surface-raised/5 dark:hover:bg-surface-raised/10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${log.bgColor} border ${log.borderColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${log.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-text-primary truncate leading-normal">
                      {log.action}
                    </p>
                    <p className="text-[10.5px] text-text-tertiary font-bold tracking-wide mt-0.5">
                      {log.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
