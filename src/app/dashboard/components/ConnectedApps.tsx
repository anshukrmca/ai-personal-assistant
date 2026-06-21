"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { Integration, IntegrationPlatform } from "@/lib/types";

interface ConnectedAppsProps {
  integrations: Integration[];
}

export default function ConnectedApps({ integrations }: ConnectedAppsProps) {
  const platforms: IntegrationPlatform[] = ["gmail", "whatsapp", "slack", "google_calendar"];

  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight">
          Connected Platforms
        </h3>
        <Link
          href="/integrations"
          className="text-[11.5px] font-extrabold text-accent hover:underline flex items-center gap-0.5 font-display"
        >
          Manage <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {platforms.map((platformKey) => {
          const meta = PLATFORM_META[platformKey];
          const Icon = meta.icon;
          const matched = integrations.find((i) => i.platform === platformKey);
          const connected = matched ? matched.status === "connected" : false;

          return (
            <Link
              key={platformKey}
              href="/integrations"
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center gap-3 relative group ${
                connected
                  ? "bg-surface border-border/60 hover:border-accent/40 shadow-sm"
                  : "bg-surface-raised/20 border-dashed border-border/80 hover:bg-surface-raised/50"
              }`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm border border-border/40 transition-transform group-hover:scale-110"
                style={{
                  background: `${meta.color}0d`,
                  borderColor: `${meta.color}20`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: meta.color }} />
              </div>

              <div className="space-y-0.5">
                <p className="text-[13px] font-extrabold text-text-primary leading-tight">
                  {meta.label}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                    connected ? "text-success" : "text-text-tertiary"
                  }`}
                >
                  {connected ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" /> Connected
                    </>
                  ) : (
                    "Offline"
                  )}
                </span>
              </div>

              {!connected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent-soft flex items-center justify-center text-accent">
                  <Plus className="w-3 h-3" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
