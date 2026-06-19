"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import type { FeedItem } from "@/lib/types";
import {
  Mail,
  MessageSquare,
  Hash,
  Calendar,
  ArrowRight,
  Loader2,
  Users,
  CheckSquare,
  Bookmark
} from "lucide-react";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { IntegrationPlatform } from "@/lib/types";

export default function BriefingHubPage() {
  const router = useRouter();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      api.getBriefing(),
      api.getIntegrations()
    ]).then(([briefingRes, integrationsRes]) => {
      setItems(briefingRes.items);
      const connected = integrationsRes.integrations
        .filter(i => i.status === "connected")
        .map(i => i.platform);
      setConnectedPlatforms(connected);
      setLoading(false);
    });
  }, []);

  const getPlatformCount = (key: string) => {
    switch (key) {
      case "gmail": return items.filter((i) => i.type === "email" && (i.folder === "inbox" || !i.folder)).length;
      case "whatsapp": return items.filter((i) => i.type === "message" && i.source === "whatsapp").length;
      case "slack": return items.filter((i) => i.source === "slack").length;
      case "google_calendar": return items.filter((i) => i.source === "google_calendar").length;
      default: return 0;
    }
  };

  return (
    <AppShell>
      <div className="px-6 md:px-10 py-12 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle background glow for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header - Full Width Hero Banner */}
        <div className="mb-14 relative z-10 mt-2 flex flex-col lg:flex-row items-center justify-between gap-10 bg-surface/50 border border-border/60 rounded-[2rem] p-8 md:p-10 shadow-sm backdrop-blur-md overflow-hidden">
          {/* Subtle glow inside the banner */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex-1 max-w-2xl relative z-10">
            <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-accent/10 text-accent border border-accent/20 shadow-sm">
              <span className="font-bold tracking-wide uppercase text-[11px]">Your Command Center</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-text-primary mb-5 leading-tight">
              Briefing <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#9061f9]">Hub</span>
            </h1>
            <p className="text-text-secondary text-[16px] md:text-lg leading-relaxed mb-0">
              Select a connected platform to review your personalized daily briefings. 
              Each platform opens in a dedicated workspace.
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto relative z-10">
            {/* Right side utilization - Time Widget */}
            <div className="bg-surface border border-border/60 rounded-[1.5rem] p-1 shadow-sm min-w-[280px] relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-[#9061f9] rounded-[1.5rem] opacity-20 blur-sm pointer-events-none group-hover:opacity-30 transition-opacity"></div>
               <div className="relative bg-surface rounded-[1.3rem] p-6 h-full text-center">
                 <h3 className="text-[12px] font-bold text-text-tertiary uppercase tracking-wider mb-3">Today's Briefing</h3>
                 <div className="font-display font-bold text-3xl text-text-primary mb-1">
                   {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                 </div>
                 <div className="text-[14px] font-bold text-accent">
                   {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                 </div>
                 
                 <div className="mt-5 pt-5 border-t border-border/50 flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold text-text-primary">{items.filter(i => i.priority === "high" || i.requiresFollowUp).length}</div>
                      <div className="text-[10px] font-bold text-danger uppercase tracking-wider mt-0.5">Urgent</div>
                    </div>
                    <div className="w-px h-8 bg-border/60"></div>
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold text-text-primary">{items.length}</div>
                      <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mt-0.5">Total</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse relative z-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface border border-border/60 shadow-sm rounded-[2rem] p-8 h-full flex flex-col min-h-[260px]">
                <div className="w-14 h-14 rounded-2xl bg-surface-raised mb-6" />
                <div className="h-6 w-2/3 bg-surface-raised rounded-md mb-4" />
                <div className="h-4 w-full bg-surface-raised rounded-md mb-2" />
                <div className="h-4 w-5/6 bg-surface-raised rounded-md mb-8" />
                <div className="pt-5 border-t border-border/50 flex items-center justify-between w-full mt-auto">
                  <div className="h-7 w-20 bg-surface-raised rounded-full" />
                  <div className="w-8 h-8 bg-surface-raised rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {connectedPlatforms.map((platformKey) => {
              const p = PLATFORM_META[platformKey as IntegrationPlatform];
              if (!p || !p.href) return null; // Only show platforms that have a dedicated briefing page
              const count = getPlatformCount(platformKey);
              const Icon = p.icon;
              return (
                <button
                  key={platformKey}
                  onClick={() => router.push(p.href!)}
                  className="group relative overflow-hidden bg-surface border border-border/60 rounded-[2rem] p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-full min-h-[260px]"
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" style={{ backgroundColor: p.color }}></div>

                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm border"
                    style={{ backgroundColor: `${p.color}15`, color: p.color, borderColor: `${p.color}30` }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="font-display font-bold text-xl text-text-primary mb-3 flex items-center justify-between z-10">
                    {p.label}
                  </h3>
                  
                  <p className="text-text-secondary text-[14.5px] leading-relaxed mb-8 flex-grow z-10">
                    {p.desc}
                  </p>
                  
                  <div className="flex items-center justify-between w-full pt-5 border-t border-border/50 z-10">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full font-bold text-[13px] shadow-sm border transition-colors"
                        style={{ 
                          backgroundColor: count > 0 ? `${p.color}15` : 'var(--surface-raised)', 
                          color: count > 0 ? p.color : 'var(--text-secondary)',
                          borderColor: count > 0 ? `${p.color}30` : 'var(--border)'
                        }}>
                        {count}
                      </span>
                      <span className="text-[13px] font-semibold text-text-secondary">
                        {count === 1 ? 'New Update' : 'New Updates'}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-raised group-hover:bg-accent/10 transition-colors">
                      <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
            
            {connectedPlatforms.length === 0 && (
               <div className="col-span-full flex flex-col items-center justify-center py-16 bg-surface border border-border/60 rounded-[2rem] shadow-sm">
                 <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center mb-4">
                   <Mail className="w-8 h-8 text-text-tertiary" />
                 </div>
                 <h3 className="text-lg font-bold text-text-primary mb-2">No platforms connected</h3>
                 <p className="text-text-secondary mb-6 text-center max-w-md">Connect your accounts to start receiving personalized daily briefings in your command center.</p>
                 <button onClick={() => router.push('/integrations')} className="px-6 py-3 bg-gradient-to-r from-accent to-[#9061f9] text-white font-bold rounded-full hover:shadow-lg hover:brightness-110 transition-all active:scale-[0.98]">
                   Connect Platforms
                 </button>
               </div>
            )}
          </div>
        )}

        {/* --- NEW: Additional Info Section --- */}
        {!loading && connectedPlatforms.length > 0 && (
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 max-w-6xl mx-auto w-full">
            {/* Left Column: Needs Attention */}
            <div className="lg:col-span-2">
              <h2 className="font-display font-bold text-xl text-text-primary mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-danger rounded-full"></span>
                Needs Attention
              </h2>
              <div className="space-y-4">
                {items.filter(i => i.priority === "high" || i.requiresFollowUp).length > 0 ? (
                  items.filter(i => i.priority === "high" || i.requiresFollowUp).slice(0, 4).map((item) => {
                    const meta = PLATFORM_META[item.source as IntegrationPlatform];
                    const Icon = meta ? meta.icon : Bookmark;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => router.push(meta?.href || '#')}
                        className="bg-surface border border-border/60 rounded-[1.5rem] p-5 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-danger/30 transition-all flex items-start gap-5 cursor-pointer group"
                      >
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm border border-black/5" 
                          style={{ backgroundColor: `${meta?.color || '#ef4444'}15`, color: meta?.color || '#ef4444' }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" 
                                  style={{ backgroundColor: `${meta?.color || '#ef4444'}10`, color: meta?.color || '#ef4444', border: `1px solid ${meta?.color || '#ef4444'}20` }}>
                              {meta?.label || item.source}
                            </span>
                            <span className="text-[12px] text-text-tertiary font-semibold">
                              {new Date(item.receivedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <h4 className="font-bold text-text-primary text-[15px] mb-1 truncate">{item.title}</h4>
                          <p className="text-text-secondary text-[14px] line-clamp-1">{item.snippet}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-surface border border-border/60 rounded-[1.5rem] p-8 text-center shadow-sm">
                    <CheckSquare className="w-10 h-10 text-success mx-auto mb-3 opacity-80" />
                    <h3 className="font-bold text-text-primary text-lg">All caught up!</h3>
                    <p className="text-text-secondary text-[14px] mt-1">No urgent alerts requiring your attention right now.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Quick Stats */}
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                Quick Stats
              </h2>
              <div className="bg-surface border border-border/60 rounded-[1.5rem] p-6 shadow-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-text-secondary">
                      <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-text-primary shadow-sm border border-border/40">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[14px]">Inbox Emails</span>
                    </div>
                    <span className="font-display font-bold text-xl text-text-primary">{getPlatformCount('gmail')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-text-secondary">
                      <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-text-primary shadow-sm border border-border/40">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[14px]">Meetings</span>
                    </div>
                    <span className="font-display font-bold text-xl text-text-primary">{getPlatformCount('google_calendar')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-text-secondary">
                      <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-text-primary shadow-sm border border-border/40">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[14px]">Messages</span>
                    </div>
                    <span className="font-display font-bold text-xl text-text-primary">{getPlatformCount('whatsapp') + getPlatformCount('slack')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full mt-8 py-3 bg-surface hover:bg-surface-raised border border-border/60 text-text-primary font-bold rounded-xl transition-colors text-[13px] shadow-sm"
                >
                  View Full Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
