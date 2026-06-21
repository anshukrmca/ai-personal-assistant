"use client";

import { useState } from "react";
import type { FeedItem } from "@/lib/types";
import { TrendingUp } from "lucide-react";

interface ActivityGraphProps {
  items: FeedItem[];
}

export default function ActivityGraph({ items }: ActivityGraphProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
  const chartData = [0, 0, 0, 0, 0, 0, 0];
  items.forEach((item) => {
    try {
      const itemDateStr = new Date(item.receivedAt).toDateString();
      const idx = weekDayStrings.indexOf(itemDateStr);
      if (idx !== -1) {
        chartData[idx]++;
      }
    } catch (e) {
      // Ignore invalid dates
    }
  });

  // SVG layout parameters
  const width = 500;
  const height = 150;
  const paddingX = 30;
  const paddingY = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxVal = Math.max(...chartData, 10);
  const points = chartData.map((val, i) => {
    const x = paddingX + (i * chartWidth) / 6;
    const y = height - paddingY - (val * chartHeight) / maxVal;
    return { x, y, value: val };
  });

  // Build cubic bezier curve path
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Build area path to close the shape for gradient fill
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : "";

  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <div className="space-y-0.5">
          <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
            Agent Update Frequency
          </h3>
          <p className="text-[11px] text-text-tertiary font-semibold uppercase tracking-wider">Weekly Activity Index</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-success bg-success-soft border border-success/15 py-1 px-2.5 rounded-full uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5" />
          +14% Activity
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[160px] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Area Fill Gradient */}
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.0} />
            </linearGradient>
            {/* Line Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="var(--color-accent)" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + ratio * chartHeight;
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                className="stroke-border/20 dark:stroke-white/5"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          {areaD && <path d={areaD} fill="url(#chartAreaGradient)" />}

          {/* Line Stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          )}

          {/* Interactive Data Dots */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Outer hover ring */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 10 : 0}
                className="fill-accent/20 transition-all duration-150 ease-out cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Solid inner dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 6 : 4}
                className="fill-accent stroke-surface dark:stroke-[#100d22] transition-all duration-150 cursor-pointer"
                strokeWidth="2"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 2}
              textAnchor="middle"
              className="fill-text-tertiary text-[10px] font-bold font-display"
            >
              {weekdays[i]}
            </text>
          ))}
        </svg>

        {/* Dynamic Tooltip overlay */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-950 py-1.5 px-3 rounded-xl text-[11px] font-extrabold shadow-lg pointer-events-none transition-all duration-150 animate-in fade-in slide-in-from-bottom-2"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 30}%`,
              transform: "translateX(-50%)",
            }}
          >
            {weekdays[hoveredIndex]}: {points[hoveredIndex].value} updates
          </div>
        )}
      </div>
    </div>
  );
}
