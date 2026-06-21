import { Mail, Calendar, MessageCircle, Layers } from "lucide-react";
import type { FeedItem } from "@/lib/types";

interface ChatSummaryCardProps {
  todayLabel: string;
  statusItems: FeedItem[];
  takeaways: FeedItem[];
  activePlatform: string;
}

export function ChatSummaryCard({ todayLabel, statusItems, takeaways, activePlatform }: ChatSummaryCardProps) {
  const platformConfig: Record<string, any> = {
    all: {
      label: "All Sources",
      icon: Layers,
      colorClass: "text-accent bg-accent/10 border-accent/20",
      itemLabel: "notifications"
    },
    gmail: {
      label: "Gmail",
      icon: Mail,
      colorClass: "text-[#EA4335] bg-[#EA4335]/10 border-[#EA4335]/20",
      itemLabel: "emails"
    },
    whatsapp: {
      label: "WhatsApp",
      icon: MessageCircle,
      colorClass: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/20",
      itemLabel: "messages"
    },
    google_calendar: {
      label: "Calendar",
      icon: Calendar,
      colorClass: "text-[#4285F4] bg-[#4285F4]/10 border-[#4285F4]/20",
      itemLabel: "events"
    }
  };

  const config = platformConfig[activePlatform] || platformConfig["all"];
  const Icon = config.icon;

  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-4 md:p-6 flex flex-col gap-4 md:gap-5 rise-in">
      <div className="pb-3 border-b border-border-soft">
        <h3 className="font-display font-bold text-[10.5px] md:text-[14.5px] text-text-primary tracking-tight flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span>Summary of</span>
          <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-lg text-[10px] md:text-[11px] font-bold ${config.colorClass}`}>
            <Icon className="w-3 h-3" /> {config.label}
          </span>
          <span>{config.itemLabel.charAt(0).toUpperCase() + config.itemLabel.slice(1)} ({todayLabel})</span>
        </h3>
        <p className="text-[10.5px] md:text-[11.5px] text-text-secondary mt-1 font-medium">
          Today, you received {statusItems.length} {config.itemLabel}. Here is the breakdown:
        </p>
      </div>

      {/* Actions / Status Table */}
      <div className="overflow-x-auto pb-1 scrollbar-hide w-full min-w-0">
        <table className="w-full text-left border-collapse text-[10.5px] md:text-[13px] min-w-[450px] table-fixed">
          <thead>
            <tr className="border-b border-border-soft text-text-tertiary font-bold">
              <th className="pb-2 font-semibold w-[30%]">Sender</th>
              <th className="pb-2 font-semibold w-[45%]">Subject</th>
              <th className="pb-2 font-semibold w-[25%]">Status / Action Needed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft/45 font-medium">
            {statusItems.map((item, index) => (
              <tr key={`${item.id}-${index}`} className="text-text-primary">
                <td className="py-2.5 truncate font-semibold pr-2">{item.from}</td>
                <td className="py-2.5 text-text-secondary truncate pr-2">{item.title}</td>
                <td className="py-2.5">
                  <span
                    className={`text-[9.5px] md:text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.priority === "high"
                        ? "text-danger bg-danger/5 border-danger/15"
                        : item.requiresFollowUp
                        ? "text-accent bg-accent/5 border-accent/15"
                        : "text-text-tertiary bg-surface-raised border-border-soft"
                    }`}
                  >
                    {item.priority === "high"
                      ? "Action Required"
                      : item.requiresFollowUp
                      ? "Needs Follow-up"
                      : "Informational"}
                  </span>
                </td>
              </tr>
            ))}
            {statusItems.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-text-tertiary">
                  No active communications synced.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Key Takeaways */}
      <div className="pt-3.5 border-t border-border-soft flex flex-col gap-2">
        <p className="text-[10.5px] md:text-[12px] font-bold text-text-tertiary uppercase tracking-wider">Key Takeaways:</p>
        <ul className="list-disc list-inside text-[10.5px] md:text-[13px] text-text-secondary leading-relaxed font-medium space-y-1.5 pl-1">
          {takeaways.map((t, index) => (
            <li key={`${t.id}-${index}`}>
              <span className="font-semibold text-text-primary">{t.from}:</span> {t.snippet}
            </li>
          ))}
          {takeaways.length === 0 && (
            <li>No urgent takeaways detected. Your communication channel is quiet.</li>
          )}
        </ul>
      </div>

      {/* Card Footer Badge */}
      <div className="pt-4 border-t border-border-soft flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-text-secondary font-semibold">
          <span className="text-text-tertiary">Ref:</span>
          <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-lg text-[9.5px] md:text-[10.5px] font-bold shadow-sm ${config.colorClass}`}>
            <Icon className="w-3 h-3" /> {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
