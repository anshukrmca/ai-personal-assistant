"use client";

import { Compass, Sparkles, Mail, Calendar, Eye, Trash2, CheckCircle2 } from "lucide-react";

export function LandingWorkflow() {
  const steps = [
    {
      num: "1",
      title: "Monitor Notifications",
      isLive: true,
      description: "Anshu AI continuously scans your connected integrations (Email, Calendar, Slack, etc.) to catch critical requests or scheduling needs."
    },
    {
      num: "2",
      title: "Contextual Logic Processing",
      isLive: false,
      description: "Our AI analyzes the signals, processes the request, and creates a plan of action with relevant context."
    },
    {
      num: "3",
      title: "Interactive Execution Card",
      isLive: false,
      description: "The action card appears in your workspace dashboard, with a simple click, you review, approve, or edit before execution."
    }
  ];

  return (
    <section id="workflow" className="py-12 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-950/20 text-violet-400 text-[12px] font-bold w-fit mx-auto animate-float-fast">
          <Compass className="w-3.5 h-3.5" /> How It Works
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
          How Your AI Assistant Comes to Life
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-[15px] sm:text-[16.5px]">
          Follow the simple three-phase framework that makes Anshu AI both powerful and secure.
        </p>
      </div>

      {/* 4-Column Grid: 3 Steps + 1 Dashboard Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 flex flex-col justify-between min-h-[300px] shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:border-violet-500/20 transition-all duration-300"
          >
            <div>
              {/* Number Badge */}
              <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 font-extrabold text-[15px] mb-6">
                {step.num}
              </div>

              {/* Title with live indicator */}
              <h3 className="font-display font-bold text-[18px] text-slate-900 dark:text-white mb-3 leading-snug flex items-center gap-2">
                {step.title}
                {step.isLive && (
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">Live</span>
                )}
              </h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 text-[13.5px] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}

        {/* Dashboard Actions Mockup Widget Card */}
        <div className="bg-slate-950/90 border border-white/[0.08] rounded-3xl p-5 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.4)] min-h-[300px] relative overflow-hidden">
          <div>
            {/* Header Tabs */}
            <div className="flex gap-4 border-b border-white/[0.06] pb-2 text-[11px] text-slate-400 font-semibold mb-3">
              <span className="text-violet-400 font-extrabold border-b-2 border-violet-500 pb-2">Inbox</span>
              <span className="hover:text-white transition-colors cursor-pointer">Calendar</span>
              <span className="hover:text-white transition-colors cursor-pointer">Tasks</span>
            </div>

            {/* Pending actions counter and action */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[12px] font-bold text-white">Pending Actions (3)</h4>
              <button className="text-[10px] text-violet-400 font-bold hover:text-violet-300">Review All</button>
            </div>

            {/* Action List rows */}
            <div className="space-y-3">
              
              {/* Row 1 */}
              <div className="p-2.5 bg-slate-900 border border-white/[0.05] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-white truncate leading-none">Sarah: Review Q3 Report</h5>
                    <p className="text-[9px] text-slate-500 mt-1">Email • 5m ago</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="px-2 py-0.5 border border-white/10 hover:bg-white/5 text-[9px] font-bold text-slate-300 rounded">Dismiss</button>
                  <button className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-[9px] font-bold text-white rounded">Approve</button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-2.5 bg-slate-900 border border-white/[0.05] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-white truncate leading-none">Team Standup Reminder</h5>
                    <p className="text-[9px] text-slate-500 mt-1">Calendar • 10:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="px-2 py-0.5 border border-white/10 hover:bg-white/5 text-[9px] font-bold text-slate-300 rounded">Review</button>
                  <button className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-[9px] font-bold text-white rounded">Approve</button>
                </div>
              </div>

              {/* Row 3 */}
              <div className="p-2.5 bg-slate-900 border border-white/[0.05] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-teal-400 font-bold font-mono">S</span>
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-white truncate leading-none">Prepare Client Update</h5>
                    <p className="text-[9px] text-slate-500 mt-1">Slack • 10m ago</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="px-2 py-0.5 border border-white/10 hover:bg-white/5 text-[9px] font-bold text-slate-300 rounded">Review</button>
                  <button className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-[9px] font-bold text-white rounded">Approve</button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
