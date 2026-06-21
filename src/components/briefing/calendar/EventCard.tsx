import React from "react";
import { Video, Users, Flag } from "lucide-react";
import type { FeedItem } from "@/lib/types";

export function EventCard({ item, onReply }: { item: FeedItem, onReply: (item: FeedItem) => void }) {
  const isHoliday = item.id.includes('-hol-');
  const isCancelled = item.priority === "low";
  
  // Adaptive light/dark mode styling for the cards
  const baseClasses = "rounded-lg p-3 hover:shadow-md cursor-pointer transition-all overflow-hidden break-words border";
  let colorClasses = "bg-[#4285F4]/10 border-[#4285F4]/20 hover:border-[#4285F4]/40 text-[#1a73e8] dark:text-[#8ab4f8]";
  
  if (isCancelled) {
    colorClasses = "bg-surface-raised border-border/50 text-text-tertiary opacity-70";
  } else if (isHoliday) {
    colorClasses = "bg-[#34a853]/10 border-[#34a853]/20 hover:border-[#34a853]/40 text-[#1e8e3e] dark:text-[#81c995]";
  }

  return (
    <div className={`${baseClasses} ${colorClasses}`} onClick={() => onReply(item)}>
      <p className={`font-bold text-[13px] md:text-[14px] leading-tight mb-1 ${isCancelled ? "line-through text-text-tertiary" : "text-text-primary"}`}>{item.title}</p>
      <p className={`text-[11px] md:text-[12px] opacity-90 leading-relaxed mb-2 line-clamp-2 ${isCancelled ? "text-text-tertiary" : "text-text-secondary"}`}>{item.snippet}</p>
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] md:text-[11px] font-medium opacity-90">
        {!isHoliday && (
          <div className="flex items-center gap-1 min-w-0 max-w-full">
            <Video className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Google Meet</span>
          </div>
        )}
        <div className="flex items-center gap-1 min-w-0 max-w-full">
          {isHoliday ? <Flag className="w-3.5 h-3.5 shrink-0" /> : <Users className="w-3.5 h-3.5 shrink-0" />} 
          <span className="truncate">{item.from}</span>
        </div>
      </div>
    </div>
  );
}
