"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Sparkles, AlertCircle } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
  summary: string;
  mockData: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function WelcomeBanner({
  userName,
  summary,
  mockData,
  refreshing,
  onRefresh,
}: WelcomeBannerProps) {
  const [timeStr, setTimeStr] = useState("");

  // Update date/time dynamically
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const datePart = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const timePart = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      setTimeStr(`${datePart} • ${timePart}`);
    }
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-[1.75rem] border border-accent/10 bg-gradient-to-r from-accent/5 to-accent/10 dark:from-[#18152e]/50 dark:to-[#100d22]/50 dark:border-white/5 p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden transition-all duration-300 rise-in">
      <div className="absolute top-0 left-0 w-2 h-full bg-accent" />

      <div className="space-y-3.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {mockData ? (
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full border text-accent bg-accent-soft border-accent/20 flex items-center gap-1.5 font-display">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Simulation Environment Active
            </span>
          ) : (
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full border text-success bg-success-soft border-success/20 flex items-center gap-1.5 font-display">
              <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />
              Live Sync Active
            </span>
          )}
        </div>

        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-text-primary tracking-tight leading-none">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#9061f9] font-black">
            {userName}
          </span>
        </h2>

        <p className="text-[14.5px] leading-relaxed text-text-secondary font-semibold max-w-2xl">
          {mockData
            ? "Your dashboard is running in Simulation Mode. Connect your real Gmail or WhatsApp accounts in the Integrations panel to fetch live data."
            : summary || "No briefings generated. Click refresh to query your connected accounts."}
        </p>

        <p className="text-[11.5px] text-text-tertiary font-bold tracking-wide">
          {timeStr}
        </p>
      </div>

      <div className="shrink-0 self-end md:self-center">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white px-5.5 py-3.5 text-[13.5px] font-black hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-md shadow-accent/15"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} strokeWidth={2.5} />
          Refresh / Regenerate
        </button>
      </div>
    </div>
  );
}
