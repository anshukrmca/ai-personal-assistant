"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Zap, 
  CloudLightning, 
  Layers, 
  Calendar, 
  Mail, 
  Send 
} from "lucide-react";
import type { SessionPayload } from "@/lib/types";

interface LandingHeroProps {
  session: SessionPayload | null;
}

// Google SVG Logo
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity duration-300 fill-current" aria-hidden="true">
    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.724 5.724 0 0 1 8.24 12.87a5.724 5.724 0 0 1 5.751-5.73c1.553 0 2.962.59 4.043 1.56l3.14-3.14C19.263 3.75 16.793 2.5 13.991 2.5 8.24 2.5 3.5 7.24 3.5 12.99s4.74 10.49 10.491 10.49c6.45 0 10.37-4.49 10.37-10.49 0-.61-.06-1.22-.17-1.705H12.24Z" />
  </svg>
);

// Microsoft SVG Logo
const MicrosoftLogo = () => (
  <svg viewBox="0 0 23 23" className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity duration-300 fill-current" aria-hidden="true">
    <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
  </svg>
);

// Slack SVG Logo
const SlackLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity duration-300 fill-current" aria-hidden="true">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.824 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.042zm10.134 3.782a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.78 10.132a2.528 2.528 0 0 1-2.522 2.52 2.528 2.528 0 0 1-2.52-2.52v-2.52h2.52a2.528 2.528 0 0 1 2.522 2.52zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" />
  </svg>
);

// Notion SVG Logo
const NotionLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity duration-300 fill-current" aria-hidden="true">
    <path d="M4.223 2.143a2.21 2.21 0 0 0-1.745.86L.93 5.484a2.227 2.227 0 0 0-.43 1.341v12.918c0 1.258.98 2.114 2.19 2.114h16.62c1.233 0 2.19-.88 2.19-2.114V4.227A2.218 2.218 0 0 0 19.31 2.14h-15.09zM4.09 4.31h14.887a.544.544 0 0 1 .533.533V18.17a.544.544 0 0 1-.533.533H4.09a.544.544 0 0 1-.533-.533V4.843a.544.544 0 0 1 .533-.533zm2.5 2.5a.69.69 0 0 0-.69.69v8.62a.69.69 0 0 0 1.38 0v-8.62a.69.69 0 0 0-.69-.69zm5.38 0a.69.69 0 0 0-.69.69v4.208L8.608 7.03A.69.69 0 0 0 8 7.5v6.208a.69.69 0 0 0 1.38 0V9.5l2.672 4.288a.69.69 0 0 0 .608.332.69.69 0 0 0 .69-.69v-6.21a.69.69 0 0 0-.69-.69zm5.38 0a.69.69 0 0 0-.69.69v4.208l-2.672-4.208A.69.69 0 0 0 13.38 7.5v6.208a.69.69 0 0 0 1.38 0V9.5l2.672 4.288a.69.69 0 0 0 .608.332.69.69 0 0 0 .69-.69v-6.21a.69.69 0 0 0-.69-.69z" />
  </svg>
);

// Calendly SVG Logo
const CalendlyLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity duration-300 fill-current" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-2h2v2zm1.07-5.75l-.9.92c-.72.73-1.17 1.33-1.17 2.33h-2c0-1.66.67-2.66 1.67-3.66l1.22-1.22c.37-.37.61-.88.61-1.45 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
  </svg>
);

