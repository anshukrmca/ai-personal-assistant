"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import type { FeedItem } from "@/lib/types";
import { WhatsAppBriefingFeed } from "@/components/briefing/WhatsAppBriefingFeed";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WhatsAppBriefingPage() {
  const router = useRouter();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBriefing().then((r) => {
      setItems(r.items.filter(i => i.type === "message" && i.source === "whatsapp"));
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
          <h2 className="text-2xl font-bold mb-6 text-[#25D366] flex items-center gap-2">
             WhatsApp Briefing
          </h2>
          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-raised shrink-0" />
                      <div className="space-y-1.5">
                        <div className="w-24 h-4 bg-surface-raised rounded" />
                        <div className="w-16 h-3.5 bg-surface-raised rounded" />
                      </div>
                    </div>
                    <div className="w-16 h-3.5 bg-surface-raised rounded-full" />
                  </div>
                  <div className="border-t border-border-soft pt-3">
                    <div className="flex items-start gap-3 pl-2">
                      <div className="flex-1 space-y-1.5">
                        <div className="w-3/4 h-3.5 bg-surface-raised rounded" />
                        <div className="w-1/2 h-3.5 bg-surface-raised rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <WhatsAppBriefingFeed items={items} onReply={() => {}} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
