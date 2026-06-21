"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import { PLATFORM_META } from "@/lib/platformMeta";
import type { Integration, IntegrationPlatform } from "@/lib/types";
import { CheckCircle2, Loader2, Plug, Settings, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[] | null>(null);
  const [pending, setPending] = useState<IntegrationPlatform | null>(null);
  const [configPlatform, setConfigPlatform] = useState<IntegrationPlatform | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    api.getIntegrations().then((r) => setIntegrations(r.integrations));
  }, []);

  async function toggle(platform: IntegrationPlatform, currentlyConnected: boolean) {
    setPending(platform);
    try {
      if (currentlyConnected) {
        await api.disconnectIntegration(platform);
        const r = await api.getIntegrations();
        setIntegrations(r.integrations);
        addToast(`Disconnected ${PLATFORM_META[platform].label} successfully`, "info");
      } else {
        const res = await api.connectIntegration(platform);
        if (res.redirectUrl) {
          window.location.href = res.redirectUrl;
          return;
        }
        const r = await api.getIntegrations();
        setIntegrations(r.integrations);
        addToast(`Connected ${PLATFORM_META[platform].label} successfully`, "success");
      }
    } catch (err: any) {
      addToast(err.message || `Failed to toggle ${PLATFORM_META[platform].label}`, "error");
      console.error(err);
    } finally {
      setPending(null);
    }
  }

  const connectedCount = integrations?.filter((i) => i.status === "connected").length ?? 0;

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
              <span className="font-bold tracking-wide uppercase text-[11px]">Integration Center</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-text-primary mb-5 leading-tight">
              Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#9061f9]">Your Apps</span>
            </h1>
            <p className="text-text-secondary text-[16px] md:text-lg leading-relaxed mb-0">
              Securely connect with OAuth & permissions. Anshu.ai only reads what it needs to build your briefing — nothing more.
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto relative z-10">
            {/* Right side utilization - Stats Widget */}
            <div className="bg-surface border border-border/60 rounded-[1.5rem] p-1 shadow-sm min-w-[280px] relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-[#9061f9] rounded-[1.5rem] opacity-20 blur-sm pointer-events-none group-hover:opacity-30 transition-opacity"></div>
               <div className="relative bg-surface rounded-[1.3rem] p-6 h-full">
                 <h3 className="text-[12px] font-bold text-text-tertiary uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Plug className="w-4 h-4" />
                   Connection Status
                 </h3>
                 <div className="flex items-end gap-3 mb-1">
                   <span className="font-display font-bold text-5xl text-accent leading-none">{connectedCount}</span>
                   <span className="text-xl font-bold text-text-tertiary leading-none mb-1">/ {integrations?.length ?? 8}</span>
                 </div>
                 <p className="text-[14px] font-semibold text-text-secondary">Apps currently synced</p>
                 
                 <div className="mt-6 pt-5 border-t border-border/50">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                      </div>
                      <span className="text-[12px] font-bold text-success uppercase tracking-wider">System Active</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {!integrations && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[170px] rounded-3xl border border-border bg-surface animate-pulse"
              />
            ))}
          </div>
        )}

        {integrations && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.platform}
                integration={integration}
                isPending={pending === integration.platform}
                toggle={toggle}
                onOpenConfig={() => setConfigPlatform(integration.platform)}
              />
            ))}
          </div>
        )}

        {/* MCP Settings Schema Modal (Replicating YouTube Video Modal) */}
        {configPlatform && (
          <McpSettingsModal
            platform={configPlatform}
            onClose={() => setConfigPlatform(null)}
          />
        )}
      </div>
    </AppShell>
  );
}

