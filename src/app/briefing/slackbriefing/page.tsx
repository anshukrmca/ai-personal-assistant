"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import type { FeedItem } from "@/lib/types";
import { SlackBriefingFeed } from "@/components/briefing/SlackBriefingFeed";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SlackBriefingPage() {
  const router = useRouter();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBriefing().then((r) => {
      setItems(r.items.filter(i => i.source === "slack"));
      setLoading(false);
    });
  }, []);

  return (
    <AppShell>
      <div className="px-6 py-8">
        <button 
          onClick={() => router.push('/briefing')}
          className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-surface-raised rounded-full transition-colors font-medium text-[13px] mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Briefing Hub
        </button>
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm min-h-[400px]">
          <h2 className="text-2xl font-bold mb-6 text-[#4A154B] flex items-center gap-2">
             Slack Briefing
          </h2>
          {loading ? (
            <div className="flex flex-col gap-6 animate-pulse p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-3 p-4 border border-border bg-surface rounded-2xl">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-surface-raised rounded animate-pulse" />
                    <div className="w-24 h-4 bg-surface-raised rounded animate-pulse" />
                  </div>
                  {/* Messages list */}
                  <div className="flex flex-col gap-3 pl-6 border-l-2 border-border-soft">
                    {[1, 2].map((j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-surface-raised rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-3.5 bg-surface-raised rounded" />
                            <div className="w-12 h-3 bg-surface-raised rounded" />
                          </div>
                          <div className="w-5/6 h-3 bg-surface-raised rounded" />
                          <div className="w-2/3 h-3 bg-surface-raised rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <SlackBriefingFeed items={items} onReply={() => {}} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
