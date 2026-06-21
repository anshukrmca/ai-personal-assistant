"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import type { FeedItem } from "@/lib/types";

interface ProductivityInsightsProps {
  items: FeedItem[];
}

export default function ProductivityInsights({ items }: ProductivityInsightsProps) {
  // Dynamic breakdown calculation based purely on feed items
  const rawDeepWork = items.filter(i => i.type === 'reminder' || i.priority === 'high').length * 3;
  const rawMeetings = items.filter(i => i.type === 'meeting').length * 4;
  const rawEmails = items.filter(i => i.type === 'email').length * 3;
  const rawBreaks = items.filter(i => i.type === 'message').length * 2;

  const totalRaw = rawDeepWork + rawMeetings + rawEmails + rawBreaks;
  
  const deepWorkPct = totalRaw > 0 ? Math.round((rawDeepWork / totalRaw) * 100) : 0;
  const meetingsPct = totalRaw > 0 ? Math.round((rawMeetings / totalRaw) * 100) : 0;
  const emailsPct = totalRaw > 0 ? Math.round((rawEmails / totalRaw) * 100) : 0;
  
  // If totalRaw is 0, we can't subtract from 100 for breaks. Just use 0.
  // Otherwise, ensure they sum to exactly 100 by calculating breaks as the remainder.
  const breaksPct = totalRaw > 0 ? 100 - (deepWorkPct + meetingsPct + emailsPct) : 0;

  const segments = [
    { label: "Deep Work", value: deepWorkPct, color: "#a855f7" },
    { label: "Meetings", value: meetingsPct, color: "#f59e0b" },
    { label: "Emails", value: emailsPct, color: "#3b82f6" },
    { label: "Breaks", value: breaksPct, color: "#10b981" },
  ];

  const productivityScore = totalRaw > 0 
    ? Math.min(98, Math.max(60, deepWorkPct + Math.round(emailsPct * 0.7) + Math.round(meetingsPct * 0.4)))
    : 0;

  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5 flex-1 w-full text-left">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
          Productivity Insights
        </h3>
        <button className="flex items-center gap-1 bg-surface-raised dark:bg-surface border border-border/50 rounded-xl px-3 py-1.5 text-[12px] font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer">
          This Month <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
        </button>
      </div>

      {/* Donut and Legend row */}
      <div className="flex items-center justify-between gap-6 py-4 flex-1">
        {/* Recharts Donut Chart */}
        <div className="relative w-[140px] h-[140px] shrink-0 select-none">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={4}
              >
                {segments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centered text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[22px] font-display font-black text-text-primary leading-none">{productivityScore}%</span>
            <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider mt-1">Productive</span>
          </div>
        </div>

        {/* Legend list */}
        <div className="flex flex-col gap-2.5 flex-1">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex items-center justify-between text-[12.5px] font-semibold text-text-primary">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-text-secondary truncate max-w-[90px]">{seg.label}</span>
              </div>
              <span className="font-display font-bold text-right shrink-0">{seg.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
