"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import type { Briefing, FeedItem, Integration } from "@/lib/types";
import {
  Plug,
  Sparkles,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { ALL_PLATFORMS } from "@/lib/platformMeta";

// Import modular dashboard components
import WelcomeBanner from "./components/WelcomeBanner";
import StatsCards from "./components/StatsCards";
import ActivityGraph from "./components/ActivityGraph";
import QuickChat from "./components/QuickChat";
import TasksCard from "./components/TasksCard";
import ConnectedApps from "./components/ConnectedApps";
import GoalsCard from "./components/GoalsCard";
import UpcomingSchedule from "./components/UpcomingSchedule";
import ProductivityInsights from "./components/ProductivityInsights";
import ActivityHeatmap from "./components/ActivityHeatmap";
import RecentActivity from "./components/RecentActivity";

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
  const alerts = items.filter((i) => i.priority === "high");

  // Dynamic goals calculations
  const actionableTasks = items.filter(
    (item) => item.type !== "meeting" && (item.requiresFollowUp || item.priority === "high" || item.type === "reminder")
  );
  const totalTasks = actionableTasks.length;
  const completedTasksCount = actionableTasks.filter((item) => completedItems[item.id]).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const connectedAppsCount = integrations.filter((i) => i.status === "connected").length;
  const appConnectionRate = connectedAppsCount > 0 ? Math.round((connectedAppsCount / ALL_PLATFORMS.length) * 100) : 0;

  const highPriorityItems = items.filter((item) => item.priority === "high");
  const highPriorityCompleted = highPriorityItems.filter((item) => completedItems[item.id]).length;
  const highPriorityRate = highPriorityItems.length > 0 ? Math.round((highPriorityCompleted / highPriorityItems.length) * 100) : 0;

  return (
    <AppShell>
      <div className="relative min-h-screen bg-bg bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] px-2 sm:px-4 md:px-6 py-8 flex flex-col gap-8 transition-all duration-300">
        
        {loading && (
          <div className="space-y-6 flex-grow animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2">
              <div className="space-y-2.5">
                <div className="h-4 w-32 bg-surface-raised rounded-full" />
                <div className="h-9 w-64 bg-surface rounded-2xl border border-border/40" />
              </div>
              <div className="flex gap-2 items-center self-start sm:self-center">
                <div className="h-10 w-44 bg-surface rounded-xl border border-border/40" />
                <div className="h-10 w-28 bg-surface rounded-xl border border-border/40" />
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
            
            {/* Header Row: Dashboard Title, Search Bar and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 shrink-0">
              <div className="flex items-center gap-6 flex-wrap md:flex-nowrap">
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-text-primary shrink-0">
                  Dashboard
                </h1>
                
                {/* Search Bar Input (Ctrl+K shortcut) */}
                <div className="relative flex items-center bg-surface-raised/40 dark:bg-surface border border-border hover:border-border-soft rounded-2xl px-3 py-2 text-[12px] font-semibold text-text-secondary focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/15 transition-all w-[240px] sm:w-[280px] shrink-0 dark:bg-surface-raised/5">
                  <Search className="w-4 h-4 text-text-tertiary mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="bg-transparent focus:outline-none placeholder:text-text-tertiary text-text-primary w-full pr-10"
                  />
                  <kbd className="absolute right-3 px-1.5 py-0.5 rounded bg-surface-raised border border-border text-[9px] font-extrabold text-text-tertiary select-none pointer-events-none dark:bg-surface dark:border-white/5 font-sans leading-none">
                    Ctrl K
                  </kbd>
                </div>
              </div>

              {/* Quick Action Pills */}
              <div className="flex items-center gap-3 self-stretch md:self-center justify-end">
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
                
                {/* Alert Notifications Bell with Red Badge */}
                <Link
                  id="alerts-bell-btn"
                  href="/alerts"
                  className="relative p-2.5 rounded-full border border-border bg-surface hover:bg-surface-raised cursor-pointer transition-all hover:scale-105"
                >
                  <Bell className="w-4.5 h-4.5 text-text-secondary" />
                  {alerts.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[9.5px] font-black rounded-full flex items-center justify-center animate-pulse">
                      {alerts.length > 9 ? "9+" : alerts.length}
                    </span>
                  )}
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

            {/* Summary Row Stats Cards */}
            <StatsCards items={items} completedItemsCount={completedTasksCount} />

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column (spans 2 on desktop) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Activity Overview Graph */}
                <ActivityGraph items={items} completionRate={taskCompletionRate} />

                {/* 2. My Tasks Checklists Card */}
                <TasksCard
                  items={actionableTasks}
                  completedItems={completedItems}
                  toggleTask={toggleTask}
                />

                {/* 3. My Goals Progress Card */}
                <GoalsCard
                  taskCompletionRate={taskCompletionRate}
                  appConnectionRate={appConnectionRate}
                  highPriorityRate={highPriorityRate}
                />

              </div>

              {/* Right Column (spans 1 on desktop) */}
              <div className="space-y-8">
                
                {/* 1. AI Assistant Insight Widget */}
                <QuickChat
                  highPriorityCount={alerts.length}
                  meetingsCount={meetings.length}
                />

                {/* 2. Connected Platforms Card */}
                <ConnectedApps integrations={integrations} />

                {/* 3. Upcoming Schedule Card */}
                <UpcomingSchedule meetings={meetings} />

              </div>

            </div>

            {/* Bottom Row Grid (3 columns on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2">
              
              {/* 1. Productivity Insights Donut Card */}
              <ProductivityInsights items={items} />

              {/* 2. Activity Heatmap Density Grid Card */}
              <ActivityHeatmap items={items} />

              {/* 3. Recent Activity Timeline Log Card */}
              <RecentActivity items={items} completedItems={completedItems} />

            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}