export function LandingHero({ session }: LandingHeroProps) {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Text Column */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-950/20 text-violet-400 text-[12.5px] font-semibold w-fit transition-colors duration-300">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
            <span>Version 2.0 • Autopilot Engine Live</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[62px] leading-[1.05] tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            Anshu AI Personal Assistant,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
              Tailored for You
            </span>
          </h1>

          {/* Subhead */}
          <p className="text-slate-600 dark:text-slate-400 text-[16px] sm:text-[18px] leading-relaxed max-w-xl transition-colors duration-300 font-medium font-sans">
            Connect your apps. Let AI handle the noise. Anshu AI coordinates your inbox, calendars, tasks, and tools — so you can focus on what matters most.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href={session ? "/dashboard" : "/login"}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-[#7e3af2] hover:brightness-110 text-white font-extrabold text-[15.5px] shadow-xl shadow-violet-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              Launch Your Assistant
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#workflow"
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-[15.5px] transition-all cursor-pointer shadow-sm dark:shadow-none"
            >
              <Play className="w-4.5 h-4.5 fill-current text-slate-500 dark:text-slate-400 mr-0.5" />
              See How It Works
            </a>
          </div>

          {/* Micro Stats Row (Mockup Horizontal Layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-200 dark:border-white/[0.06] mt-4 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="font-display font-black text-[18px] text-slate-900 dark:text-white leading-none">100%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Human Safe Approval</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="font-display font-black text-[18px] text-slate-900 dark:text-white leading-none">&lt; 3s</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Response Speed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                <CloudLightning className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="font-display font-black text-[18px] text-slate-900 dark:text-white leading-none">99.9%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Uptime</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="font-display font-black text-[18px] text-slate-900 dark:text-white leading-none">8+</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Core Integrations</p>
              </div>
            </div>
          </div>

          {/* Trusted by Logos Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 pt-4 text-[13.5px]">
            <span className="text-slate-500 font-bold dark:text-slate-400 whitespace-nowrap">Trusted by professionals at:</span>
            <div className="flex items-center gap-6 flex-wrap text-slate-500 dark:text-slate-400">
              <GoogleLogo />
              <MicrosoftLogo />
              <SlackLogo />
              <NotionLogo />
              <CalendlyLogo />
            </div>
          </div>
        </div>

        {/* Right Visual Column (Mock Chat System Widget) */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          
          {/* Glowing background */}
          <div className="absolute w-[360px] h-[360px] bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/10 rounded-full blur-[80px] pointer-events-none"></div>

          {/* Central Mock Chat App */}
          <div className="w-full max-w-[400px] bg-slate-950/80 border border-white/[0.08] rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(120,50,250,0.15)] relative z-10 backdrop-blur-2xl transition-all duration-300">
            
            {/* Widget Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center text-white font-extrabold text-[12px] shadow-lg shadow-violet-600/30">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-white leading-none">Anshu Assistant</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 min-h-[380px] flex flex-col justify-end">
              
              {/* User Bubble */}
              <div className="flex flex-col items-end pl-12">
                <div className="bg-gradient-to-r from-violet-600 to-[#7e3af2] text-white rounded-[1.2rem] rounded-tr-none px-4 py-3 text-[12.5px] font-medium leading-relaxed shadow-md">
                  Schedule my day and send a reminder for team standup
                </div>
                <span className="text-[9.5px] text-slate-500 mt-1 mr-1">10:30 AM</span>
              </div>

              {/* AI Assistant Bubble */}
              <div className="flex items-start gap-3 pr-8">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/[0.08] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex flex-col">
                  <div className="bg-slate-900 border border-white/[0.06] text-slate-200 rounded-[1.2rem] rounded-tl-none p-3.5 text-[12.5px] leading-relaxed shadow-md">
                    Done! Here&apos;s your updated schedule and I&apos;ve set a reminder for the team standup at 10:30 AM.
                  </div>
                  <span className="text-[9.5px] text-slate-500 mt-1 ml-1">10:31 AM</span>
                </div>
              </div>

              {/* Nested Action Cards */}
              <div className="pl-11 space-y-3">
                {/* Card 1 */}
                <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-3 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-4.5 h-4.5 text-violet-400" />
                    </div>
                    <div>
                      <h5 className="text-[12.5px] font-bold text-white leading-none">Daily Schedule</h5>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">2 meetings - 5 tasks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500">7:00 AM</span>
                    <button className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-[10px] rounded-lg hover:bg-emerald-500/20 transition-colors">
                      View
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-3 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-4.5 h-4.5 text-violet-400" />
                    </div>
                    <div>
                      <h5 className="text-[12.5px] font-bold text-white leading-none">Team Standup Reminder</h5>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">10:30 AM, Today</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500">10:30 AM</span>
                </div>

                {/* Card 3 */}
                <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-3 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Mail className="w-4.5 h-4.5 text-violet-400" />
                    </div>
                    <div>
                      <h5 className="text-[12.5px] font-bold text-white leading-none">Draft Email</h5>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Q2 Report to Stakeholders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500">11:15 AM</span>
                    <button className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-400 font-extrabold text-[10px] rounded-lg hover:bg-violet-500/20 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Input message bar */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Message Anshu AI..." 
                disabled
                className="flex-1 bg-slate-900/40 border border-white/[0.06] rounded-xl px-4 py-2 text-[12px] text-slate-300 placeholder-slate-500 focus:outline-none"
              />
              <button className="w-8.5 h-8.5 rounded-full bg-violet-600 flex items-center justify-center text-white shrink-0 hover:brightness-110 transition-all cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Floating Integration Icons Surrounding */}
          {/* Gmail */}
          <div className="absolute top-12 left-[-24px] w-11 h-11 rounded-2xl bg-[#0c0827] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center animate-float-slow z-20 hover:scale-110 transition-transform">
            <Mail className="w-5.5 h-5.5 text-red-400" />
          </div>

          {/* Slack */}
          <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-[#0c0827] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center animate-float-medium z-20 hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-current text-teal-400">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.824 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.042zm10.134 3.782a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.78 10.132a2.528 2.528 0 0 1-2.522 2.52 2.528 2.528 0 0 1-2.52-2.52v-2.52h2.52a2.528 2.528 0 0 1 2.522 2.52zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" />
            </svg>
          </div>

          {/* Notion */}
          <div className="absolute bottom-6 left-[-16px] w-11 h-11 rounded-2xl bg-[#0c0827] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center animate-float-fast z-20 hover:scale-110 transition-transform">
            <span className="text-[13.5px] font-black text-white font-mono">N</span>
          </div>

          {/* Outlook */}
          <div className="absolute right-[-10px] top-12 w-11 h-11 rounded-2xl bg-[#0c0827] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center animate-float-slow z-20 hover:scale-110 transition-transform">
            <span className="text-[13.5px] font-black text-blue-400 font-mono">O</span>
          </div>

        </div>

      </div>
    </section>
  );
}
