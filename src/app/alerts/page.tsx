"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { FeedItem } from "@/lib/types";
import {
  Bell,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Sparkles,
  Send,
  X,
  Shield,
  Activity,
  Calendar,
  Mail,
  Gift,
  Plus
} from "lucide-react";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

// Interactive floating 3D bell component
const FloatingBellSVG = () => (
  <div className="relative animate-float-medium w-28 h-28 flex items-center justify-center shrink-0 select-none">
    <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_15px_30px_rgba(139,92,246,0.35)]">
      <defs>
        <radialGradient id="bellGrad" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="45%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#4c1d95" />
        </radialGradient>
        <linearGradient id="clapperGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      
      {/* Bell Clapper */}
      <circle cx="50" cy="78" r="9" fill="url(#clapperGrad)" />
      
      {/* Bell Body */}
      <path d="M50 15C34 15 30 33 30 50C30 63 22 67 22 70H78C78 67 70 63 70 50C70 33 66 15 50 15Z" fill="url(#bellGrad)" />
      
      {/* Bell Rim Highlight */}
      <path d="M22 70C22 68 70 68 78 70" stroke="#d8b4fe" strokeWidth="1.5" fill="none" opacity="0.3" />
      
      {/* Bell Top Loop */}
      <path d="M44 16V10C44 7.8 45.8 6 48 6H52C54.2 6 56 7.8 56 10V16" stroke="url(#bellGrad)" strokeWidth="3" fill="none" />
    </svg>
    
    {/* Red badge "6" */}
    <div className="absolute top-1 right-2 w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-red-500 to-[#ff4d4d] border-2 border-[#030014] flex items-center justify-center text-white font-extrabold text-[12px] shadow-lg animate-pulse">
      6
    </div>
  </div>
);

