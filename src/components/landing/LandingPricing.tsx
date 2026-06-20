"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Check, X } from "lucide-react";

export function LandingPricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 md:py-28 border-t border-slate-200 dark:border-white/[0.05] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-50 dark:bg-violet-500/5 text-violet-600 dark:text-violet-400 text-[12px] font-bold w-fit mx-auto transition-colors duration-300">
          <Zap className="w-3.5 h-3.5" /> Pricing Tiers
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight transition-colors duration-300">
          Transparent Pricing. Cancel Anytime.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-[15px] sm:text-[16px] transition-colors duration-300">
          Choose a plan that fits your execution workflow size.
        </p>

        {/* Month/Year toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-[13.5px] font-bold transition-colors duration-300 ${!isYearly ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-12 h-6.5 rounded-full bg-slate-200 dark:bg-slate-800 p-0.5 relative transition-colors duration-200 focus:outline-none cursor-pointer"
          >
            <div className={`w-5.5 h-5.5 rounded-full bg-violet-500 shadow transition-transform duration-200 ${isYearly ? "translate-x-5.5" : "translate-x-0"}`}></div>
          </button>
          <span className={`text-[13.5px] font-bold flex items-center gap-1.5 transition-colors duration-300 ${isYearly ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
            Yearly
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono font-bold uppercase transition-colors duration-300">20% Off</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Plan 1: Free */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-3xl p-8 hover:border-slate-300 dark:hover:border-white/[0.12] transition-all flex flex-col justify-between shadow-sm dark:shadow-none">
          <div>
            <h3 className="font-display font-extrabold text-[18px] text-slate-800 dark:text-slate-300 transition-colors duration-300">Basic Tier</h3>
            <p className="text-slate-500 dark:text-slate-500 text-[12.5px] mt-1 font-medium transition-colors duration-300">For testing out the assistant workflow</p>
            
            <div className="my-8">
              <span className="font-display font-black text-4xl text-slate-900 dark:text-white transition-colors duration-300">$0</span>
              <span className="text-[13px] text-slate-500 font-medium"> / forever</span>
            </div>

            <div className="h-px bg-slate-200 dark:bg-white/[0.05] mb-8 transition-colors duration-300"></div>

            <ul className="space-y-4 text-[13.5px] text-slate-700 dark:text-slate-300 transition-colors duration-300">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>100 AI commands / month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Standard execution widgets</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                <X className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                <span>Multi-action commands</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                <X className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                <span>Slack & WhatsApp integrations</span>
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            className="w-full text-center py-3 bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-bold text-[14px] rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-white/[0.05] mt-8 transition-colors duration-300"
          >
            Get Started Free
          </Link>
        </div>

        {/* Plan 2: Pro (Recommended) */}
        <div className="bg-white dark:bg-gradient-to-b dark:from-violet-950/40 dark:to-slate-950/80 border border-violet-200 dark:border-violet-500/30 rounded-3xl p-8 hover:border-violet-300 dark:hover:border-violet-500/50 shadow-xl dark:shadow-2xl shadow-violet-600/10 dark:shadow-violet-600/5 flex flex-col justify-between relative transform lg:-translate-y-2 transition-all duration-300">
          {/* Recommended Tag */}
          <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-violet-600/30">
            Most Popular
          </div>

          <div>
            <h3 className="font-display font-extrabold text-[18px] text-slate-900 dark:text-white transition-colors duration-300">Pro Plan</h3>
            <p className="text-violet-600 dark:text-violet-300 text-[12.5px] mt-1 font-medium transition-colors duration-300">Complete autopilot workflow</p>
            
            <div className="my-8">
              <span className="font-display font-black text-4xl text-slate-900 dark:text-white transition-colors duration-300">
                ${isYearly ? "12" : "15"}
              </span>
              <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300"> / month</span>
            </div>

            <div className="h-px bg-slate-200 dark:bg-white/[0.05] mb-8 transition-colors duration-300"></div>

            <ul className="space-y-4 text-[13.5px] text-slate-700 dark:text-slate-200 transition-colors duration-300">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Unlimited AI commands</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Multi-action bundle execution</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Slack & WhatsApp integrations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Priority task execution queue</span>
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            className="w-full text-center py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-[14.5px] rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/25 mt-8 hover:scale-[1.01]"
          >
            Start 7-Day Free Trial
          </Link>
        </div>

        {/* Plan 3: Business */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-3xl p-8 hover:border-slate-300 dark:hover:border-white/[0.12] transition-all flex flex-col justify-between shadow-sm dark:shadow-none">
          <div>
            <h3 className="font-display font-extrabold text-[18px] text-slate-800 dark:text-slate-300 transition-colors duration-300">Business Team</h3>
            <p className="text-slate-500 text-[12.5px] mt-1 font-medium transition-colors duration-300">For scaling team automations securely</p>
            
            <div className="my-8">
              <span className="font-display font-black text-4xl text-slate-900 dark:text-white transition-colors duration-300">
                ${isYearly ? "39" : "49"}
              </span>
              <span className="text-[13px] text-slate-500 font-medium"> / month</span>
            </div>

            <div className="h-px bg-slate-200 dark:bg-white/[0.05] mb-8 transition-colors duration-300"></div>

            <ul className="space-y-4 text-[13.5px] text-slate-700 dark:text-slate-300 transition-colors duration-300">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Everything in Pro Plan</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Multi-seat team workspace</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Dedicated custom webhook setup</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>SLA uptime & dedicated support</span>
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            className="w-full text-center py-3 bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-bold text-[14px] rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-white/[0.05] mt-8 transition-colors duration-300"
          >
            Contact Sales
          </Link>
        </div>

      </div>
    </section>
  );
}
