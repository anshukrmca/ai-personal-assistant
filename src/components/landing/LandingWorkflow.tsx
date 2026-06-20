"use client";

import { useState } from "react";
import { Clock, Mail, Bot, Sparkles, Zap, Calendar, Compass } from "lucide-react";

const Slack = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.824 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.042zm10.134 3.782a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.78 10.132a2.528 2.528 0 0 1-2.522 2.52 2.528 2.528 0 0 1-2.52-2.52v-2.52h2.52a2.528 2.528 0 0 1 2.522 2.52zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" />
  </svg>
);

export function LandingWorkflow() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const workflowSteps = [
    {
      title: "1. Monitor Notifications",
      description: "Anshu AI continuously scans your connected integrations (Gmail, WhatsApp, Slack, Calendar) to catch critical requests or scheduling needs.",
      icon: Clock,
      badge: "Listening",
      color: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      uiMockup: (
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] rounded-xl p-4 shadow-2xl relative overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-white/[0.05] pb-2 transition-colors duration-300">
            <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 transition-colors duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Incoming Streams
            </span>
            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono transition-colors duration-300">Live</span>
          </div>
          <div className="space-y-2 text-[13px]">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-white/[0.05] flex items-start gap-2.5 transition-colors duration-300">
              <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-500/15 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-[12px] transition-colors duration-300">Sarah Jenkins (Google Calendar)</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate transition-colors duration-300">Can we reschedule the sync to 3:00 PM today?</div>
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-white/[0.05] flex items-start gap-2.5 opacity-50 transition-colors duration-300">
              <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                <Slack className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-[12px] transition-colors duration-300">David Miller</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate transition-colors duration-300">Did you review the proposal slides yet?</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. Contextual Logic Processing",
      description: "Our LLM reasoning engine processes the request. It retrieves calendar slot availability, compiles relevant details, and drafts appropriate actions.",
      icon: Bot,
      badge: "Reasoning",
      color: "border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10",
      uiMockup: (
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] rounded-xl p-4 shadow-2xl relative overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-white/[0.05] pb-2 transition-colors duration-300">
            <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 transition-colors duration-300">
              <Sparkles className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 animate-pulse" />
              AI Cognitive Thought
            </span>
            <span className="text-[10px] bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-mono transition-colors duration-300">Thinking...</span>
          </div>
          <div className="space-y-2 text-[12.5px] font-mono text-slate-600 dark:text-slate-300 transition-colors duration-300">
            <p className="text-violet-600 dark:text-violet-300">&gt; Parsing email from Sarah Jenkins...</p>
            <p className="text-slate-500 dark:text-slate-400">&gt; Request: Reschedule sync to 3:00 PM today.</p>
            <p className="text-slate-500 dark:text-slate-400">&gt; Querying local calendar availability...</p>
            <p className="text-emerald-600 dark:text-emerald-400">&gt; Slot 3:00 PM - 3:30 PM is FREE.</p>
            <p className="text-violet-600 dark:text-violet-300">&gt; Action drafted: Calendar Reschedule & Email Confirm.</p>
          </div>
        </div>
      )
    },
    {
      title: "3. Interactive Execution Card",
      description: "The action cards appear in your workspace dashboard. With a single click, you approve, customize, or reject them. Nothing sends without your word.",
      icon: Zap,
      badge: "Approval",
      color: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
      uiMockup: (
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] rounded-xl p-4 shadow-2xl relative overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between mb-2 border-b border-slate-200 dark:border-white/[0.05] pb-1.5 transition-colors duration-300">
            <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 transition-colors duration-300">
              <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Pending Action Card
            </span>
            <span className="text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-mono transition-colors duration-300">Needs Approval</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3 transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1 transition-colors duration-300">
                <Calendar className="w-3 h-3 text-violet-500 dark:text-violet-400" /> Reschedule Sync
              </span>
              <span className="text-[9px] bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 px-1.5 py-0.5 rounded-md transition-colors duration-300">3:00 PM Today</span>
            </div>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed transition-colors duration-300">
              Updates "Project Sync" in calendar and drafts confirmation reply to Sarah Jenkins.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-md shadow-violet-600/20">
                Execute Action
              </button>
              <button className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[11px] transition-colors cursor-pointer">
                Edit
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="workflow" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-50 dark:bg-violet-500/5 text-violet-600 dark:text-violet-400 text-[12px] font-bold w-fit mx-auto animate-float-fast transition-colors duration-300">
          <Compass className="w-3.5 h-3.5" /> Visual Pipeline
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight transition-colors duration-300">
          How Your AI Assistant Comes to Life
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-[15px] sm:text-[16px] transition-colors duration-300">
          Follow the simple three-phase framework that makes Anshu AI both powerful and secure.
        </p>
      </div>

      {/* Workflow Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Steps Left Selector */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeWorkflowStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-white/[0.03] border-violet-300 dark:border-violet-500/40 shadow-xl shadow-violet-600/5 scale-[1.02]"
                    : "bg-transparent border-slate-200 dark:border-white/[0.04] hover:border-slate-300 dark:hover:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.01]"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-300 ${
                  isActive ? "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400" : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.05] text-slate-500"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-display font-bold text-[15.5px] transition-colors duration-300 ${isActive ? "text-slate-900 dark:text-white font-extrabold" : "text-slate-600 dark:text-slate-300"}`}>
                      {step.title}
                    </h3>
                    {isActive && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${step.color} transition-colors duration-300`}>
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[13px] leading-relaxed transition-colors duration-300 ${isActive ? "text-slate-700 dark:text-slate-300" : "text-slate-500"}`}>
                    {isActive ? step.description : step.description.substring(0, 80) + "..."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Steps Right UI Mockup display */}
        <div className="lg:col-span-7 flex justify-center items-center relative">
          <div className="absolute w-64 h-64 bg-violet-100 dark:bg-violet-600/10 rounded-full blur-[80px] pointer-events-none transition-colors duration-300"></div>
          <div className="w-full max-w-[480px] bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.06] rounded-[2rem] p-5 shadow-2xl relative z-10 backdrop-blur-2xl transition-all duration-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500/40 transition-colors duration-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-yellow-500/40 transition-colors duration-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500/40 transition-colors duration-300"></span>
              <span className="text-[11px] text-slate-500 font-mono ml-2">anshu-engine-logs.sh</span>
            </div>
            <div className="transition-all duration-300">
              {workflowSteps[activeWorkflowStep].uiMockup}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
