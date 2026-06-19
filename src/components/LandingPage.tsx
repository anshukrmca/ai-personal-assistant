"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  Lock,
  Layers,
  ChevronDown,
  Menu,
  X,
  Bot,
  Mail,
  Calendar,
  MessageSquare,
  ShieldAlert,
  HelpCircle,
  MessageSquareText,
  Clock,
  Compass,
  FileText
} from "lucide-react";
import type { SessionPayload } from "@/lib/types";

const Slack = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.824 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.042zm10.134 3.782a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.78 10.132a2.528 2.528 0 0 1-2.522 2.52 2.528 2.528 0 0 1-2.52-2.52v-2.52h2.52a2.528 2.528 0 0 1 2.522 2.52zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" />
  </svg>
);


interface LandingPageProps {
  session: SessionPayload | null;
}

export default function LandingPage({ session }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const workflowSteps = [
    {
      title: "1. Monitor Notifications",
      description: "Anshu AI continuously scans your connected integrations (Gmail, WhatsApp, Slack, Calendar) to catch critical requests or scheduling needs.",
      icon: Clock,
      badge: "Listening",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      uiMockup: (
        <div className="bg-slate-900/90 border border-white/[0.08] rounded-xl p-4 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.05] pb-2">
            <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Incoming Streams
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">Live</span>
          </div>
          <div className="space-y-2 text-[13px]">
            <div className="p-2.5 bg-slate-950/60 rounded-lg border border-white/[0.05] flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md bg-red-500/15 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <div className="font-bold text-white text-[12px]">Sarah Jenkins (Google Calendar)</div>
                <div className="text-slate-400 text-[11px] truncate">Can we reschedule the sync to 3:00 PM today?</div>
              </div>
            </div>
            <div className="p-2.5 bg-slate-950/60 rounded-lg border border-white/[0.05] flex items-start gap-2.5 opacity-50">
              <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center shrink-0">
                <Slack className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-white text-[12px]">David Miller</div>
                <div className="text-slate-400 text-[11px] truncate">Did you review the proposal slides yet?</div>
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
      color: "border-violet-500/30 text-violet-400 bg-violet-500/10",
      uiMockup: (
        <div className="bg-slate-900/90 border border-white/[0.08] rounded-xl p-4 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.05] pb-2">
            <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              AI Cognitive Thought
            </span>
            <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full font-mono">Thinking...</span>
          </div>
          <div className="space-y-2 text-[12.5px] font-mono text-slate-300">
            <p className="text-violet-300">&gt; Parsing email from Sarah Jenkins...</p>
            <p className="text-slate-400">&gt; Request: Reschedule sync to 3:00 PM today.</p>
            <p className="text-slate-400">&gt; Querying local calendar availability...</p>
            <p className="text-emerald-400">&gt; Slot 3:00 PM - 3:30 PM is FREE.</p>
            <p className="text-violet-300">&gt; Action drafted: Calendar Reschedule & Email Confirm.</p>
          </div>
        </div>
      )
    },
    {
      title: "3. Interactive Execution Card",
      description: "The action cards appear in your workspace dashboard. With a single click, you approve, customize, or reject them. Nothing sends without your word.",
      icon: Zap,
      badge: "Approval",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
      uiMockup: (
        <div className="bg-slate-900/90 border border-white/[0.08] rounded-xl p-4 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 border-b border-white/[0.05] pb-1.5">
            <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Pending Action Card
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono">Needs Approval</span>
          </div>
          <div className="bg-slate-950/80 border border-amber-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-violet-400" /> Reschedule Sync
              </span>
              <span className="text-[9px] bg-violet-500/15 text-violet-300 px-1.5 py-0.5 rounded-md">3:00 PM Today</span>
            </div>
            <p className="text-[11.5px] text-slate-400 mb-3 leading-relaxed">
              Updates "Project Sync" in calendar and drafts confirmation reply to Sarah Jenkins.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-md shadow-violet-600/20">
                Execute Action
              </button>
              <button className="px-2.5 py-1.5 rounded-md border border-white/[0.08] hover:bg-white/[0.05] text-slate-400 hover:text-white text-[11px] transition-colors cursor-pointer">
                Edit
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const faqs = [
    {
      q: "How does Anshu AI connect to my Gmail and Calendar?",
      a: "We integrate securely using OAuth 2.0. The assistant only reads email notifications and calendar slots required to answer your commands. We prioritize your privacy and never sell or train public models on your private data."
    },
    {
      q: "Does it execute tasks automatically on its own?",
      a: "By default, Anshu AI operates in a 'Human-in-the-loop' safety mode. High-priority actions, such as sending emails or deleting events, generate dynamic execution cards in your dashboard, waiting for your approval. You can toggle fully autonomous modes for trusted senders."
    },
    {
      q: "What messaging integrations are supported?",
      a: "Currently, we offer pre-built integrations for Gmail, Google Calendar, WhatsApp, and Slack. Outlook, Discord, Telegram, and LinkedIn integration are launching soon."
    },
    {
      q: "Can I use my own custom phone number?",
      a: "Yes, you can configure WhatsApp delivery channels to forward briefings and execute assistant commands directly using standard chat commands."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 font-sans relative overflow-x-hidden">
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
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none animate-glow-pulse"></div>
      <div className="absolute top-[15%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-glow-pulse"></div>
      <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-fuchsia-600/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled 
          ? "border-b border-white/[0.08] bg-[#030014]/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.3)]" 
          : "border-b border-white/[0.02] bg-[#030014]/40 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-lg shadow-violet-600/30">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-extrabold text-[20px] tracking-tight text-white">
              Anshu<span className="text-violet-400">.ai</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Nav CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14px] shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2.5 text-slate-300 hover:text-white font-bold text-[14.5px] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14.5px] shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.05] bg-[#030014]/95 backdrop-blur-2xl py-6 px-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-4 text-[15.5px] font-semibold text-slate-300 pl-2">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Features</a>
              <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">How It Works</a>
              <a href="#integrations" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Integrations</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">FAQ</a>
            </div>
            <div className="pt-4 border-t border-white/[0.05] flex flex-col gap-3">
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14.5px] cursor-pointer"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-3 text-slate-300 hover:text-white font-bold text-[14.5px] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14.5px] cursor-pointer"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[12.5px] font-bold w-fit animate-float-fast">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Version 2.0 Autopilot Engine Live</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-tight text-white">
              Anshu AI Personal Assistant,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
                Tailored for You
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-slate-400 text-[15.5px] sm:text-lg leading-relaxed max-w-xl">
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
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white font-semibold text-[16px] transition-all cursor-pointer"
              >
                See How It Works
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.05] mt-4">
              <div>
                <p className="font-display font-extrabold text-2xl text-white">100%</p>
                <p className="text-[11.5px] text-slate-400 font-bold uppercase tracking-wider">Human Safe Approval</p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl text-white">&lt; 3s</p>
                <p className="text-[11.5px] text-slate-400 font-bold uppercase tracking-wider">Response Speed</p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl text-white">8+</p>
                <p className="text-[11.5px] text-slate-400 font-bold uppercase tracking-wider">Core Integrations</p>
              </div>
            </div>
          </div>

          {/* Right Visual Column (Glow Mockup) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Glow Core */}
            <div className="absolute w-72 h-72 bg-gradient-to-tr from-violet-600 to-[#9061f9] rounded-full blur-[80px] opacity-25 pointer-events-none"></div>

            {/* Central Mock Interactive Device Container */}
            <div className="w-full max-w-[370px] bg-slate-950/80 border border-white/[0.06] rounded-[2.5rem] p-3 shadow-2xl relative z-10 backdrop-blur-2xl ring-1 ring-white/10">
              
              {/* Internal Screen Layout */}
              <div className="bg-[#0b081e] rounded-[2rem] p-4 min-h-[440px] flex flex-col justify-between overflow-hidden relative border border-white/[0.05]">
                
                {/* Simulated Screen Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.05] mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                    </div>
                    <span className="font-bold text-[12px] text-slate-200">Anshu Assistant</span>
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
                    <div className="bg-slate-900/90 border border-white/[0.08] text-slate-300 rounded-[1.2rem] rounded-tl-none p-3 text-[11.5px] leading-relaxed shadow-lg">
                      <p className="font-bold text-violet-400 mb-1">AI Reasoning:</p>
                      Found reschedule request from Sarah. Recommended time slot 3 PM is open. Drafted calendar invite update and email response.
                    </div>
                  </div>

                  {/* Assistant Actions Multi-Card Wrapper */}
                  <div className="pl-8 space-y-2.5 animate-float-medium">
                    {/* Action 1 */}
                    <div className="bg-slate-900/90 border border-violet-500/30 rounded-xl p-3 shadow-lg hover:border-violet-500/50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-violet-400" />
                          Update Sync Schedule
                        </span>
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">Action 1</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Move "Sarah Jenkins Sync" to 3:00 PM today.
                      </p>
                    </div>

                    {/* Action 2 */}
                    <div className="bg-slate-900/90 border border-violet-500/30 rounded-xl p-3 shadow-lg hover:border-violet-500/50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-red-400" />
                          Draft Gmail Confirmation
                        </span>
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">Action 2</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        To: sarah.j@company.com - Subject: Sync Rescheduled
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulated Screen Footer */}
                <div className="mt-3 pt-3 border-t border-white/[0.05] flex gap-2">
                  <button className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-115 text-white font-extrabold text-[11px] rounded-xl transition-all cursor-pointer shadow-md shadow-violet-600/35 flex items-center justify-center gap-1">
                    Execute All <ArrowRight className="w-3 h-3" />
                  </button>
                  <button className="px-3.5 py-2 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl text-[11px] font-bold cursor-pointer hover:bg-white/[0.02]">
                    Refuse
                  </button>
                </div>

              </div>
            </div>

            {/* Floating Pills decorations */}
            <div className="absolute top-10 left-[-40px] px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-2xl flex items-center gap-2 animate-float-slow z-20">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-[11px] text-slate-200 font-bold">Reschedule Sync</span>
            </div>
            <div className="absolute bottom-16 right-[-20px] px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-2xl flex items-center gap-2 animate-float-medium z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[11px] text-slate-200 font-bold">Draft email sent</span>
            </div>
          </div>

        </div>
      </section>

      {/* Key Advantages / Bento Grid Section */}
      <section id="features" className="py-20 md:py-28 border-t border-white/[0.05] bg-slate-950/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[12px] font-bold w-fit mx-auto">
            <Zap className="w-3.5 h-3.5" /> Core Capabilities
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
            Autopilot Execution. Safe Control.
          </h2>
          <p className="text-slate-400 text-[15px] sm:text-[16px]">
            Designed to bridge the gap between simple AI chat screens and fully secure workflow automation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Autopilot (Double Col on Large Screens) */}
          <div className="md:col-span-2 group bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-violet-500/25 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-violet-600/15"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                <Zap className="w-5.5 h-5.5 text-violet-400" />
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
                Autopilot Actions
              </h3>
              <p className="text-slate-400 text-[14.5px] max-w-md leading-relaxed">
                Connect your platforms and allow the AI to proactively generate draft updates, schedule calls, compose Slack memos, and resolve requests in real time.
              </p>
            </div>
            <div className="mt-8 border-t border-white/[0.05] pt-4 flex gap-4 text-[12.5px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-violet-400" /> Multitasking</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-violet-400" /> Auto-Grouping</span>
            </div>
          </div>

          {/* Card 2: Safe Execution (1 Col) */}
          <div className="group bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-violet-500/25 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-indigo-600/15"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Lock className="w-5.5 h-5.5 text-indigo-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                100% Control
              </h3>
              <p className="text-slate-400 text-[14.5px] leading-relaxed">
                Anshu AI will never execute external API triggers or send real emails without your explicit approval, keeping your reputation secure.
              </p>
            </div>
            <div className="mt-8 border-t border-white/[0.05] pt-4 text-[12.5px] font-mono text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Human-in-the-Loop Safeguard
            </div>
          </div>

          {/* Card 3: Context Aware (1 Col) */}
          <div className="group bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-violet-500/25 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-fuchsia-600/15"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-6">
                <Bot className="w-5.5 h-5.5 text-fuchsia-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Deep Memory
              </h3>
              <p className="text-slate-400 text-[14.5px] leading-relaxed">
                By cross-referencing inbox alerts and your daily schedules, the assistant builds local context maps to answer requests in exact context.
              </p>
            </div>
            <div className="mt-8 border-t border-white/[0.05] pt-4 text-[12.5px] font-mono text-slate-500 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-fuchsia-400" />
              Smart Context Retrieval
            </div>
          </div>

          {/* Card 4: Multi-Action (Double Col) */}
          <div className="md:col-span-2 group bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-violet-500/25 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-violet-600/15"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                <Layers className="w-5.5 h-5.5 text-violet-400" />
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
                Multi-Action Commands
              </h3>
              <p className="text-slate-400 text-[14.5px] max-w-md leading-relaxed">
                Execute complex compound requests in one message. Tell Anshu AI: "Prepare my daily briefing, schedule sync with engineering, and draft the email review," and watch it bundle the actions together instantly.
              </p>
            </div>
            <div className="mt-8 border-t border-white/[0.05] pt-4 flex gap-4 text-[12.5px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-violet-400" /> Concurrent processing</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-violet-400" /> Linked variables</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section id="workflow" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[12px] font-bold w-fit mx-auto animate-float-fast">
            <Compass className="w-3.5 h-3.5" /> Visual Pipeline
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
            How Your AI Assistant Comes to Life
          </h2>
          <p className="text-slate-400 text-[15px] sm:text-[16px]">
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
                      ? "bg-white/[0.03] border-violet-500/40 shadow-xl shadow-violet-600/5 scale-[1.02]"
                      : "bg-transparent border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.01]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isActive ? "bg-violet-500/10 border-violet-500/30 text-violet-400" : "bg-white/[0.03] border-white/[0.05] text-slate-500"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-display font-bold text-[15.5px] ${isActive ? "text-white font-extrabold" : "text-slate-300"}`}>
                        {step.title}
                      </h3>
                      {isActive && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${step.color}`}>
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-[13px] leading-relaxed ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                      {isActive ? step.description : step.description.substring(0, 80) + "..."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Steps Right UI Mockup display */}
          <div className="lg:col-span-7 flex justify-center items-center relative">
            <div className="absolute w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="w-full max-w-[480px] bg-slate-950/40 border border-white/[0.06] rounded-[2rem] p-5 shadow-2xl relative z-10 backdrop-blur-2xl transition-all duration-500">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40"></span>
                <span className="text-[11px] text-slate-500 font-mono ml-2">anshu-engine-logs.sh</span>
              </div>
              <div className="transition-all duration-300">
                {workflowSteps[activeWorkflowStep].uiMockup}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Seamless Integrations Web */}
      <section id="integrations" className="py-20 md:py-28 border-t border-white/[0.05] bg-slate-950/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[12px] font-bold w-fit">
              <Layers className="w-3.5 h-3.5" /> Platform Integrations
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
              Connects With Your Entire Tech Stack
            </h2>
            <p className="text-slate-400 text-[15.5px] leading-relaxed">
              No complex setup. Connect your workspace channels directly. Anshu AI works with the platforms you already rely on every day.
            </p>

            <div className="space-y-3 mt-2 text-[14.5px]">
              <div className="flex items-center gap-3">
                <div className="w-5.5 h-5.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                <span className="text-slate-300">OAuth 2.0 secure connections</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5.5 h-5.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                <span className="text-slate-300">Bi-directional notification sync</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5.5 h-5.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                <span className="text-slate-300">Custom Webhook support for developers</span>
              </div>
            </div>
          </div>

          {/* Visual Platform Circles Web */}
          <div className="lg:col-span-7 flex justify-center items-center relative py-8">
            <div className="absolute w-80 h-80 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            {/* Center Node */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-lg shadow-violet-600/40 relative z-20 border border-white/20 animate-float-fast">
              <Sparkles className="w-9 h-9 text-white" />
            </div>

            {/* Orbit Items */}
            {/* Gmail */}
            <div className="absolute top-2 w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-xl animate-float-slow z-10 hover:bg-red-500/20 transition-colors" style={{ left: "20%" }}>
              <Mail className="w-6.5 h-6.5 text-red-400" />
            </div>
            {/* Calendar */}
            <div className="absolute top-8 w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-xl animate-float-medium z-10 hover:bg-blue-500/20 transition-colors" style={{ right: "18%" }}>
              <Calendar className="w-6.5 h-6.5 text-blue-400" />
            </div>
            {/* Slack */}
            <div className="absolute bottom-6 w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shadow-xl animate-float-slow z-10 hover:bg-pink-500/20 transition-colors" style={{ left: "25%" }}>
              <Slack className="w-6.5 h-6.5 text-pink-400" />
            </div>
            {/* WhatsApp */}
            <div className="absolute bottom-10 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-xl animate-float-medium z-10 hover:bg-emerald-500/20 transition-colors" style={{ right: "22%" }}>
              <MessageSquareText className="w-6.5 h-6.5 text-emerald-400" />
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="pricing" className="py-20 md:py-28 border-t border-white/[0.05] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[12px] font-bold w-fit mx-auto">
            <Zap className="w-3.5 h-3.5" /> Pricing Tiers
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
            Transparent Pricing. Cancel Anytime.
          </h2>
          <p className="text-slate-400 text-[15px] sm:text-[16px]">
            Choose a plan that fits your execution workflow size.
          </p>

          {/* Month/Year toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-[13.5px] font-bold ${!isYearly ? "text-white" : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6.5 rounded-full bg-slate-800 p-0.5 relative transition-colors duration-200 focus:outline-none cursor-pointer"
            >
              <div className={`w-5.5 h-5.5 rounded-full bg-violet-500 shadow transition-transform duration-200 ${isYearly ? "translate-x-5.5" : "translate-x-0"}`}></div>
            </button>
            <span className={`text-[13.5px] font-bold flex items-center gap-1.5 ${isYearly ? "text-white" : "text-slate-400"}`}>
              Yearly
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono font-bold uppercase">20% Off</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Plan 1: Free */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-white/[0.12] transition-all flex flex-col justify-between">
            <div>
              <h3 className="font-display font-extrabold text-[18px] text-slate-300">Basic Tier</h3>
              <p className="text-slate-500 text-[12.5px] mt-1 font-medium">For testing out the assistant workflow</p>
              
              <div className="my-8">
                <span className="font-display font-black text-4xl text-white">$0</span>
                <span className="text-[13px] text-slate-500 font-medium"> / forever</span>
              </div>

              <div className="h-px bg-white/[0.05] mb-8"></div>

              <ul className="space-y-4 text-[13.5px] text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>100 AI commands / month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Standard execution widgets</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Multi-action commands</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Slack & WhatsApp integrations</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login"
              className="w-full text-center py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-[14px] rounded-xl transition-all cursor-pointer border border-white/[0.05] mt-8"
            >
              Get Started Free
            </Link>
          </div>

          {/* Plan 2: Pro (Recommended) */}
          <div className="bg-gradient-to-b from-violet-950/40 to-slate-950/80 border border-violet-500/30 rounded-3xl p-8 hover:border-violet-500/50 shadow-2xl shadow-violet-600/5 flex flex-col justify-between relative transform lg:-translate-y-2">
            {/* Recommended Tag */}
            <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-violet-600/30">
              Most Popular
            </div>

            <div>
              <h3 className="font-display font-extrabold text-[18px] text-white">Pro Plan</h3>
              <p className="text-violet-300 text-[12.5px] mt-1 font-medium">Complete autopilot workflow</p>
              
              <div className="my-8">
                <span className="font-display font-black text-4xl text-white">
                  ${isYearly ? "12" : "15"}
                </span>
                <span className="text-[13px] text-slate-400 font-medium"> / month</span>
              </div>

              <div className="h-px bg-white/[0.05] mb-8"></div>

              <ul className="space-y-4 text-[13.5px] text-slate-200">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Unlimited AI commands</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Multi-action bundle execution</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Slack & WhatsApp integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
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
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-white/[0.12] transition-all flex flex-col justify-between">
            <div>
              <h3 className="font-display font-extrabold text-[18px] text-slate-300">Business Team</h3>
              <p className="text-slate-500 text-[12.5px] mt-1 font-medium">For scaling team automations securely</p>
              
              <div className="my-8">
                <span className="font-display font-black text-4xl text-white">
                  ${isYearly ? "39" : "49"}
                </span>
                <span className="text-[13px] text-slate-500 font-medium"> / month</span>
              </div>

              <div className="h-px bg-white/[0.05] mb-8"></div>

              <ul className="space-y-4 text-[13.5px] text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Everything in Pro Plan</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Multi-seat team workspace</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Dedicated custom webhook setup</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>SLA uptime & dedicated support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login"
              className="w-full text-center py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-[14px] rounded-xl transition-all cursor-pointer border border-white/[0.05] mt-8"
            >
              Contact Sales
            </Link>
          </div>

        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="py-20 md:py-28 border-t border-white/[0.05] max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[12px] font-bold w-fit mx-auto">
            <HelpCircle className="w-3.5 h-3.5" /> Common Questions
          </div>
          <h2 className="font-display font-black text-3xl text-white leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-[15px]">
            Everything you need to know about setting up and safety of your assistant.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden hover:border-white/[0.08] transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center text-white font-bold text-[15px] sm:text-[16px] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-400' : ''}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 border-t border-white/[0.03]' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 py-5 text-slate-400 text-[13.5px] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-slate-950/40 py-12 text-[13.5px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-extrabold text-[17px] text-white">
              Anshu<span className="text-violet-400">.ai</span>
            </span>
          </div>

          <div className="flex gap-8 font-semibold text-[13.5px]">
            <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-slate-300 transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-300 transition-colors">FAQ</a>
          </div>

          <div className="text-[12.5px] font-medium text-slate-600">
            © {new Date().getFullYear()} Anshu.ai. All rights reserved. Created for Anshu Personal Assistant.
          </div>
        </div>
      </footer>
    </div>
  );
}
