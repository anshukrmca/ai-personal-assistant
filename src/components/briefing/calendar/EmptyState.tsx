import React from "react";

export function EmptyState({ activeTab }: { activeTab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-text-secondary border border-dashed border-border/60 rounded-xl bg-surface-raised/30">
      <p className="font-semibold text-text-primary text-[14px]">No {activeTab === "all" ? "items" : activeTab} found</p>
      <p className="text-[12px] mt-1">{activeTab === "events" ? "Enjoy your free time!" : activeTab === "holidays" ? "No holidays in this period." : "Nothing on your schedule."}</p>
    </div>
  );
}
