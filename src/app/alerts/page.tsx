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
          { id: "rule-1", title: "Domain Expiry Alert", desc: "Receive an immediate alert for critical domain renewal notices.", active: false },
          { id: "rule-2", title: "New Appointment Request", desc: "Get alerted for new incoming appointment schedule requests.", active: false },
          { id: "rule-3", title: "Important Event Date Inquiry", desc: "Scan and highlight important event date requests from team chat.", active: false },
        ]);
      }
      setLoading(false);
    });
  }, []);

  let alerts = items.filter((i) => i.priority === "high");
  
  // Fallback so the page isn't completely empty for testing
  if (alerts.length === 0 && items.length > 0) {
    alerts = items.slice(0, 3);
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
      <div className="px-6 md:px-10 py-12 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle background glow for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-danger/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header - Full Width Hero Banner */}
        <div className="mb-10 relative z-10 mt-2 flex flex-col lg:flex-row items-center justify-between gap-10 bg-surface/50 border border-border/60 rounded-[2rem] p-8 md:p-10 shadow-sm backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-danger/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex-1 max-w-2xl relative z-10">
            <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-danger/10 text-danger border border-danger/20 shadow-sm">
              <span className="font-bold tracking-wide uppercase text-[11px] flex items-center gap-1.5"><Bell className="w-3.5 h-3.5"/> Notification Center</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-text-primary mb-5 leading-tight">
              Actionable <span className="text-transparent bg-clip-text bg-gradient-to-r from-danger to-[#f97316]">Alerts</span>
            </h1>
            <p className="text-text-secondary text-[16px] md:text-lg leading-relaxed mb-0">
              Manage instant notification rules, review active alerts, and use your AI agent to auto-draft urgent responses.
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto relative z-10">
            {/* Right side utilization - Alert Status Widget */}
            <div className="bg-surface border border-border/60 rounded-[1.5rem] p-1 shadow-sm min-w-[280px] relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-danger to-[#f97316] rounded-[1.5rem] opacity-20 blur-sm pointer-events-none group-hover:opacity-30 transition-opacity"></div>
               <div className="relative bg-surface rounded-[1.3rem] p-6 h-full text-center">
                 <h3 className="text-[12px] font-bold text-text-tertiary uppercase tracking-wider mb-3">System Alert Level</h3>
                 <div className="font-display font-bold text-3xl text-text-primary mb-1">
                   {alerts.length > 0 ? "Elevated" : "Normal"}
                 </div>
                 <div className={`text-[14px] font-bold ${alerts.length > 0 ? 'text-danger' : 'text-success'}`}>
                   {alerts.length > 0 ? `${alerts.length} Action Required` : "All caught up"}
                 </div>
                 
                 <div className="mt-5 pt-5 border-t border-border/50 flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold text-text-primary">{triggeredToday}</div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider mt-0.5">Triggered Today</div>
                    </div>
                    <div className="w-px h-8 bg-border/60"></div>
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold text-text-primary">1</div>
                      <div className="text-[10px] font-bold text-success uppercase tracking-wider mt-0.5">Resolved</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Split Timeline View */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start w-full">
          {/* Left Column: Recent Alerts Timeline */}
          <div className="flex-1 w-full bg-surface border border-border rounded-3xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-display font-bold text-[15px] text-text-primary tracking-tight pb-3 border-b border-border-soft flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-accent" />
              <span>Recent Alerts Timeline</span>
            </h3>

            {loading ? (
              <div className="flex flex-col gap-3.5 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-border-soft rounded-2xl p-4 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-surface-raised shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <div className="w-1/3 h-4 bg-surface-raised rounded" />
                        <div className="w-12 h-3.5 bg-surface-raised rounded" />
                      </div>
                      <div className="w-3/4 h-3.5 bg-surface-raised rounded mt-2.5" />
                      <div className="flex items-center gap-1.5 mt-3">
                        <div className="w-14 h-4 bg-surface-raised rounded-full" />
                        <div className="w-20 h-4 bg-surface-raised rounded-full" />
                        <div className="w-16 h-4 bg-surface-raised rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <p className="text-text-tertiary text-[13.5px] py-16 text-center">No recent alerts triggered.</p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {alerts.map((item) => {
                  const meta = PLATFORM_META[item.source as keyof typeof PLATFORM_META];
                  const Icon = meta?.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAlert(item)}
                      className="border border-border-soft hover:border-accent/40 rounded-2xl p-4 cursor-pointer transition-all flex items-start gap-4 hover:-translate-y-0.5"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-border-soft"
                        style={{ background: `${meta?.color ?? "#888"}0d` }}
                      >
                        {Icon && <Icon className="w-4.5 h-4.5" style={{ color: meta?.color }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-[13.5px] font-bold text-text-primary truncate">{item.title}</h4>
                          <span className="text-[11px] text-text-tertiary font-medium shrink-0">{timeAgo(item.receivedAt)}</span>
                        </div>
                        <p className="text-[12.5px] text-text-secondary mt-1 font-medium line-clamp-1 leading-relaxed">
                          {item.snippet}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="text-[10px] font-bold uppercase text-[#7c3aed] bg-[#7c3aed1a] border border-[#7c3aed30] px-2 py-0.5 rounded-full">
                            {item.source}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-danger bg-danger/5 border border-danger/15 px-2 py-0.5 rounded-full">
                            High Priority
                          </span>
                          <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                            Triggered
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-tertiary self-center shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: AI Suggested Alerts */}
          <div className="w-full lg:w-80 shrink-0 bg-surface/50 border border-border/60 rounded-[2rem] p-6 shadow-sm backdrop-blur-md flex flex-col gap-5 relative z-10">
            <h3 className="font-display font-bold text-[16px] text-text-primary tracking-tight pb-4 border-b border-border/50 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 border border-accent/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>AI Suggested Alerts</span>
            </h3>

            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="border border-border-soft bg-surface rounded-2xl p-5 flex flex-col gap-3">
                      <div className="w-2/3 h-4 bg-surface-raised rounded" />
                      <div className="w-full h-3 bg-surface-raised rounded mt-1.5" />
                      <div className="w-5/6 h-3 bg-surface-raised rounded" />
                      <div className="w-full h-9 bg-surface-raised rounded-xl mt-3" />
                    </div>
                  ))}
                </div>
              ) : (
                suggestedRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-surface border border-border/60 rounded-2xl p-5 flex flex-col gap-3.5 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-accent/30 transition-all group"
                  >
                    <div>
                      <h4 className="text-[14px] font-bold text-text-primary group-hover:text-accent transition-colors">{rule.title}</h4>
                      <p className="text-[12px] text-text-secondary leading-relaxed font-medium mt-1.5">
                        {rule.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleUseRule(rule.id)}
                      className={`w-full py-2.5 rounded-xl text-[12px] font-bold cursor-pointer transition-all ${
                        rule.active
                          ? "bg-success/10 text-success border border-success/20 hover:border-danger hover:text-danger hover:bg-danger/5"
                          : "bg-surface-raised hover:bg-surface-raised/80 text-text-primary border border-border/60"
                      }`}
                    >
                      {rule.active ? "Rule Active" : "Use Suggested Rule"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detailed Alert Modal & AI Reply Composer */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 rise-in">
            <div className="bg-surface border border-border rounded-3xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-border-soft flex items-center justify-between bg-surface-raised/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 text-accent shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[14.5px] text-text-primary tracking-tight">
                      Alert Action details
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    setAiDraft("");
                  }}
                  className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                {/* Section 1: Alert Title & Content */}
                <div className="border border-border-soft rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-danger bg-danger/5 border border-danger/15 px-2 py-0.5 rounded-full">
                      High Priority
                    </span>
                    <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                      Triggered
                    </span>
                    <span className="text-[11px] text-text-tertiary font-mono ml-auto">
                      From: {selectedAlert.from}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-text-primary">{selectedAlert.title}</h4>
                    <p className="text-[13px] text-text-secondary mt-1.5 font-medium leading-relaxed">
                      {selectedAlert.snippet}
                    </p>
                  </div>
                </div>

                {/* Section 2: AI Summary & Action Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-border-soft rounded-2xl p-4 bg-surface-raised/10 flex flex-col gap-2">
                    <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">AI Context</p>
                    <p className="text-[12.5px] text-text-secondary leading-relaxed font-medium">
                      This alert was triggered because it was flagged as high priority from {selectedAlert.from}. The subject implies immediate attention is needed.
                    </p>
                  </div>

                  <div className="border border-border-soft rounded-2xl p-4 bg-surface-raised/10 flex flex-col gap-2">
                    <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Related Rule Suggestion</p>
                    <p className="text-[12.5px] text-text-secondary leading-relaxed font-medium mb-1">
                      Would you like to always receive high-priority alerts for messages from <strong>{selectedAlert.from}</strong>?
                    </p>
                    <button className="text-[11.5px] font-bold text-accent self-start hover:underline">
                      + Create Custom Rule
                    </button>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-4 gap-3 shrink-0">
                  <button className="py-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 font-bold text-[12.5px] hover:bg-emerald-500/20 active:scale-98 cursor-pointer transition-all">
                    Resolve
                  </button>
                  <button className="py-2.5 rounded-xl border border-border text-text-secondary font-bold text-[12.5px] hover:bg-surface-raised active:scale-98 cursor-pointer transition-all">
                    Snooze
                  </button>
                  <button className="py-2.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-400 font-bold text-[12.5px] hover:bg-blue-500/20 active:scale-98 cursor-pointer transition-all">
                    Create Task
                  </button>
                  <button className="py-2.5 rounded-xl border border-purple-500/25 bg-purple-500/10 text-purple-400 font-bold text-[12.5px] hover:bg-purple-500/20 active:scale-98 cursor-pointer transition-all">
                    Follow-Up
                  </button>
                </div>

                {/* AI Reply Composer Section */}
                <div className="border border-border-soft rounded-2xl p-5 bg-surface-raised/20 flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-border-soft">
                    <p className="text-[12.5px] font-bold text-text-primary tracking-tight">AI Reply Composer</p>
                    {!aiDraft && (
                      <button
                        onClick={handleGenerateDraft}
                        disabled={generatingDraft}
                        className="text-[11.5px] font-bold text-accent hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {generatingDraft ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" /> Generating…
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" /> Auto Draft
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
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/30"
                      />
                      <button
                        onClick={handleGenerateDraft}
                        disabled={generatingDraft}
                        className="w-full bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white py-2.5 rounded-xl text-[13.5px] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
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
                        className="w-full bg-surface border border-border rounded-xl p-3.5 text-[13px] leading-relaxed text-text-primary focus:outline-none focus:border-accent/30 resize-none font-medium"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setAiDraft("")}
                          className="px-4 py-2 rounded-xl border border-border text-text-secondary text-[12.5px] font-semibold hover:bg-surface-raised cursor-pointer"
                        >
                          Discard
                        </button>
                        {composerSuccess ? (
                          <span className="px-5 py-2 bg-success/5 border border-success/15 rounded-xl text-success text-[12.5px] font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Sent
                          </span>
                        ) : (
                          <button
                            type="submit"
                            disabled={sendingResponse}
                            className="px-5 py-2 bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white rounded-xl text-[12.5px] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-sm"
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
