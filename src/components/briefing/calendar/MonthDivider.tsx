import React from "react";

export function MonthDivider({ monthStr, isCurrentMonth, currentMonthRef }: { monthStr: string, isCurrentMonth: boolean, currentMonthRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={isCurrentMonth ? currentMonthRef : null} className="flex items-center gap-4 py-4 mt-4">
      <div className="h-px bg-border/50 flex-1"></div>
      <div className="px-4 py-1.5 rounded-full bg-surface-raised border border-border/50 text-[12px] font-bold text-text-primary tracking-widest uppercase flex items-center gap-2 shadow-sm">
        {monthStr} {isCurrentMonth && <span className="w-2 h-2 rounded-full bg-[#34a853]"></span>}
      </div>
      <div className="h-px bg-border/50 flex-1"></div>
    </div>
  );
}
