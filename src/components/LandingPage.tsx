"use client";

import { LandingHeader } from "./landing/LandingHeader";
import { LandingHero } from "./landing/LandingHero";
import { LandingFeatures } from "./landing/LandingFeatures";
import { LandingWorkflow } from "./landing/LandingWorkflow";
import { LandingIntegrations } from "./landing/LandingIntegrations";
import { LandingPricing } from "./landing/LandingPricing";
import { LandingFAQ } from "./landing/LandingFAQ";
import { LandingFooter } from "./landing/LandingFooter";
import type { SessionPayload } from "@/lib/types";

interface LandingPageProps {
  session: SessionPayload | null;
}

export default function LandingPage({ session }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030014] text-slate-900 dark:text-slate-100 font-sans relative overflow-x-hidden transition-colors duration-500">
      {/* Dynamic inline stylesheet for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(-0.5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 9s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 7s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-glow-pulse {
          animation: glow-pulse 10s ease-in-out infinite;
        }
        html {
          scroll-behavior: smooth;
        }
      `}} />

      {/* Decorative Glow Spots */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none animate-glow-pulse transition-colors duration-500"></div>
      <div className="absolute top-[15%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-glow-pulse transition-colors duration-500"></div>
      <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-fuchsia-600/5 rounded-full blur-[160px] pointer-events-none transition-colors duration-500"></div>

      <LandingHeader session={session} />
      <LandingHero session={session} />
      <LandingFeatures />
      <LandingWorkflow />
      <LandingIntegrations />
      <LandingPricing />
      <LandingFAQ />
      <LandingFooter />
    </div>
  );
}