export default function AlertsPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<FeedItem | null>(null);
  const [composerInput, setComposerInput] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);
  const [composerSuccess, setComposerSuccess] = useState(false);
  const [suggestedRules, setSuggestedRules] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.getBriefing(),
      api.getSuggestedRules().catch(() => ({ rules: [] }))
    ]).then(([briefingRes, rulesRes]) => {
      setItems(briefingRes.items);
      
      if (rulesRes.rules && rulesRes.rules.length > 0) {
        setSuggestedRules(rulesRes.rules);
      } else {
        setSuggestedRules([
          { id: "rule-1", title: "Upcoming Holiday Reminder", desc: "Notify me 2 days before any listed Indian holiday to plan ahead.", active: false, icon: Calendar, iconBg: "bg-violet-500/10 text-violet-400" },
          { id: "rule-2", title: "Holiday Email Pause", desc: "Automatically mute non-urgent notifications on days marked as holidays.", active: false, icon: Mail, iconBg: "bg-blue-500/10 text-blue-400" },
          { id: "rule-3", title: "Cultural Event Spotlight", desc: "Send a brief summary of the holiday's significance on the morning of the event.", active: false, icon: Gift, iconBg: "bg-amber-500/10 text-amber-400" },
        ]);
      }
      setLoading(false);
    });
  }, []);

  let alerts = items.filter((i) => i.priority === "high");
  
  // Fallback so the page isn't completely empty for testing
  if (alerts.length === 0 && items.length > 0) {
    alerts = items.slice(0, 4);
  }
  
  const triggeredToday = alerts.length + 2;

  function handleUseRule(id: string) {
    setSuggestedRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  }

  async function handleGenerateDraft() {
    if (!selectedAlert) return;
    setGeneratingDraft(true);
    try {
      const res = await api.generateAlertDraft(selectedAlert);
      setAiDraft(res.draft);
    } catch (err) {
      console.error("Failed to generate draft:", err);
      setAiDraft("Failed to connect to AI. Please try again.");
    } finally {
      setGeneratingDraft(false);
    }
  }

  async function handleSendComposer(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAlert || !aiDraft.trim()) return;
    setSendingResponse(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSendingResponse(false);
    setComposerSuccess(true);
    setTimeout(() => {
      setComposerSuccess(false);
      setAiDraft("");
      setComposerInput("");
      setSelectedAlert(null);
    }, 1500);
  }

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-8 flex flex-col min-h-screen relative overflow-hidden max-w-6xl mx-auto space-y-6">
        
        {/* Subtle background glow for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#7e3af2]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header - Full Width Glassmorphic Banner */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-violet-50/80 to-indigo-50/90 dark:from-[#140b2e]/60 dark:via-[#0c0827]/60 dark:to-slate-950/80 border border-slate-200 dark:border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7e3af2]/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex-1 max-w-2xl relative z-10 text-center md:text-left">
            <div className="inline-flex items-center justify-center px-3.5 py-1.5 mb-4 rounded-full bg-[#7e3af2]/10 text-violet-650 dark:text-violet-400 border border-[#7e3af2]/20 shadow-sm gap-1.5 text-[12px] font-bold">
              <Bell className="w-3.5 h-3.5" />
              <span>Notification Center</span>
            </div>
            <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight text-slate-900 dark:text-white mb-3">
              Actionable <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-650 dark:from-violet-400 dark:via-fuchsia-400 dark:to-indigo-400">Alerts</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-[14.5px] leading-relaxed font-sans max-w-xl">
              Manage instant notification rules, review active alerts, and use your AI agent to auto-draft urgent responses.
            </p>
          </div>

          {/* Floating Bell SVG Illustration */}
          <div className="hidden md:flex justify-center items-center shrink-0 z-10 mx-6">
            <FloatingBellSVG />
          </div>

          {/* Right Side Alert Status Widget */}
          <div className="shrink-0 w-full md:w-auto relative z-10">
            <div className="bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 shadow-lg min-w-[260px] relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7e3af2] to-fuchsia-500 rounded-2xl opacity-15 blur-sm pointer-events-none"></div>
              <div className="relative h-full text-center">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                  System Alert Level
                </h3>
                <div className="font-display font-black text-2xl text-slate-900 dark:text-white mb-0.5">
                  Elevated
                </div>
                <div className="text-[12.5px] font-bold text-red-500 dark:text-red-400">
                  {alerts.length} Action Required
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                      <Activity className="w-4 h-4 text-violet-550 dark:text-violet-400" />
                      {triggeredToday}
                    </div>
                    <div className="text-[9px] font-bold text-slate-550 uppercase tracking-wider mt-1">Triggered Today</div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-white/[0.08]"></div>
                  <div className="text-center">
                    <div className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      1
                    </div>
                    <div className="text-[9px] font-bold text-slate-550 uppercase tracking-wider mt-1">Resolved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Split Layout Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full relative z-10">
          
          {/* Left Column: Recent Alerts Timeline (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0b081e]/60 border border-slate-200 dark:border-white/[0.06] rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-5 relative">
            
            {/* Timeline track vertical line */}
            {!loading && alerts.length > 0 && (
              <div className="absolute left-[30px] sm:left-[32px] top-20 bottom-12 w-[1.5px] bg-slate-250 dark:bg-white/[0.06] pointer-events-none z-0" />
            )}

            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-[15.5px] text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-violet-550 dark:text-violet-400" />
                <span>Recent Alerts Timeline</span>
              </h3>
              <button className="text-[12px] font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors border border-violet-500/20 bg-violet-500/5 px-3 py-1.5 rounded-xl">
                View All Alerts &gt;
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-slate-200 dark:border-white/[0.05] bg-slate-100 dark:bg-slate-900/20 rounded-2xl p-4 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-12 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="w-3/4 h-3.5 bg-slate-200 dark:bg-slate-800 rounded mt-2.5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <p className="text-slate-500 text-[13.5px] py-16 text-center">No recent alerts triggered.</p>
            ) : (
              <div className="flex flex-col gap-4 relative z-10">
                {alerts.map((item, index) => {
                  const meta = PLATFORM_META[item.source as keyof typeof PLATFORM_META];
                  const Icon = meta?.icon;
                  // Alternate node colors for premium aesthetic
                  const isAlternative = index === 3;
                  const nodeGlowClass = isAlternative 
                    ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" 
                    : "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.7)]";

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAlert(item)}
                      className="relative flex items-start pl-8 sm:pl-10 cursor-pointer group"
                    >
                      {/* Timeline Dot Node */}
                      <div className={`absolute left-[10px] sm:left-[12px] top-[14px] w-2.5 h-2.5 rounded-full ${nodeGlowClass} z-10`} />

                      {/* Row Card */}
                      <div className="flex-1 border border-slate-150 dark:border-white/[0.05] bg-slate-50 dark:bg-[#0c0827]/40 hover:border-violet-500/30 rounded-2xl p-4.5 transition-all flex items-start gap-4 hover:-translate-y-0.5 shadow-sm group-hover:bg-slate-100/80 dark:group-hover:bg-[#0c0827]/60">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-900"
                        >
                          {Icon && <Icon className="w-5 h-5" style={{ color: meta?.color }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-violet-650 dark:text-white dark:group-hover:text-violet-300 transition-colors truncate">{item.title}</h4>
                            <span className="text-[11px] text-slate-500 font-medium shrink-0">{timeAgo(item.receivedAt)}</span>
                          </div>
                          <p className="text-[12.5px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium leading-relaxed font-sans">
                            {item.snippet}
                          </p>
                          
                          {/* Tags Grid */}
                          <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                            <span className={`text-[9.5px] font-bold uppercase px-2 py-0.5 rounded border ${
                              item.source.toLowerCase() === 'gmail' 
                                ? 'bg-red-500/10 text-red-600 border-red-500/25 dark:text-red-400' 
                                : 'bg-[#7e3af2]/10 text-violet-650 border-[#7e3af2]/25 dark:text-violet-400'
                            }`}>
                              {item.source}
                            </span>
                            <span className="text-[9.5px] font-bold uppercase text-red-650 dark:text-red-400 bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded">
                              High Priority
                            </span>
                            <span className="text-[9.5px] font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded">
                              Triggered
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 self-center shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: AI Suggested Alerts (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0b081e]/60 border border-slate-200 dark:border-white/[0.06] rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-5 relative z-10">
            <h3 className="font-display font-bold text-[15.5px] text-slate-900 dark:text-white tracking-tight pb-3.5 border-b border-slate-200 dark:border-white/[0.06] flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-violet-550 dark:text-violet-400" />
              <span>AI Suggested Alerts</span>
            </h3>

            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border border-slate-200 dark:border-white/[0.05] bg-slate-100 dark:bg-slate-900/20 rounded-2xl p-5 flex flex-col gap-3">
                      <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded mt-1.5" />
                      <div className="w-5/6 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                suggestedRules.map((rule) => {
                  const RuleIcon = rule.icon || Calendar;
                  const ruleBg = rule.iconBg || "bg-violet-500/10 text-violet-450 dark:text-violet-400";
                  
                  return (
                    <div
                      key={rule.id}
                      className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-white/[0.05] rounded-2xl p-4.5 flex flex-col gap-4 shadow-sm hover:border-violet-500/25 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/[0.05] ${ruleBg}`}>
                          <RuleIcon className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[13.5px] font-bold text-slate-900 group-hover:text-violet-650 dark:text-white dark:group-hover:text-violet-300 transition-colors">{rule.title}</h4>
                          <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium font-sans mt-1.5">
                            {rule.desc}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUseRule(rule.id)}
                        className={`w-full py-2 rounded-xl text-[12px] font-extrabold cursor-pointer transition-all border ${
                          rule.active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:border-red-500/30 hover:text-red-500 hover:bg-red-500/10"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-300 dark:border-white/[0.08]"
                        }`}
                      >
                        {rule.active ? "Rule Active" : "Use Suggested Rule >"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Rules Exploration Button */}
            <button className="w-full py-2.5 rounded-xl border border-violet-500/25 bg-violet-600/5 hover:bg-violet-600/10 text-violet-600 dark:text-violet-400 font-extrabold text-[12.5px] transition-colors cursor-pointer text-center mt-2 flex items-center justify-center gap-1.5">
              <Plus className="w-4.5 h-4.5" /> Explore All Smart Rules
            </button>
          </div>

        </div>

        {/* Detailed Alert Modal & AI Reply Composer */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6 rise-in">
            <div className="bg-white dark:bg-[#0b081e] border border-slate-200 dark:border-white/[0.08] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
              <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-[#7e3af2]/5 to-transparent pointer-events-none"></div>

              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8.5 h-8.5 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-600 dark:text-violet-400 shrink-0">
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-[15px] text-slate-900 dark:text-white tracking-tight">
                      Alert Action Details
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    setAiDraft("");
                  }}
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 relative z-10 custom-scrollbar">
                {/* Section 1: Alert Title & Content */}
                <div className="border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9.5px] font-bold uppercase text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded">
                      High Priority
                    </span>
                    <span className="text-[9.5px] font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded">
                      Triggered
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-500 font-mono ml-auto">
                      From: {selectedAlert.from}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[14.5px] font-extrabold text-slate-900 dark:text-white">{selectedAlert.title}</h4>
                    <p className="text-[13px] text-slate-700 dark:text-slate-300 mt-2 font-medium leading-relaxed font-sans">
                      {selectedAlert.snippet}
                    </p>
                  </div>
                </div>

                {/* Section 2: AI Summary & Action Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-violet-550 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Context
                    </p>
                    <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium font-sans">
                      This alert was triggered because it was flagged as high priority from {selectedAlert.from}. The subject implies immediate attention is needed.
                    </p>
                  </div>

                  <div className="border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-violet-550 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Related Rule Suggestion
                    </p>
                    <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-1 font-sans">
                      Would you like to always receive high-priority alerts for messages from <strong>{selectedAlert.from}</strong>?
                    </p>
                    <button className="text-[11.5px] font-bold text-violet-650 dark:text-violet-400 self-start hover:underline">
                      + Create Custom Rule
                    </button>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-4 gap-3 shrink-0">
                  <button className="py-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[12.5px] hover:bg-emerald-500/20 active:scale-98 cursor-pointer transition-all">
                    Resolve
                  </button>
                  <button className="py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 font-extrabold text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-98 cursor-pointer transition-all">
                    Snooze
                  </button>
                  <button className="py-2.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[12.5px] hover:bg-blue-500/20 active:scale-98 cursor-pointer transition-all">
                    Create Task
                  </button>
                  <button className="py-2.5 rounded-xl border border-purple-500/25 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-[12.5px] hover:bg-purple-500/20 active:scale-98 cursor-pointer transition-all">
                    Follow-Up
                  </button>
                </div>

                {/* AI Reply Composer Section */}
                <div className="border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/20 flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/[0.06]">
                    <p className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-violet-550 dark:text-violet-400" />
                      AI Reply Composer
                    </p>
                    {!aiDraft && (
                      <button
                        onClick={handleGenerateDraft}
                        disabled={generatingDraft}
                        className="text-[12px] font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer flex items-center gap-1.5"
                      >
                        {generatingDraft ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> Auto Draft
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {!aiDraft ? (
                    <div className="flex flex-col gap-2.5">
                      <input
                        value={composerInput}
                        onChange={(e) => setComposerInput(e.target.value)}
                        placeholder="Reply guidance (optional, e.g. 'schedule meeting next week')"
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/70 dark:border-white/[0.08] dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-violet-500/50"
                      />
                      <button
                        onClick={handleGenerateDraft}
                        disabled={generatingDraft}
                        className="w-full bg-gradient-to-r from-violet-600 to-[#7e3af2] text-white py-2.5 rounded-xl text-[13.5px] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        {generatingDraft ? "Generating Draft..." : "Generate Reply Draft"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendComposer} className="flex flex-col gap-3">
                      <textarea
                        required
                        value={aiDraft}
                        onChange={(e) => setAiDraft(e.target.value)}
                        rows={4}
                        className="w-full bg-white border border-slate-200 text-slate-900 dark:bg-slate-950/70 dark:border-white/[0.08] dark:text-white rounded-xl p-3.5 text-[13px] leading-relaxed focus:outline-none focus:border-violet-500/50 resize-none font-medium custom-scrollbar"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setAiDraft("")}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 text-[12.5px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                        >
                          Discard
                        </button>
                        {composerSuccess ? (
                          <span className="px-5 py-2 bg-emerald-550/10 border border-emerald-500/25 rounded-xl text-emerald-600 dark:text-emerald-400 text-[12.5px] font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Sent
                          </span>
                        ) : (
                          <button
                            type="submit"
                            disabled={sendingResponse}
                            className="px-5 py-2 bg-gradient-to-r from-violet-600 to-[#7e3af2] text-white rounded-xl text-[12.5px] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            {sendingResponse ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" /> Send Reply
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
