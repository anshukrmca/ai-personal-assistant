import React, { useState } from "react";
import { CornerUpLeft, Trash2 } from "lucide-react";

interface GmailComposeProps {
  toEmail?: string;
  onClose: () => void;
}

export function GmailCompose({ toEmail, onClose }: GmailComposeProps) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSendReply() {
    if (!replyText.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate sending
    setSending(false);
    onClose();
  }

  return (
    <div className="flex flex-col h-full bg-surface-raised/30 p-6 md:p-8">
      <div className="bg-surface border border-border/60 rounded-2xl shadow-md overflow-hidden flex flex-col transition-all h-full">
        <div className="bg-surface-raised/60 px-4 py-3 border-b border-border/40 text-text-secondary text-[10.5px] md:text-[13px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CornerUpLeft className="w-4 h-4 text-accent" /> 
            <span>{toEmail ? "Replying to " : "New Message"} <span className="font-bold text-text-primary">{toEmail || ""}</span></span>
          </div>
          <span className="text-[10px] md:text-[11px] text-text-tertiary">Draft saved</span>
        </div>
        <textarea 
          autoFocus
          className="w-full p-5 flex-1 min-h-[200px] outline-none border-none resize-none text-[10.5px] md:text-[14px] leading-relaxed text-text-primary bg-transparent focus:ring-0 placeholder:text-text-tertiary"
          placeholder={toEmail ? `Reply to ${toEmail}...` : "Write something..."}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <div className="flex items-center justify-between px-4 py-3 bg-surface-raised border-t border-border/40 shrink-0">
          <button 
            onClick={handleSendReply}
            disabled={sending || !replyText.trim()}
            className="bg-gradient-to-r from-accent to-[#9061f9] hover:brightness-110 text-white px-6 py-2.5 rounded-full font-bold text-[10.5px] md:text-[13px] transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {sending ? "Sending..." : "Send"}
          </button>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-danger/10 hover:text-danger rounded-xl text-text-secondary transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
