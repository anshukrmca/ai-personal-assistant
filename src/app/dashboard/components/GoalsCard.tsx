"use client";

import { ChevronDown, CheckSquare, Plug, ShieldAlert } from "lucide-react";

interface GoalsCardProps {
  taskCompletionRate: number;
  appConnectionRate: number;
  highPriorityRate: number;
}

export default function GoalsCard({
  taskCompletionRate,
  appConnectionRate,
  highPriorityRate,
}: GoalsCardProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5">
      
      {/* Title & Dropdown Filter */}
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
          My Goals
        </h3>
        <button className="flex items-center gap-1 bg-surface-raised dark:bg-surface border border-border/50 rounded-xl px-3 py-1.5 text-[12px] font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer">
          This Month <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Goal 1: Task Completion */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2.5">
              <div className="w-7.5 h-7.5 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-text-primary">Briefing Task Completion</h4>
                <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider font-display">Daily action checklist</p>
              </div>
            </div>
            <span className="font-display font-extrabold text-accent">{taskCompletionRate}%</span>
          </div>
          <div className="h-2 w-full bg-surface-raised dark:bg-surface rounded-full overflow-hidden border border-border/20">
            <div
              className="h-full bg-gradient-to-r from-accent to-[#9061f9] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Goal 2: Platform Connection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2.5">
              <div className="w-7.5 h-7.5 rounded-lg bg-info/10 flex items-center justify-center text-info shrink-0">
                <Plug className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-text-primary">Platform Connectivity Strength</h4>
                <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider font-display">Connected core integrations</p>
              </div>
            </div>
            <span className="font-display font-extrabold text-info">{appConnectionRate}%</span>
          </div>
          <div className="h-2 w-full bg-surface-raised dark:bg-surface rounded-full overflow-hidden border border-border/20">
            <div
              className="h-full bg-gradient-to-r from-info to-[#60a5fa] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${appConnectionRate}%` }}
            />
          </div>
        </div>

        {/* Goal 3: Priority Alerts */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2.5">
              <div className="w-7.5 h-7.5 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-text-primary">Priority Alerts Cleared</h4>
                <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider font-display">High priority feed items resolved</p>
              </div>
            </div>
            <span className="font-display font-extrabold text-success">{highPriorityRate}%</span>
          </div>
          <div className="h-2 w-full bg-surface-raised dark:bg-surface rounded-full overflow-hidden border border-border/20">
            <div
              className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${highPriorityRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
