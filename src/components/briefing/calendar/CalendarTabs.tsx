import React from "react";
import { Calendar, Flag } from "lucide-react";

export function CalendarTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: any) => void }) {
  return (
    <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-2">
      <button onClick={() => setActiveTab("all")} className={`cursor-pointer px-4 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${activeTab === "all" ? "bg-text-primary text-surface" : "text-text-secondary hover:bg-surface-raised"}`}>
        All
      </button>
      <button onClick={() => setActiveTab("events")} className={`cursor-pointer px-4 py-1.5 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-1.5 ${activeTab === "events" ? "bg-accent text-white" : "text-text-secondary hover:bg-surface-raised"}`}>
        <Calendar className="w-3.5 h-3.5" /> Events
      </button>
      <button onClick={() => setActiveTab("holidays")} className={`cursor-pointer px-4 py-1.5 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-1.5 ${activeTab === "holidays" ? "bg-[#34a853] text-white" : "text-text-secondary hover:bg-surface-raised"}`}>
        <Flag className="w-3.5 h-3.5" /> Holidays
      </button>
    </div>
  );
}
