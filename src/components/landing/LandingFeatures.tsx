"use client";

import { Zap, Inbox, Database, LayoutGrid, Check } from "lucide-react";

export function LandingFeatures() {
  const capabilities = [
    {
      icon: Zap,
      title: "Autopilot Actions",
      description: "Connect your platforms and allow the AI to proactively generate draft updates, schedule calls, compose Slack messages, and resolve requests in real time.",
      bullets: ["Multi-tasking", "Auto-execute"]
    },
    {
      icon: Inbox,
      title: "100% Control",
      description: "Anshu AI will never execute actions without explicit consent. You review, approve, or adjust every action ensuring complete visibility and security.",
      bullets: ["Human-in-the-Loop Safeguard"]
    },
    {
      icon: Database,
      title: "Deep Memory",
      description: "By context-memorizing inbox alerts and your daily schedules, the assistant builds local context maps to answer requests in exact context.",
      bullets: ["Smart Context Retrieval"]
    },
    {
      icon: LayoutGrid,
      title: "Multi-Action Commands",
      description: "Execute complex compound requests in one message. Tell Anshu AI, 'Prep my daily briefing, schedule sync with engineering, and draft the email review', and watch it bundle the actions together instantly.",
      bullets: ["Sequenced Processing", "Linked Workflows"]
    }
  ];

  return (
    <section id="features" className="py-12 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-950/20 text-violet-400 text-[12px] font-bold w-fit mx-auto">
          <Zap className="w-3.5 h-3.5" /> Core Capabilities
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
          Autopilot Execution. Safe Control.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-[15px] sm:text-[16.5px]">
          Designed to bridge the gap between simple AI chat screens and fully secure workflow automation.
        </p>
      </div>

      {/* Symmetric 4-Column Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {capabilities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="group bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6.5 hover:border-violet-500/30 dark:hover:border-violet-500/30 transition-all duration-300 flex flex-col justify-between min-h-[340px] shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-lg hover:shadow-violet-600/[0.03] dark:hover:shadow-violet-600/[0.02]"
            >
              <div>
                {/* Icon Container */}
                <div className="w-11 h-11 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-5.5 h-5.5 text-violet-500" />
                </div>
                {/* Title */}
                <h3 className="font-display font-bold text-[18px] text-slate-900 dark:text-white mb-3 leading-snug">
                  {item.title}
                </h3>
                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-[13.5px] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bullet Footer */}
              <div className="mt-8 border-t border-slate-100 dark:border-white/[0.06] pt-4.5 flex flex-col gap-2">
                {item.bullets.map((bullet, bulletIdx) => (
                  <div key={bulletIdx} className="flex items-center gap-2 text-[12.5px] font-bold text-slate-500 dark:text-slate-400 font-sans">
                    <Check className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
