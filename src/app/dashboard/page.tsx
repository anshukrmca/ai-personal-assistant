"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import type { Briefing, FeedItem, Integration } from "@/lib/types";
import {
  RefreshCw,
  ChevronRight,
  Plug,
  Sparkles,
  Bell,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

// Import modular dashboard components
import ActivityGraph from "./components/ActivityGraph";
import TasksCard from "./components/TasksCard";
import QuickChat from "./components/QuickChat";
import ConnectedApps from "./components/ConnectedApps";
import CalendarSchedule from "./components/CalendarSchedule";
import RemindersCard from "./components/RemindersCard";
import WelcomeBanner from "./components/WelcomeBanner";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasIntegrations, setHasIntegrations] = useState<boolean | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<{ aiProvider: string; mockOtp: boolean; mockData: boolean } | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [integrationsRes, briefingRes, meRes, statusRes] = await Promise.all([
          api.getIntegrations(),
          api.getBriefing(),
          api.me(),
          api.getStatus(),
        ]);
        if (cancelled) return;
        setIntegrations(integrationsRes.integrations);
        setHasIntegrations(integrationsRes.integrations.some((i) => i.status === "connected"));
        setBriefing(briefingRes.briefing);
        setItems(briefingRes.items);
        setStatus(statusRes);
        if (meRes?.user) {
          setUser(meRes.user);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
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
      addToast("Successfully synced all live data", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to sync data", "error");
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }

  function toggleTask(id: string) {
    setCompletedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        addToast("Task completed!", "success");
      } else {
        addToast("Task reverted to in-progress", "info");
      }
      return next;
    });
  }

  const meetings = items.filter((i) => i.type === "meeting");
  const followUps = items.filter((i) => i.requiresFollowUp);

  const today = new Date();
  const todayFormatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Dynamic goals calculations
  const actionableTasks = items.filter(
    (item) => item.type !== "meeting" && (item.requiresFollowUp || item.priority === "high" || item.type === "reminder")
  );
  const totalTasks = actionableTasks.length;
  const completedTasksCount = actionableTasks.filter((item) => completedItems[item.id]).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const connectedAppsCount = integrations.filter((i) => i.status === "connected").length;
  const appConnectionRate = connectedAppsCount > 0 ? Math.round((connectedAppsCount / 4) * 100) : 25;

  const highPriorityItems = items.filter((item) => item.priority === "high");
  const highPriorityCompleted = highPriorityItems.filter((item) => completedItems[item.id]).length;
  const highPriorityRate = highPriorityItems.length > 0 ? Math.round((highPriorityCompleted / highPriorityItems.length) * 100) : 11;

  return (
    <AppShell>
      <div className="relative min-h-screen bg-bg bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] px-4 sm:px-6 md:px-10 py-8 flex flex-col transition-all duration-300">
        
        {loading && (
          <div className="space-y-6 flex-grow animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2">
              <div className="space-y-2.5">
                <div className="h-4 w-32 bg-surface-raised rounded-full" />
                <div className="h-9 w-64 bg-surface rounded-2xl border border-border/40" />
                <div className="h-4 w-48 bg-surface-raised rounded-full" />
              </div>
              <div className="flex gap-2 items-center self-start sm:self-center">
                <div className="h-10 w-24 bg-surface rounded-full border border-border/40" />
                <div className="h-10 w-28 bg-surface rounded-full border border-border/40" />
              </div>
            </div>
            
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-44 bg-surface border border-border/60 rounded-3xl" />
                <div className="h-80 bg-surface border border-border/60 rounded-3xl" />
                <div className="h-64 bg-surface border border-border/60 rounded-3xl" />
              </div>
              <div className="space-y-8">
                <div className="h-64 bg-surface border border-border/60 rounded-3xl" />
                <div className="h-64 bg-surface border border-border/60 rounded-3xl" />
                <div className="h-72 bg-surface border border-border/60 rounded-3xl" />
              </div>
            </div>
          </div>
        )}

        {!loading && hasIntegrations === false && (
          <div className="my-auto max-w-lg mx-auto py-12 px-4 w-full">
            <div className="rounded-3xl border border-border bg-surface/85 backdrop-blur-xl p-8 sm:p-10 text-center shadow-lg relative overflow-hidden rise-in dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
              <div className="w-16 h-16 rounded-2xl bg-accent-soft border border-accent/15 flex items-center justify-center mx-auto mb-6 shadow-md shadow-accent/5">
                <Plug className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-extrabold text-[20px] mb-2 tracking-tight text-text-primary">
                Connect your platforms to begin
              </h3>
              <p className="text-text-secondary text-[14.5px] max-w-sm mx-auto mb-8 leading-relaxed font-semibold">
                Your dynamic personal agent updates your briefing, schedule, and actions as soon as you connect your accounts.
              </p>
              <Link
                href="/integrations"
                className="inline-flex items-center gap-2 bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white font-bold text-[14.5px] rounded-xl px-7 py-3.5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-accent/15"
              >
                Connect your apps <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        )}

        {!loading && hasIntegrations && (
          <div className="space-y-8 flex-grow">
            
            {/* Header Row */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2 shrink-0">
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-text-primary">
                  Dashboard
                </h1>
              </div>

              {/* Quick Action Pills */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  id="ask-ai-btn"
                  href="/chat"
                  className="inline-flex items-center gap-2 bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white font-bold text-[13.5px] rounded-full px-5 py-2.5 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all shadow-md shadow-accent/15"
                >
                  <Sparkles className="w-4 h-4" /> Ask AI
                </Link>
                <Link
                  id="connect-apps-btn"
                  href="/integrations"
                  className="inline-flex items-center gap-2 bg-surface hover:bg-surface-raised text-text-primary font-bold text-[13.5px] rounded-full px-5 py-2.5 border border-border shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plug className="w-3.5 h-3.5" />
                  Connect Apps
                </Link>
                <Link
                  id="view-alerts-btn"
                  href="/alerts"
                  className="inline-flex items-center gap-2 bg-surface hover:bg-surface-raised text-text-primary font-bold text-[13.5px] rounded-full px-5 py-2.5 border border-border shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Alerts
                </Link>
              </div>
            </div>

            {/* Welcome Banner Card */}
            <WelcomeBanner
              userName={user?.name || "Anshu"}
              summary={briefing?.summary || ""}
              mockData={status?.mockData ?? false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column (spans 2 on desktop) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Activity Graph Card */}
                <ActivityGraph items={items} />

                {/* 2. My Tasks Card */}
                <TasksCard
                  items={actionableTasks}
                  completedItems={completedItems}
                  toggleTask={toggleTask}
                />

                {/* 3. My Goals Card */}
                <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm flex flex-col gap-5 hover:shadow-md transition-all duration-300">
                  <div className="pb-2 border-b border-border/40">
                    <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
                      My Goals
                    </h3>
                  </div>

                  <div className="flex flex-col gap-5">
                    {/* Goal 1 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[13.5px]">
                        <div>
                          <h4 className="font-bold text-text-primary">Briefing Task Completion</h4>
                          <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider font-display">Daily Action Checklist</p>
                        </div>
                        <span className="font-display font-extrabold text-accent">{taskCompletionRate}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-raised dark:bg-surface rounded-full overflow-hidden border border-border/20">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-[#9061f9] rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${taskCompletionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Goal 2 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[13.5px]">
                        <div>
                          <h4 className="font-bold text-text-primary">Platform Connectivity Strength</h4>
                          <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider font-display">Connected Core Integrations</p>
                        </div>
                        <span className="font-display font-extrabold text-info">{appConnectionRate}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-raised dark:bg-surface rounded-full overflow-hidden border border-border/20">
                        <div
                          className="h-full bg-gradient-to-r from-info to-[#60a5fa] rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${appConnectionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Goal 3 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[13.5px]">
                        <div>
                          <h4 className="font-bold text-text-primary">Priority Alerts Cleared</h4>
                          <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider font-display">High Priority Feed Items Resolved</p>
                        </div>
                        <span className="font-display font-extrabold text-success">{highPriorityRate}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-raised dark:bg-surface rounded-full overflow-hidden border border-border/20">
                        <div
                          className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${highPriorityRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (spans 1 on desktop) */}
              <div className="space-y-8">
                
                {/* 1. Quick AI Chat Widget */}
                <QuickChat />

                {/* 2. Connected Platforms Card */}
                <ConnectedApps integrations={integrations} />

                {/* 3. Calendar Schedule Card */}
                <CalendarSchedule meetings={meetings} />

                {/* 4. Reminders Card */}
                <RemindersCard
                  followUps={followUps}
                  toggleTask={toggleTask}
                />

              </div>

            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}
