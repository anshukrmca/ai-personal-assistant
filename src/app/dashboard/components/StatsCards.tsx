"use client";

import { Mail, Briefcase, CheckCircle, Flame } from "lucide-react";
import type { FeedItem } from "@/lib/types";

interface StatsCardsProps {
  items: FeedItem[];
  completedItemsCount: number;
}

export default function StatsCards({ items, completedItemsCount }: StatsCardsProps) {
  const totalEmails = items.filter((i) => i.type === "email").length;
  
  const inProgressCount = items.filter(
    (i) => !i.isRead && (i.requiresFollowUp || i.priority === "high")
  ).length;

  const displayInProgress = inProgressCount;
  
  const totalTasksCount = items.length + completedItemsCount;
  const focusScoreCalc = totalTasksCount > 0 
    ? Math.round((completedItemsCount / totalTasksCount) * 100) 
    : 0;

  // Mini sparkline data generators (Sparklines remain visual placeholders since we don't have historical DB data)
  const stats = [
    {
      title: "Emails Processed",
      value: totalEmails.toString(),
      change: "+18.2%",
      subtext: "vs last 7 days",
      icon: Mail,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      sparklineColor: "#a855f7",
      sparklineData: [5, 12, 8, 15, 11, 20, 18],
    },
    {
      title: "Tasks in Progress",
      value: displayInProgress.toString(),
      change: "+8.3%",
      subtext: "vs last 7 days",
      icon: Briefcase,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      sparklineColor: "#3b82f6",
      sparklineData: [8, 6, 12, 10, 15, 11, 12],
    },
    {
      title: "Completed Tasks",
      value: completedItemsCount.toString(),
      change: "+24.5%",
      subtext: "vs last 7 days",
      icon: CheckCircle,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      sparklineColor: "#10b981",
      sparklineData: [15, 20, 24, 30, 32, 40, 48],
    },
    {
      title: "Focus Score",
      value: `${focusScoreCalc}%`,
      change: "+12%",
      subtext: "vs last 7 days",
      icon: Flame,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      sparklineColor: "#f59e0b",
      sparklineData: [70, 72, 75, 78, 80, 82, 84],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full rise-in">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        // Generate SVG sparkline path
        const width = 120;
        const height = 30;
        const maxVal = Math.max(...stat.sparklineData);
        const minVal = Math.min(...stat.sparklineData);
        const range = maxVal - minVal || 1;
        const points = stat.sparklineData.map((val, i) => {
          const x = (i * width) / (stat.sparklineData.length - 1);
          const y = height - 3 - ((val - minVal) * (height - 6)) / range;
          return `${x},${y}`;
        }).join(" ");

        return (
          <div
            key={index}
            className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11.5px] font-extrabold text-text-tertiary uppercase tracking-wider font-display">
                  {stat.title}
                </span>
                <p className="text-2xl font-display font-extrabold text-text-primary tracking-tight group-hover:text-accent transition-colors">
                  {stat.value}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>

            <div className="flex items-end justify-between mt-1">
              <div className="text-[11.5px] font-semibold text-text-secondary leading-none">
                <span className="text-success font-extrabold mr-1">{stat.change}</span>
                {stat.subtext}
              </div>

              {/* Mini Sparkline Chart */}
              <div className="w-[120px] h-[30px] overflow-visible">
                <svg viewBox={`0 0 120 30`} className="w-full h-full overflow-visible">
                  <polyline
                    fill="none"
                    stroke={stat.sparklineColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
