import Link from "next/link";
import { Sparkles, ArrowRight, Calendar, Mail } from "lucide-react";
import type { SessionPayload } from "@/lib/types";

interface LandingHeroProps {
  session: SessionPayload | null;
}

export function LandingHero({ session }: LandingHeroProps) {
  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Text Column */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400 text-[12.5px] font-bold w-fit animate-float-fast transition-colors duration-300">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>Version 2.0 Autopilot Engine Live</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            Anshu AI Personal Assistant,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-indigo-400">
              Tailored for You
            </span>
          </h1>

          {/* Subhead */}
          <p className="text-slate-600 dark:text-slate-400 text-[15.5px] sm:text-lg leading-relaxed max-w-xl transition-colors duration-300">
            Connect your apps. Let AI handle the noise. Anshu AI coordinates with your inbox, organizes calendars, drafts message responses, and triggers custom actions under your command.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href={session ? "/dashboard" : "/login"}
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[16px] shadow-xl shadow-violet-600/30 hover:shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {session ? "Enter Dashboard" : "Launch Your Assistant"}
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <a
              href="#workflow"
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-[16px] transition-all cursor-pointer shadow-sm dark:shadow-none"
            >
              See How It Works
            </a>
          </div>

          {/* Micro Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-white/[0.05] mt-4 transition-colors duration-300">
            <div>
              <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white transition-colors duration-300">100%</p>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider transition-colors duration-300">Human Safe Approval</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white transition-colors duration-300">&lt; 3s</p>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider transition-colors duration-300">Response Speed</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white transition-colors duration-300">8+</p>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider transition-colors duration-300">Core Integrations</p>
            </div>
          </div>
        </div>

        {/* Right Visual Column (Glow Mockup) */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          
          {/* Glow Core */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-violet-600 to-[#9061f9] rounded-full blur-[80px] opacity-15 dark:opacity-25 pointer-events-none transition-opacity duration-300"></div>

          {/* Central Mock Interactive Device Container */}
          <div className="w-full max-w-[370px] bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] rounded-[2.5rem] p-3 shadow-2xl relative z-10 backdrop-blur-2xl ring-1 ring-slate-200 dark:ring-white/10 transition-colors duration-300">
            
            {/* Internal Screen Layout */}
            <div className="bg-slate-50 dark:bg-[#0b081e] rounded-[2rem] p-4 min-h-[440px] flex flex-col justify-between overflow-hidden relative border border-slate-200 dark:border-white/[0.05] transition-colors duration-300">
              
              {/* Simulated Screen Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.05] mb-3 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-violet-600 dark:text-violet-400 animate-pulse" />
                  </div>
                  <span className="font-bold text-[12px] text-slate-700 dark:text-slate-200 transition-colors duration-300">Anshu Assistant</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {/* Simulated Message Stream */}
              <div className="flex-1 space-y-4 select-none">
                {/* User Bubble */}
                <div className="flex flex-col items-end pl-8">
                  <div className="bg-violet-600/90 text-white rounded-[1.2rem] rounded-tr-none px-3.5 py-2.5 text-[12px] font-medium leading-normal shadow-md shadow-violet-600/10">
                    Summarize my day and draft a reschedule email to Sarah
                  </div>
                </div>

                {/* Assistant Thoughts Bubble */}
                <div className="flex items-start gap-2.5 pr-8 animate-float-fast">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 rounded-[1.2rem] rounded-tl-none p-3 text-[11.5px] leading-relaxed shadow-lg transition-colors duration-300">
                    <p className="font-bold text-violet-600 dark:text-violet-400 mb-1">AI Reasoning:</p>
                    Found reschedule request from Sarah. Recommended time slot 3 PM is open. Drafted calendar invite update and email response.
                  </div>
                </div>

                {/* Assistant Actions Multi-Card Wrapper */}
                <div className="pl-8 space-y-2.5 animate-float-medium">
                  {/* Action 1 */}
                  <div className="bg-white dark:bg-slate-900/90 border border-violet-200 dark:border-violet-500/30 rounded-xl p-3 shadow-lg hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-white flex items-center gap-1.5 transition-colors duration-300">
                        <Calendar className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                        Update Sync Schedule
                      </span>
                      <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded transition-colors duration-300">Action 1</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal transition-colors duration-300">
                      Move "Sarah Jenkins Sync" to 3:00 PM today.
                    </p>
                  </div>

                  {/* Action 2 */}
                  <div className="bg-white dark:bg-slate-900/90 border border-violet-200 dark:border-violet-500/30 rounded-xl p-3 shadow-lg hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-white flex items-center gap-1.5 transition-colors duration-300">
                        <Mail className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                        Draft Gmail Confirmation
                      </span>
                      <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded transition-colors duration-300">Action 2</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal transition-colors duration-300">
                      To: sarah.j@company.com - Subject: Sync Rescheduled
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulated Screen Footer */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/[0.05] flex gap-2 transition-colors duration-300">
                <button className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-115 text-white font-extrabold text-[11px] rounded-xl transition-all cursor-pointer shadow-md shadow-violet-600/35 flex items-center justify-center gap-1">
                  Execute All <ArrowRight className="w-3 h-3" />
                </button>
                <button className="px-3.5 py-2 border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl text-[11px] font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-white/[0.02] transition-colors duration-300">
                  Refuse
                </button>
              </div>

            </div>
          </div>

          {/* Floating Pills decorations */}
          <div className="absolute top-10 left-[-40px] px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] shadow-2xl flex items-center gap-2 animate-float-slow z-20 transition-colors duration-300">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-[11px] text-slate-700 dark:text-slate-200 font-bold transition-colors duration-300">Reschedule Sync</span>
          </div>
          <div className="absolute bottom-16 right-[-20px] px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] shadow-2xl flex items-center gap-2 animate-float-medium z-20 transition-colors duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] text-slate-700 dark:text-slate-200 font-bold transition-colors duration-300">Draft email sent</span>
          </div>
        </div>

      </div>
    </section>
  );
}