function IntegrationCard({
  integration,
  isPending,
  toggle,
  onOpenConfig,
}: {
  integration: Integration;
  isPending: boolean;
  toggle: (platform: IntegrationPlatform, currentlyConnected: boolean) => Promise<void>;
  onOpenConfig: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meta = PLATFORM_META[integration.platform];
  const Icon = meta.icon;
  const connected = integration.status === "connected";

  const cardStyle = {
    borderColor: hovered ? `${meta.color}35` : "var(--border)",
    boxShadow: hovered
      ? `0 10px 25px -5px ${meta.color}0a, inset 0 1px 0 0 rgba(255,255,255,0.01)`
      : "none",
  };

  return (
    <div
      className="rounded-3xl border bg-surface p-5 flex flex-col gap-4.5 transition-all duration-300 hover:-translate-y-0.5 rise-in"
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-border-soft"
          style={{
            background: `${meta.color}0a`,
            borderColor: `${meta.color}15`,
          }}
        >
          <Icon className="w-5.5 h-5.5" style={{ color: meta.color }} strokeWidth={2} />
        </div>
        
        <div className="flex items-center gap-2">
          {connected && (
            <>
              <button
                onClick={onOpenConfig}
                className="p-1.5 rounded-lg border border-border-soft text-text-secondary hover:text-accent hover:bg-surface-raised cursor-pointer transition-colors"
                title="View MCP Schema"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-success bg-success/5 border border-success/15 rounded-full px-2.5 py-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected
              </span>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-[15px] tracking-tight text-text-primary">
          {meta.label}
        </h3>
        <p className="text-text-tertiary text-[11.5px] mt-1 leading-relaxed font-medium">
          {meta.actions.slice(0, 2).join(" · ")}
        </p>
      </div>

      <button
        onClick={() => toggle(integration.platform, connected)}
        disabled={isPending}
        className={`mt-auto flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold cursor-pointer transition-all ${
          connected
            ? "border border-border text-text-secondary hover:border-danger/30 hover:text-danger hover:bg-danger/5 active:scale-98"
            : "bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white shadow-sm hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] shadow-accent/5"
        } disabled:opacity-60 disabled:hover:scale-100 disabled:active:scale-100`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
        ) : connected ? (
          "Disconnect"
        ) : (
          <>
            <Plug className="w-3.5 h-3.5" strokeWidth={2.5} /> Connect
          </>
        )}
      </button>
    </div>
  );
}

function McpSettingsModal({
  platform,
  onClose,
}: {
  platform: IntegrationPlatform;
  onClose: () => void;
}) {
  const meta = PLATFORM_META[platform];
  const Icon = meta.icon;

  // Render specific tools and schema matching the platform
  const tools = meta.actions.map((act) => {
    const slug = `${platform.toLowerCase()}_${act.toLowerCase().replace(/\s+/g, "_")}`;
    let argsText = "";
    if (slug.includes("search") || slug.includes("find")) {
      argsText = "arguments: { query: string, max_results?: number }";
    } else if (slug.includes("send") || slug.includes("post")) {
      argsText = "arguments: { to: string, body: string, subject?: string }";
    } else if (slug.includes("history") || slug.includes("chats")) {
      argsText = "arguments: { chatId: string, limit?: number }";
    }
    return {
      name: slug,
      desc: act,
      args: argsText,
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 rise-in">
      <div className="bg-surface border border-border rounded-3xl w-full shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-soft flex items-center justify-between bg-surface-raised/20 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-border-soft"
              style={{
                background: `${meta.color}0c`,
                borderColor: `${meta.color}15`,
              }}
            >
              <Icon className="w-5.5 h-5.5" style={{ color: meta.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-[15px] text-text-primary tracking-tight">
                  {meta.label} Settings
                </h3>
                <span className="text-[10px] font-bold text-success bg-success/5 border border-success/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active Sync
                </span>
              </div>
              <p className="text-[11.5px] text-text-secondary mt-0.5 font-medium">
                Connected via Model Context Protocol (MCP) integrations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4.5">
          <div>
            <h4 className="text-[12px] font-bold text-text-tertiary uppercase tracking-wider mb-1">
              Available MCP Tools
            </h4>
            <p className="text-[12.5px] text-text-secondary font-medium leading-relaxed">
              The following Model Context Protocol (MCP) tools are exposed by this platform to your Anshu cognitive personal assistant:
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {tools.map((t) => (
              <div
                key={t.name}
                className="border border-border-soft rounded-2xl p-4 bg-surface-raised/10 flex flex-col gap-2 shadow-inner"
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="font-mono text-[13px] font-semibold text-[#7c3aed]">
                    {t.name}
                  </span>
                  <span className="text-[9.5px] font-bold tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase">
                    mcp_tool_schema
                  </span>
                </div>
                <p className="text-[12px] text-text-secondary font-medium leading-relaxed">
                  {t.desc}
                </p>
                {t.args && (
                  <div className="bg-surface border border-border-soft rounded-xl p-2.5 mt-1 font-mono text-[11px] text-text-secondary">
                    {t.args}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
