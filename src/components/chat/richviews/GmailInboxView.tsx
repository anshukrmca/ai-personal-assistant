"use client";

import { Star, Paperclip } from "lucide-react";

interface EmailRow {
  from: string;
  subject: string;
  snippet: string;
  time: string;
  priority: string;
  isRead: boolean;
  id?: string;
}

interface GmailInboxViewProps {
  payload: Record<string, unknown>;
  richData?: Record<string, unknown>[];
  onEmailClick?: (email: EmailRow) => void;
}

export function GmailInboxView({ payload, richData, onEmailClick }: GmailInboxViewProps) {
  const emails: EmailRow[] = (richData as unknown as EmailRow[]) 
    || (payload.emails as EmailRow[]) 
    || [];

  const folder = (payload.folder as string) || "Inbox";

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-surface shadow-sm mt-2">
      {/* Gmail-style toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-raised border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#EA4335]/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#EA4335]">M</span>
          </div>
          <span className="text-[12.5px] md:text-[13px] font-bold text-text-primary">{folder}</span>
          <span className="text-[10px] md:text-[11px] font-medium text-text-secondary bg-surface px-2 py-0.5 rounded-full">{emails.length}</span>
        </div>
        <span className="text-[10px] md:text-[11px] font-medium text-text-tertiary">1–{emails.length} of {emails.length}</span>
      </div>

      {/* Email rows */}
      <div className="divide-y divide-border">
        {emails.map((email, idx) => (
          <button
            key={`${email.id || 'email'}-${idx}`}
            onClick={() => onEmailClick?.(email)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-raised hover:shadow-[inset_3px_0_0_0_#1a73e8] transition-all cursor-pointer group ${
              !email.isRead ? "bg-surface" : "bg-surface-raised/50"
            }`}
          >
            {/* Star */}
            <Star 
              className={`w-4 h-4 shrink-0 ${
                email.priority === "high" 
                  ? "text-[#f4b400] fill-[#f4b400]" 
                  : "text-text-tertiary group-hover:text-text-secondary"
              }`} 
            />

            {/* Sender */}
            <span className={`w-[110px] sm:w-[140px] shrink-0 truncate text-[10.5px] md:text-[13px] ${
              !email.isRead ? "font-bold text-text-primary" : "font-medium text-text-secondary"
            }`}>
              {email.from}
            </span>

            {/* Subject + Snippet */}
            <div className="flex-1 flex items-baseline gap-1.5 truncate min-w-0">
              <span className={`text-[10.5px] md:text-[13px] truncate shrink-0 max-w-[50%] ${
                !email.isRead ? "font-bold text-text-primary" : "font-medium text-text-secondary"
              }`}>
                {email.subject}
              </span>
              <span className="text-[10.5px] md:text-[13px] text-text-tertiary truncate hidden sm:inline">
                — {email.snippet}
              </span>
            </div>

            {/* Time */}
            <span className={`text-[11px] md:text-[12px] shrink-0 ${
              !email.isRead ? "font-bold text-text-primary" : "font-medium text-text-secondary"
            }`}>
              {email.time}
            </span>
          </button>
        ))}
      </div>

      {emails.length === 0 && (
        <div className="px-4 py-8 text-center text-text-tertiary text-[12.5px] md:text-[13px]">
          No emails found in {folder}.
        </div>
      )}
    </div>
  );
}
