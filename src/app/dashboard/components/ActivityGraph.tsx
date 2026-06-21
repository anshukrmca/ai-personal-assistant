"use client";

import type { FeedItem } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ActivityGraphProps {
  items: FeedItem[];
  completionRate: number;
}

export default function ActivityGraph({ items, completionRate }: ActivityGraphProps) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Monday to Sunday dates of the current week
  const today = new Date();
  const currentDay = today.getDay();
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  // Generate date strings for each day of the current week
  const weekDayStrings = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toDateString();
  });

  // Calculate actual item counts matching each weekday of this week
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  items.forEach((item) => {
    try {
      const itemDateStr = new Date(item.receivedAt).toDateString();
      const idx = weekDayStrings.indexOf(itemDateStr);
      if (idx !== -1) {
        dayCounts[idx]++;
      }
    } catch (e) {
      // Ignore invalid dates
    }
  });

  const chartData = weekdays.map((day, i) => ({
    name: day,
    value: dayCounts[i],
  }));

  // Dynamic Metrics calculations
  const totalActivities = dayCounts.reduce((sum, val) => sum + val, 0);
  const avgActivities = Math.round(totalActivities / 7);
  
  // Find Peak Day
  const peakVal = Math.max(...dayCounts);
  const peakDayIdx = dayCounts.indexOf(peakVal);
  const peakDay = weekdays[peakDayIdx !== -1 ? peakDayIdx : 4];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-950 py-1.5 px-3 rounded-xl text-[11px] font-extrabold shadow-lg">
          {label}: {payload[0].value} updates
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6">
      
      {/* Title & Timeframe */}
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <div className="space-y-0.5">
          <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
            Activity Overview
          </h3>
          <p className="text-[11px] text-text-tertiary font-semibold uppercase tracking-wider font-display">Weekly Activity Index</p>
        </div>
        <button className="flex items-center gap-1 bg-surface-raised dark:bg-surface border border-border/50 rounded-xl px-3 py-1.5 text-[12px] font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer">
          This Week <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
        </button>
      </div>

      {/* Recharts Canvas Area */}
      <div className="relative w-full h-[180px] select-none mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#888888" strokeOpacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: "#888888" }} 
              dy={10} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#888888', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-accent)" 
              strokeWidth={3.5}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, fill: "var(--color-accent)", stroke: "#100d22", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Metrics Footer grid panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40 w-full text-left">
        <div className="space-y-0.5">
          <p className="text-[11px] text-text-tertiary font-bold tracking-wide">Total Activities</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[16px] font-display font-extrabold text-text-primary">{totalActivities}</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] text-text-tertiary font-bold tracking-wide">Peak Day</p>
          <p className="text-[14px] font-display font-extrabold text-text-primary">
            {totalActivities > 0 ? peakDay : "N/A"} <span className="text-[11px] text-text-secondary font-medium font-sans">({peakVal} Acts)</span>
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] text-text-tertiary font-bold tracking-wide">Avg. per Day</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[16px] font-display font-extrabold text-text-primary">{avgActivities}</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] text-text-tertiary font-bold tracking-wide">Completion Rate</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[16px] font-display font-extrabold text-text-primary">{completionRate}%</span>
          </div>
        </div>
      </div>

    </div>
  );
}
