"use client";

import { X, Minimize2, Maximize2, Trash2 } from "lucide-react";

interface GmailComposeViewProps {
  payload: Record<string, unknown>;
  editingActionId: string | null;
  messageId: string;
  editPayload: any;
  setEditPayload: (payload: any) => void;
}

export function GmailComposeView({ payload, editingActionId, messageId, editPayload, setEditPayload }: GmailComposeViewProps) {
  const isEditing = editingActionId === messageId;
  const to = isEditing ? (editPayload.to || "") : (payload.to as string) || "";
  const subject = isEditing ? (editPayload.subject || "") : (payload.subject as string) || "";
  const body = isEditing ? (editPayload.body || "") : (payload.body as string) || "";

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-surface shadow-md mt-2">
      {/* Compose header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#404040] rounded-t-2xl">
        <span className="text-[10.5px] md:text-[13px] font-medium text-white">New Message</span>
        <div className="flex items-center gap-2">
          <Minimize2 className="w-4 h-4 text-[#9aa0a6] cursor-pointer hover:text-white" />
          <Maximize2 className="w-4 h-4 text-[#9aa0a6] cursor-pointer hover:text-white" />
          <X className="w-4 h-4 text-[#9aa0a6] cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="divide-y divide-border">
        {/* To field */}
        <div className="flex items-center px-4 py-2">
          <span className="text-[10.5px] md:text-[13px] text-text-secondary w-[50px] shrink-0">To</span>
          {isEditing ? (
            <input
              className="flex-1 text-[10.5px] md:text-[13px] text-text-primary outline-none bg-transparent"
              value={to}
              onChange={(e) => setEditPayload({ ...editPayload, to: e.target.value })}
              placeholder="Recipients"
            />
          ) : (
            <span className="flex-1 text-[10.5px] md:text-[13px] text-text-primary font-medium">{to}</span>
          )}
        </div>

        {/* Subject field */}
        <div className="flex items-center px-4 py-2">
          <span className="text-[10.5px] md:text-[13px] text-text-secondary w-[50px] shrink-0">Subject</span>
          {isEditing ? (
            <input
              className="flex-1 text-[10.5px] md:text-[13px] text-text-primary outline-none bg-transparent"
              value={subject}
              onChange={(e) => setEditPayload({ ...editPayload, subject: e.target.value })}
              placeholder="Subject"
            />
          ) : (
            <span className="flex-1 text-[10.5px] md:text-[13px] text-text-primary font-medium">{subject}</span>
          )}
        </div>

        {/* Body */}
        <div className="px-4 py-3 min-h-[120px]">
          {isEditing ? (
            <textarea
              className="w-full text-[10.5px] md:text-[13px] text-text-primary outline-none bg-transparent min-h-[120px] resize-y leading-relaxed"
              value={body}
              onChange={(e) => setEditPayload({ ...editPayload, body: e.target.value })}
              placeholder="Compose email"
            />
          ) : (
            <div className="text-[10.5px] md:text-[13px] text-text-primary whitespace-pre-wrap leading-relaxed">{body}</div>
          )}
        </div>
      </div>
    </div>
  );
}
