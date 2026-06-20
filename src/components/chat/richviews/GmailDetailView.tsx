"use client";

import { ArrowLeft, CornerUpLeft, Forward, Archive, Trash2, Star, MoreHorizontal } from "lucide-react";

interface GmailDetailViewProps {
  payload: Record<string, unknown>;
  onReply?: (email: { from: string; subject: string }) => void;
  onForward?: (email: { from: string; subject: string }) => void;
  onBack?: () => void;
}

export function GmailDetailView({ payload, onReply, onForward }: GmailDetailViewProps) {
  const from = (payload.from as string) || "Unknown";
  const to = (payload.to as string) || "me";
  const subject = (payload.subject as string) || "(no subject)";
  const body = (payload.body as string) || (payload.snippet as string) || "";
  const time = (payload.time as string) || new Date().toLocaleString();
  const attachments = (payload.attachments as string[]) || [];

  // Extract initials for avatar
  const initials = from.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  // Deterministic color from name
  const colors = ["#EA4335", "#4285F4", "#34A853", "#FBBC04", "#8E24AA", "#00ACC1"];
  const avatarColor = colors[from.charCodeAt(0) % colors.length];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-surface shadow-sm mt-2">
      {/* Subject bar */}
      <div className="px-5 py-3.5 border-b border-border bg-surface-raised">
        <h3 className="text-[15px] md:text-[18px] font-normal text-text-primary leading-snug">{subject}</h3>
        <div className="flex items-center gap-2 mt-1.5 text-[10px] md:text-[11px] text-text-secondary">
          <span className="bg-surface px-2 py-0.5 rounded-sm font-medium">Inbox</span>
        </div>
      </div>

      {/* Sender info + body */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[10.5px] md:text-[14px] font-bold shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10.5px] md:text-[14px] font-bold text-text-primary">{from}</span>
                <span className="text-[10px] md:text-[12px] text-text-tertiary ml-2">&lt;{from.toLowerCase().replace(/\s/g, '.')}@email.com&gt;</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] md:text-[12px] text-text-secondary">
                <span>{time}</span>
                <Star className="w-4 h-4 text-text-tertiary cursor-pointer hover:text-[#f4b400]" />
                <MoreHorizontal className="w-4 h-4 text-text-secondary cursor-pointer" />
              </div>
            </div>
            <div className="text-[10px] md:text-[12px] text-text-tertiary mt-0.5">to {to}</div>
          </div>
        </div>

        {/* Email body */}
        <div className="pl-[52px] text-[10.5px] md:text-[14px] text-text-primary leading-relaxed whitespace-pre-wrap">
          {body}
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="pl-[52px] mt-4 flex flex-wrap gap-2">
            {attachments.map((att, i) => (
              <div key={i} className="px-3 py-1.5 border border-border rounded-lg text-[10px] md:text-[12px] text-text-secondary font-medium">
                📎 {att}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 py-3 border-t border-border flex items-center gap-2">
        <button
          onClick={() => onReply?.({ from, subject })}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-[10.5px] md:text-[13px] font-medium text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
        >
          <CornerUpLeft className="w-4 h-4" /> Reply
        </button>
        <button
          onClick={() => onForward?.({ from, subject })}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-[10.5px] md:text-[13px] font-medium text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
        >
          <Forward className="w-4 h-4" /> Forward
        </button>
      </div>
    </div>
  );
}
