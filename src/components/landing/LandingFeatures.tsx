import { Zap, Check, Lock, Bot, Layers } from "lucide-react";

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 md:py-28 border-t border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-slate-950/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-50 dark:bg-violet-500/5 text-violet-600 dark:text-violet-400 text-[12px] font-bold w-fit mx-auto transition-colors duration-300">
          <Zap className="w-3.5 h-3.5" /> Core Capabilities
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight transition-colors duration-300">
          Autopilot Execution. Safe Control.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-[15px] sm:text-[16px] transition-colors duration-300">
          Designed to bridge the gap between simple AI chat screens and fully secure workflow automation.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Autopilot (Double Col on Large Screens) */}
        <div className="md:col-span-2 group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-3xl p-8 hover:border-violet-300 dark:hover:border-violet-500/25 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm dark:shadow-none">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-100 dark:bg-violet-600/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-violet-200 dark:group-hover:bg-violet-600/15"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center mb-6 transition-colors duration-300">
              <Zap className="w-5.5 h-5.5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-2 transition-colors duration-300">
              Autopilot Actions
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-[14.5px] max-w-md leading-relaxed transition-colors duration-300">
              Connect your platforms and allow the AI to proactively generate draft updates, schedule calls, compose Slack memos, and resolve requests in real time.
            </p>
          </div>
          <div className="mt-8 border-t border-slate-200 dark:border-white/[0.05] pt-4 flex gap-4 text-[12.5px] font-mono text-slate-500 transition-colors duration-300 relative z-10">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Multitasking</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Auto-Grouping</span>
          </div>
        </div>

        {/* Card 2: Safe Execution (1 Col) */}
        <div className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-3xl p-8 hover:border-indigo-300 dark:hover:border-violet-500/25 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm dark:shadow-none">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-100 dark:bg-indigo-600/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-indigo-200 dark:group-hover:bg-indigo-600/15"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mb-6 transition-colors duration-300">
              <Lock className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2 transition-colors duration-300">
              100% Control
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-[14.5px] leading-relaxed transition-colors duration-300">
              Anshu AI will never execute external API triggers or send real emails without your explicit approval, keeping your reputation secure.
            </p>
          </div>
          <div className="mt-8 border-t border-slate-200 dark:border-white/[0.05] pt-4 text-[12.5px] font-mono text-slate-500 flex items-center gap-1.5 transition-colors duration-300 relative z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Human-in-the-Loop Safeguard
          </div>
        </div>

        {/* Card 3: Context Aware (1 Col) */}
        <div className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-3xl p-8 hover:border-fuchsia-300 dark:hover:border-violet-500/25 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm dark:shadow-none">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-fuchsia-100 dark:bg-fuchsia-600/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-fuchsia-200 dark:group-hover:bg-fuchsia-600/15"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-500/10 border border-fuchsia-200 dark:border-fuchsia-500/20 flex items-center justify-center mb-6 transition-colors duration-300">
              <Bot className="w-5.5 h-5.5 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2 transition-colors duration-300">
              Deep Memory
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-[14.5px] leading-relaxed transition-colors duration-300">
              By cross-referencing inbox alerts and your daily schedules, the assistant builds local context maps to answer requests in exact context.
            </p>
          </div>
          <div className="mt-8 border-t border-slate-200 dark:border-white/[0.05] pt-4 text-[12.5px] font-mono text-slate-500 flex items-center gap-1.5 transition-colors duration-300 relative z-10">
            <Check className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
            Smart Context Retrieval
          </div>
        </div>

        {/* Card 4: Multi-Action (Double Col) */}
        <div className="md:col-span-2 group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-3xl p-8 hover:border-violet-300 dark:hover:border-violet-500/25 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm dark:shadow-none">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-100 dark:bg-violet-600/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-violet-200 dark:group-hover:bg-violet-600/15"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center mb-6 transition-colors duration-300">
              <Layers className="w-5.5 h-5.5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-2 transition-colors duration-300">
              Multi-Action Commands
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-[14.5px] max-w-md leading-relaxed transition-colors duration-300">
              Execute complex compound requests in one message. Tell Anshu AI: "Prepare my daily briefing, schedule sync with engineering, and draft the email review," and watch it bundle the actions together instantly.
            </p>
          </div>
          <div className="mt-8 border-t border-slate-200 dark:border-white/[0.05] pt-4 flex gap-4 text-[12.5px] font-mono text-slate-500 transition-colors duration-300 relative z-10">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Concurrent processing</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Linked variables</span>
          </div>
        </div>

      </div>
    </section>
  );
}
