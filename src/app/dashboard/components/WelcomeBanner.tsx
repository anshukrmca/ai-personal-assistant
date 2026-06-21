"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Sparkles, Calendar } from "lucide-react";
import Image from "next/image";

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
    <div className="rounded-[1.75rem] border border-accent/15 bg-gradient-to-r from-accent/5 to-[#100d22]/80 dark:from-[#18152e]/80 dark:to-[#0a0814] dark:border-white/5 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden transition-all duration-300 rise-in">
      {/* Background Star Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent z-0"></div>
      
      <div className="absolute top-0 left-0 w-2.5 h-full bg-accent z-10" />

      {/* Left panel: greeting & descriptions */}
      <div className="space-y-4 flex-1 min-w-0 z-10 relative">
        <div className="flex items-center gap-2 flex-wrap">
          {mockData ? (
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-3 py-1.5 rounded-full border text-accent bg-accent/10 border-accent/20 flex items-center gap-1.5 font-display shadow-inner">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Simulation Mode Active
            </span>
          ) : (
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-3 py-1.5 rounded-full border text-success bg-success/10 border-success/20 flex items-center gap-1.5 font-display shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />
              Live Sync Active
            </span>
          )}
        </div>

        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-text-primary tracking-tight leading-none pt-1">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#9061f9] font-black">
            {userName} <span className="text-amber-500">👋</span>
          </span>
        </h2>

        <p className="text-[14px] leading-relaxed text-text-secondary font-medium max-w-xl">
          {mockData
            ? "Your dashboard is running in Simulation Mode. Connect your real Gmail or WhatsApp accounts in the Integrations panel to fetch live data."
            : summary || "No briefings generated. Click refresh to query your connected accounts."}
        </p>

        <p className="text-[12px] text-text-tertiary font-bold tracking-wide flex items-center gap-2 pt-2">
          <Calendar className="w-3.5 h-3.5" /> {timeStr}
        </p>
      </div>

      {/* Right panel: 3D Illustration and refresh button */}
      <div className="flex flex-col sm:flex-row items-center gap-6 self-stretch lg:self-center shrink-0 w-full lg:w-auto justify-between lg:justify-end z-10 relative">
        
        {/* 3D Illustration Image (Hidden on mobile) */}
        <div className="hidden md:flex items-center justify-center rounded-2xl w-[260px] h-[140px] relative overflow-hidden shrink-0 group">
          <Image 
            src="/banner-illustration.png" 
            alt="AI Assistant 3D Illustration" 
            fill
            className="object-cover object-center scale-110 group-hover:scale-105 transition-transform duration-500 rounded-2xl mix-blend-screen opacity-90"
            sizes="(max-width: 768px) 100vw, 260px"
            priority
          />
        </div>

        {/* Sync triggers */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2.5 rounded-[1rem] bg-gradient-to-r from-[#7c3aed] to-[#9061f9] text-white px-6 py-4 text-[14px] font-black hover:scale-[1.02] hover:shadow-xl hover:shadow-[#7c3aed]/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-lg shrink-0 w-full sm:w-auto border border-white/10"
        >
          <RefreshCw className={`w-4.5 h-4.5 ${refreshing ? "animate-spin" : ""}`} strokeWidth={2.5} />
          Refresh / Regenerate
        </button>
      </div>
    </div>
  );
}
