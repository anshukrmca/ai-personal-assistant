"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Check, Plus } from "lucide-react";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { FeedItem, IntegrationPlatform } from "@/lib/types";

interface TasksCardProps {
  items: FeedItem[];
  completedItems: Record<string, boolean>;
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

export default function TasksCard({ items, completedItems, toggleTask }: TasksCardProps) {
  const [activeTab, setActiveTab] = useState<"in_progress" | "completed">("in_progress");

  // Calculate counts for each tab dynamically
  const inProgressCount = items.filter((i) => !completedItems[i.id]).length;
  const completedCount = items.filter((i) => completedItems[i.id]).length;

  // Filter tasks based on selected tab status
  const filteredTasks = items.filter((item) => {
    const isCompleted = !!completedItems[item.id];
    return activeTab === "completed" ? isCompleted : !isCompleted;
  });

  return (
    <div
      id="my-tasks-card"
      className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5 scroll-mt-24"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/40">
        <div className="flex items-center gap-3">
          <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
            My Tasks
          </h3>
          <span className="text-[11.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-accent-soft text-accent">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Action Status Tabs with Counters */}
        <div className="flex bg-surface-raised dark:bg-surface p-1 rounded-full border border-border/50 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("in_progress")}
            className={`px-4 py-1.5 rounded-full text-[12px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === "in_progress"
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-1.5 rounded-full text-[12px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List container */}
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
        {filteredTasks.map((item) => {
          const platform = item.source as IntegrationPlatform;
          const meta = PLATFORM_META[platform];
          const Icon = meta?.icon;
          const isCompleted = !!completedItems[item.id];
          const priorityColorClass =
            item.priority === "high"
              ? "bg-danger-soft text-danger border-danger/10"
              : item.priority === "medium"
              ? "bg-amber-100/50 text-amber-700 border-amber-200/40 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
              : "bg-success-soft text-success border-success/10";

          return (
            <div
              key={item.id}
              onClick={() => toggleTask(item.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer hover:border-accent/30 group ${
                isCompleted
                  ? "bg-surface-raised/40 border-border/30 dark:bg-surface-raised/10 opacity-70"
                  : "bg-surface border-border/60 hover:bg-surface-raised/30 dark:bg-surface-raised/5 dark:hover:bg-surface-raised/10"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Platform logo badge */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105"
                  style={{
                    background: `${meta?.color ?? "#888"}0d`,
                    borderColor: `${meta?.color ?? "#888"}20`,
                  }}
                >
                  {Icon && <Icon className="w-[18px] h-[18px]" style={{ color: meta?.color }} />}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-[13.5px] font-bold text-text-primary leading-snug truncate ${
                      isCompleted ? "line-through text-text-tertiary" : ""
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[11.5px] text-text-secondary truncate mt-0.5 font-medium">
                    From: {item.from} • {timeAgo(item.receivedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 shrink-0">
                {/* Priority status */}
                <span
                  className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wide ${priorityColorClass}`}
                >
                  {item.priority}
                </span>

                {/* Checkbox button */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isCompleted
                      ? "bg-accent border-accent text-white scale-110"
                      : "border-border hover:border-accent/40 group-hover:scale-105"
                  }`}
                >
                  {isCompleted && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-border/60 rounded-2xl bg-surface-raised/10">
            <CheckCircle2 className="w-8 h-8 text-text-tertiary mb-2" />
            <p className="text-text-secondary text-[13.5px] font-semibold">
              {activeTab === "completed" ? "No completed tasks yet." : "All caught up! No tasks in progress."}
            </p>
          </div>
        )}
      </div>

      {/* Add New Task button row */}
      <Link
        href="/chat?q=Create a new task to "
        className="py-3 px-4 rounded-2xl border border-dashed border-border/80 hover:border-accent/40 bg-surface hover:bg-surface-raised/20 text-center text-[13px] font-extrabold text-text-secondary hover:text-accent transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
      >
        <Plus className="w-4 h-4 stroke-[3]" /> Add New Task
      </Link>
    </div>
  );
}
