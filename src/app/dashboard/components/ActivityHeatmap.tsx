"use client";

import { ChevronDown } from "lucide-react";
import type { FeedItem } from "@/lib/types";

interface ActivityHeatmapProps {
  items: FeedItem[];
}

export default function ActivityHeatmap({ items }: ActivityHeatmapProps) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = ["12 AM", "6 AM", "12 PM", "6 PM", "12 AM"];

  // Initialize empty grid for pure dynamic data
  const grid = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  items.forEach((item) => {
    try {
      const d = new Date(item.receivedAt);
      const day = d.getDay(); // 0 = Sunday, 1 = Monday...
      const colIdx = day === 0 ? 6 : day - 1; // Map Sunday to 6, Monday to 0
      const hour = d.getHours();
      
      let rowIdx = 0;
      if (hour >= 5 && hour < 11) rowIdx = 1;
      else if (hour >= 11 && hour < 16) rowIdx = 2;
      else if (hour >= 16 && hour < 21) rowIdx = 3;
      else if (hour >= 21 || hour < 5) rowIdx = 4;

      grid[rowIdx][colIdx] = Math.min(100, grid[rowIdx][colIdx] + 25);
    } catch (e) {
      // Ignore invalid date
    }
  });

  // Helper to resolve Tailwind opacity classes based on activity value
  function getColorClass(val: number) {
    if (val >= 80) return "bg-accent shadow-sm shadow-accent/20";
    if (val >= 50) return "bg-accent/70";
    if (val >= 25) return "bg-accent/45";
    if (val >= 10) return "bg-accent/20";
    return "bg-accent/5 border border-white/5 dark:border-white/5";
  }

  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5 flex-1 w-full text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
          Activity Heatmap
        </h3>
        <button className="flex items-center gap-1 bg-surface-raised dark:bg-surface border border-border/50 rounded-xl px-3 py-1.5 text-[12px] font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer">
          This Month <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
        </button>
      </div>

      {/* Grid container */}
      <div className="flex flex-col gap-3 py-1">
        
        {/* Weekdays Header */}
        <div className="grid grid-cols-[55px_repeat(7,1fr)] gap-2 text-center text-[10px] font-bold text-text-tertiary font-display">
          <div /> {/* spacing for time axis */}
          {weekdays.map((day) => (
            <div key={day} className="uppercase tracking-wider">{day}</div>
          ))}
        </div>

        {/* Time Rows and Heatmap Blocks */}
        <div className="flex flex-col gap-2">
          {times.map((time, rowIdx) => (
            <div key={`${time}-${rowIdx}`} className="grid grid-cols-[55px_repeat(7,1fr)] gap-2 items-center">
              {/* Time Label */}
              <div className="text-[10px] font-bold text-text-tertiary text-left uppercase leading-none font-display">
                {time}
              </div>
              
              {/* 7 blocks for weekdays */}
              {grid[rowIdx].map((val, colIdx) => (
                <div
                  key={colIdx}
                  className={`h-5 rounded-[4px] transition-all hover:scale-110 duration-200 cursor-pointer ${getColorClass(val)}`}
                  title={`${weekdays[colIdx]} at ${time}: ${val} operations`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Grid legend indicators */}
      <div className="flex items-center justify-between text-[11px] font-extrabold text-text-tertiary mt-1 border-t border-border/40 pt-3">
        <span>Low</span>
        <div className="flex gap-1.5 px-3">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent/5 border border-white/5" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent/20" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent/45" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent/70" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent" />
        </div>
        <span>High</span>
      </div>

    </div>
  );
}
