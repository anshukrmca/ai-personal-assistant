"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { Briefing, FeedItem, Integration, IntegrationPlatform } from "@/lib/types";
import {
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Check,
  ToggleLeft,
  ToggleRight,
  Plug,
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

export default function DashboardPage() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasIntegrations, setHasIntegrations] = useState<boolean | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [integrationsRes, briefingRes] = await Promise.all([
        api.getIntegrations(),
        api.getBriefing(),
      ]);
      if (cancelled) return;
      setIntegrations(integrationsRes.integrations);
      setHasIntegrations(integrationsRes.integrations.some((i) => i.status === "connected"));
      setBriefing(briefingRes.briefing);
      setItems(briefingRes.items);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await api.refreshBriefing();
      setBriefing(res.briefing);
      setItems(res.items);
    } finally {
      setRefreshing(false);
    }
  }

  function toggleTask(id: string) {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const meetings = items.filter((i) => i.type === "meeting");
  const alerts = items.filter((i) => i.priority === "high");
  const followUps = items.filter((i) => i.requiresFollowUp);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <div className="px-6 md:px-10 py-8 flex flex-col min-h-screen">
        {/* Header without Switch */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 shrink-0">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-text-primary">
              Dashboard
            </h1>
          </div>
        </div>

        {loading && (
          <div className="space-y-6 flex-1 justify-center my-auto">
            <div className="h-44 rounded-3xl bg-surface animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 rounded-3xl bg-surface animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-surface animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {!loading && hasIntegrations === false && (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-10 text-center my-auto max-w-lg mx-auto shadow-sm rise-in">
            <div className="w-14 h-14 rounded-2xl bg-accent-soft border border-accent/15 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Plug className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-[18px] mb-2 tracking-tight text-text-primary">
              Connect an app to get started
            </h3>
            <p className="text-text-secondary text-[14px] max-w-sm mx-auto mb-8 leading-relaxed font-medium">
              Your dashboard builds itself once Anshu Intelligent Agent can see your inbox, calendar, or chats. Connect at least one app to begin.
            </p>
            <Link
              href="/integrations"
              className="inline-flex items-center gap-2 bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white font-bold text-[14.5px] rounded-xl px-6 py-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-accent/10"
            >
              Connect your apps <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        )}

        {!loading && hasIntegrations && (
          <div className="space-y-6">
            {/* Welcome Banner Card */}
            <div className="rounded-3xl border border-border bg-surface p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden rise-in">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
              
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border text-success bg-success/5 border-success/20"
                  >
                    Live Sync Active
                  </span>
                  <span className="text-[12px] text-text-tertiary font-medium">
                    {today}
                  </span>
                </div>
                
                <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary tracking-tight">
                  Welcome back, Anshu
                </h2>
                
                <p className="text-[14.5px] leading-relaxed text-text-secondary font-medium">
                  {briefing?.summary || "No briefings generated. Click refresh to query your connected accounts."}
                </p>
              </div>

              <div className="shrink-0 self-end md:self-center">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2.5 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white px-5 py-3 text-[13.5px] font-bold hover:scale-[1.02] hover:shadow active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-md shadow-accent/10"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} strokeWidth={2.5} />
                  Refresh / Regenerate
                </button>
              </div>
            </div>

            {/* Row of Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Important alerts */}
              <div className="rounded-2xl border border-border bg-surface p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 rise-in">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <AlertCircle className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Important</p>
                    <p className="text-[16px] font-bold text-purple-700 mt-0.5">{alerts.length} high priority</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary" />
              </div>

              {/* Schedule */}
              <div className="rounded-2xl border border-border bg-surface p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 rise-in">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Calendar className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Schedule</p>
                    <p className="text-[16px] font-bold text-blue-700 mt-0.5">{meetings.length} events today</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary" />
              </div>

              {/* Follow ups */}
              <div className="rounded-2xl border border-border bg-surface p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 rise-in">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Follow-Ups</p>
                    <p className="text-[16px] font-bold text-emerald-700 mt-0.5">{followUps.length} due today</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary" />
              </div>
            </div>

            {/* Three-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: Today's Brief */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-border-soft">
                  <h3 className="font-display font-bold text-[15px] text-text-primary tracking-tight">
                    Today&apos;s Brief
                  </h3>
                  <Link href="/briefing" className="text-[11px] font-bold text-accent hover:underline">
                    View all
                  </Link>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  {items.slice(0, 4).map((item) => {
                    const meta = PLATFORM_META[item.source as keyof typeof PLATFORM_META];
                    const Icon = meta?.icon;
                    const isChecked = !!completedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleTask(item.id)}
                        className={`p-3 rounded-xl border border-border-soft flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isChecked ? "bg-surface-raised opacity-60" : "hover:bg-surface-raised"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: `${meta?.color ?? "#888"}12`,
                              border: `1px solid ${meta?.color ?? "#888"}20`
                            }}
                          >
                            {Icon && <Icon className="w-4.5 h-4.5" style={{ color: meta?.color }} />}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[13px] font-semibold text-text-primary truncate ${isChecked ? "line-through" : ""}`}>
                              {item.title}
                            </p>
                            <p className="text-[11px] text-text-tertiary truncate mt-0.5">{item.from}</p>
                          </div>
                        </div>
                        <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? "bg-accent border-accent text-white" : "border-border"
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                  {items.length === 0 && (
                    <p className="text-text-tertiary text-[13px] text-center my-auto">No items synced.</p>
                  )}
                </div>
              </div>

              {/* Column 2: Connected Apps */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-border-soft">
                  <h3 className="font-display font-bold text-[15px] text-text-primary tracking-tight">
                    Connected Apps
                  </h3>
                  <Link href="/integrations" className="text-[11px] font-bold text-accent hover:underline">
                    Manage
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3.5 my-auto">
                  {["gmail", "whatsapp", "slack", "google_calendar"].map((platformKey) => {
                    const platform = platformKey as IntegrationPlatform;
                    const meta = PLATFORM_META[platform];
                    const Icon = meta.icon;
                    const matched = integrations.find((i) => i.platform === platform);
                    const connected = matched ? matched.status === "connected" : false;

                    return (
                      <div
                        key={platformKey}
                        className="p-3.5 rounded-xl border border-border-soft bg-surface-raised/40 flex flex-col items-center text-center gap-2"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-border-soft"
                          style={{
                            background: `${meta.color}0a`,
                            borderColor: `${meta.color}15`,
                          }}
                        >
                          <Icon className="w-5.5 h-5.5" style={{ color: meta.color }} />
                        </div>
                        <div>
                          <p className="text-[12.5px] font-bold text-text-primary">{meta.label}</p>
                          <p className={`text-[10px] font-semibold mt-0.5 ${connected ? "text-success" : "text-text-tertiary"}`}>
                            {connected ? "Connected" : "Disconnected"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column 3: Priority Items */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-border-soft">
                  <h3 className="font-display font-bold text-[15px] text-text-primary tracking-tight">
                    Priority Items
                  </h3>
                  <Link href="/briefing" className="text-[11px] font-bold text-accent hover:underline">
                    View all
                  </Link>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  {alerts.slice(0, 3).map((item) => {
                    const meta = PLATFORM_META[item.source as keyof typeof PLATFORM_META];
                    const Icon = meta?.icon;
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-border-soft bg-surface-raised/30 hover:bg-surface-raised/70 transition-all flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 border border-border-soft"
                              style={{ background: `${meta?.color ?? "#888"}0d` }}
                            >
                              {Icon && <Icon className="w-3.5 h-3.5" style={{ color: meta?.color }} />}
                            </div>
                            <p className="text-[13px] font-bold text-text-primary truncate">{item.title}</p>
                          </div>
                          <span className="text-[10px] text-text-tertiary font-medium shrink-0">
                            {timeAgo(item.receivedAt)}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-text-secondary line-clamp-1 leading-normal font-medium">
                          {item.snippet}
                        </p>
                      </div>
                    );
                  })}
                  {alerts.length === 0 && (
                    <p className="text-text-tertiary text-[13px] text-center my-auto">No priority items.</p>
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
