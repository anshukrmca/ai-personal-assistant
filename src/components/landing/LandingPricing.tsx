"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Check } from "lucide-react";

export function LandingPricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-12 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-950/20 text-violet-400 text-[12px] font-bold w-fit mx-auto">
          <Zap className="w-3.5 h-3.5" /> Pricing Plans
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
          Transparent Pricing. Cancel Anytime.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-[15px] sm:text-[16.5px]">
          Choose a plan that fits your execution workflow size.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className={`text-[13.5px] font-bold transition-colors ${!isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-12 h-6.5 rounded-full bg-slate-200 dark:bg-slate-800 p-0.5 relative transition-colors duration-200 focus:outline-none cursor-pointer"
          >
            <div className={`w-5.5 h-5.5 rounded-full bg-violet-600 shadow transition-transform duration-200 ${isYearly ? "translate-x-5.5" : "translate-x-0"}`}></div>
          </button>
          <span className={`text-[13.5px] font-bold flex items-center gap-2 transition-colors ${isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
            Yearly
            <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        
        {/* Basic Tier */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.08] rounded-3xl p-8 hover:border-violet-500/20 transition-all flex flex-col justify-between shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <h3 className="font-display font-extrabold text-[18px] text-slate-900 dark:text-white">Basic Tier</h3>
            <p className="text-slate-500 dark:text-slate-400 text-[12.5px] mt-1 font-medium">For testing out the assistant workflow</p>
            
            <div className="my-8 flex items-baseline">
              <span className="font-display font-black text-5xl text-slate-900 dark:text-white">$0</span>
              <span className="text-[13.5px] text-slate-500 dark:text-slate-400 font-bold ml-1">/month</span>
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/[0.06] mb-8"></div>

            <ul className="space-y-4 text-[13.5px] text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>100 AI commands / month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Standard execution widgets</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Multi-platform connections</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Slack & WhatsApp integrations</span>
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            className="w-full text-center py-3.5 bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-extrabold text-[14.5px] rounded-2xl transition-all border border-slate-200 dark:border-white/[0.05] mt-10 hover:scale-[1.01]"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-white dark:bg-slate-950/80 border-2 border-violet-600 rounded-3xl p-8 hover:border-violet-500 transition-all flex flex-col justify-between relative shadow-[0_20px_40px_rgba(120,50,250,0.1)] md:-translate-y-4">
          
          {/* Most Popular Badge */}
          <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-[#7e3af2] rounded-full text-[10.5px] font-black uppercase tracking-wider text-white shadow-lg">
            Most Popular
          </div>

          <div>
            <h3 className="font-display font-extrabold text-[18px] text-slate-900 dark:text-white">Pro Plan</h3>
            <p className="text-violet-500 text-[12.5px] mt-1 font-bold">Complete autopilot workflow</p>
            
            <div className="my-8 flex items-baseline">
              <span className="font-display font-black text-5xl text-slate-900 dark:text-white">
                ${isYearly ? "12" : "15"}
              </span>
              <span className="text-[13.5px] text-slate-500 dark:text-slate-400 font-bold ml-1">/month</span>
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/[0.06] mb-8"></div>

            <ul className="space-y-4 text-[13.5px] text-slate-600 dark:text-slate-200">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Unlimited AI commands</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Multi-action bundle execution</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Slack & WhatsApp integrations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Priority task execution queue</span>
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            className="w-full text-center py-3.5 bg-gradient-to-r from-violet-600 to-[#7e3af2] hover:brightness-110 text-white font-extrabold text-[14.5px] rounded-2xl transition-all shadow-lg shadow-violet-600/25 mt-10 hover:scale-[1.01]"
          >
            Start 7-Day Free Trial
          </Link>
        </div>

        {/* Business Team */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.08] rounded-3xl p-8 hover:border-violet-500/20 transition-all flex flex-col justify-between shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <h3 className="font-display font-extrabold text-[18px] text-slate-900 dark:text-white">Business Team</h3>
            <p className="text-slate-500 dark:text-slate-400 text-[12.5px] mt-1 font-medium">For scaling team automations securely</p>
            
            <div className="my-8 flex items-baseline">
              <span className="font-display font-black text-5xl text-slate-900 dark:text-white">
                ${isYearly ? "39" : "49"}
              </span>
              <span className="text-[13.5px] text-slate-500 dark:text-slate-400 font-bold ml-1">/month</span>
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/[0.06] mb-8"></div>

            <ul className="space-y-4 text-[13.5px] text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Everything in Pro Plan</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Multi-seat team workspace</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Dedicated custom webhook setup</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-violet-500 shrink-0" />
                <span>SLA, uptime & dedicated support</span>
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            className="w-full text-center py-3.5 bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-extrabold text-[14.5px] rounded-2xl transition-all border border-slate-200 dark:border-white/[0.05] mt-10 hover:scale-[1.01]"
          >
            Contact Sales
          </Link>
        </div>

      </div>
    </section>
  );
}
