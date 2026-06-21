"use client";

import { Bell, Check, CheckCircle2 } from "lucide-react";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { FeedItem, IntegrationPlatform } from "@/lib/types";

interface RemindersCardProps {
  followUps: FeedItem[];
  toggleTask: (id: string) => void;
}

function timeAgo(iso: string): string {
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
  } catch (e) {
    return "recent";
  }
}

export default function RemindersCard({ followUps, toggleTask }: RemindersCardProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
          Reminders & Alerts
        </h3>
      </div>

      <div className="flex flex-col gap-3 min-h-[100px]">
        {followUps.slice(0, 3).map((item) => {
          const platform = item.source as IntegrationPlatform;
          const meta = PLATFORM_META[platform];
          const Icon = meta?.icon;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-border bg-surface hover:bg-surface-raised/40 transition-all flex items-center justify-between gap-3 dark:bg-surface-raised/5 dark:hover:bg-surface-raised/10"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/15">
                  {Icon ? (
                    <Icon className="w-4.5 h-4.5" style={{ color: meta.color }} />
                  ) : (
                    <Bell className="w-4.5 h-4.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-text-primary truncate leading-normal">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-text-tertiary truncate font-semibold mt-0.5">
                    Action required • {timeAgo(item.receivedAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleTask(item.id)}
                className="w-7 h-7 rounded-xl hover:bg-accent/10 border border-border flex items-center justify-center text-text-tertiary hover:text-accent transition-all shrink-0 cursor-pointer"
                title="Mark complete"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {followUps.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-2xl bg-surface-raised/10">
            <CheckCircle2 className="w-7 h-7 text-text-tertiary mb-1.5" />
            <p className="text-text-secondary text-[12.5px] font-semibold">
              No active reminders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
