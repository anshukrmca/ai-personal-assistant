"use client";

import { Hash } from "lucide-react";

interface SlackMsg {
  from: string;
  body: string;
  time: string;
  avatar?: string;
}

interface SlackChannelViewProps {
  payload: Record<string, unknown>;
  richData?: Record<string, unknown>[];
}

export function SlackChannelView({ payload, richData }: SlackChannelViewProps) {
  const messages: SlackMsg[] = (richData as unknown as SlackMsg[])
    || (payload.messages as SlackMsg[])
    || [];

  const channel = (payload.channel as string) || "general";

  const slackColors = ["#E01E5A", "#36C5F0", "#2EB67D", "#ECB22E", "#4A154B"];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-surface shadow-sm mt-2">
      {/* Slack header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-raised border-b border-border">
        <Hash className="w-4 h-4 text-text-secondary" />
        <span className="text-[10.5px] md:text-[14px] font-bold text-text-primary">{channel}</span>
        <span className="text-[10px] md:text-[11px] font-medium text-text-secondary bg-surface px-2 py-0.5 rounded">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="px-4 py-3 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
        {messages.map((msg, idx) => {
          const color = slackColors[msg.from.charCodeAt(0) % slackColors.length];
          const initials = msg.from.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

          return (
            <div key={idx} className="flex items-start gap-3 group hover:bg-surface-raised -mx-2 px-2 py-1 rounded-lg transition-colors">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[11px] md:text-[12px] font-bold shrink-0"
                style={{ backgroundColor: color }}
              >
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10.5px] md:text-[13px] font-bold text-text-primary">{msg.from}</span>
                  <span className="text-[10px] md:text-[11px] text-text-tertiary">{msg.time}</span>
                </div>
                <div className="text-[10.5px] md:text-[13px] text-text-primary leading-relaxed mt-0.5">{msg.body}</div>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="py-8 text-center text-text-tertiary text-[10.5px] md:text-[13px]">
            No messages in #{channel}.
          </div>
        )}
      </div>
    </div>
  );
}
