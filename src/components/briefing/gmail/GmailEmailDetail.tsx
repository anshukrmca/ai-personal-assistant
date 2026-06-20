import React from "react";
import { ArrowLeft, Archive, Trash2, Mail, Clock3, Star, MoreVertical, CornerUpLeft, Forward } from "lucide-react";
import type { FeedItem } from "@/lib/types";

interface GmailEmailDetailProps {
  email: FeedItem;
  onBack: () => void;
  onReply: () => void;
  toggleStar: (id: string) => void;
}

function decodeHtmlEntities(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}

function formatGmailTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function GmailEmailDetail({
  email,
  onBack,
  onReply,
  toggleStar
}: GmailEmailDetailProps) {
  return (
    <>
      {/* Detail Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center gap-5 text-text-secondary">
          <button 
            onClick={onBack}
            className="hover:bg-surface-raised p-2.5 rounded-full cursor-pointer transition-all border border-border/40 hover:text-text-primary -ml-2"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div className="flex items-center gap-1 bg-surface-raised/60 p-1.5 rounded-xl border border-border/20">
            <button className="hover:bg-surface hover:text-text-primary p-2 rounded-lg cursor-pointer transition-all">
              <Archive className="w-4 h-4" />
            </button>
            <button className="hover:bg-surface hover:text-danger p-2 rounded-lg cursor-pointer transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-border mx-1"></div>
            <button className="hover:bg-surface hover:text-accent p-2 rounded-lg cursor-pointer transition-all">
              <Mail className="w-4 h-4" />
            </button>
            <button className="hover:bg-surface hover:text-text-primary p-2 rounded-lg cursor-pointer transition-all">
              <Clock3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        {/* Email Subject card */}
        <div className="bg-surface border border-border/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-xl md:text-2xl font-display font-bold text-text-primary tracking-tight">
              {decodeHtmlEntities(email.title)}
            </h1>
            <span className="shrink-0 bg-accent/10 text-accent text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full border border-accent/20">
              {email.folder === "sent" ? "Sent" : email.folder === "drafts" ? "Drafts" : "Inbox"}
            </span>
          </div>

          {/* Sender details */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border-soft">
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[10.5px] md:text-[15px] shrink-0 border border-accent/20 shadow-sm">
              {email.from.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="font-bold text-[10.5px] md:text-[14px] text-text-primary mr-1">
                    {decodeHtmlEntities(email.from)}
                  </span>
                  <span className="text-[10px] md:text-[12px] text-text-tertiary truncate block sm:inline">
                    &lt;{email.from.toLowerCase().replace(/\s/g, '.')}@example.com&gt;
                  </span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary text-[10px] md:text-[12px]">
                  <span>{formatGmailTime(email.receivedAt)}</span>
                  <button 
                    onClick={() => toggleStar(email.id)}
                    className="p-1 hover:bg-surface-raised rounded-lg transition-colors cursor-pointer"
                  >
                    <Star className={`w-4 h-4 ${email.priority === 'high' ? 'fill-[#f4b400] text-[#f4b400]' : 'text-text-tertiary hover:text-[#f4b400]'}`} />
                  </button>
                  <button className="p-1 hover:bg-surface-raised rounded-lg text-text-tertiary hover:text-text-primary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-[10px] md:text-[11px] text-text-tertiary mt-0.5">to me</div>
            </div>
          </div>

          {/* Body Content */}
          <div className="text-[10.5px] md:text-[14.5px] text-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
            {decodeHtmlEntities(email.snippet)}
            {"\n\n"}
            Best regards,
            {"\n"}{decodeHtmlEntities(email.from)}
          </div>
        </div>

        {/* Reply Actions */}
        <div className="flex gap-3">
          <button 
            onClick={onReply}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent to-[#9061f9] text-white hover:shadow-md hover:brightness-110 active:scale-98 rounded-full font-bold text-[10.5px] md:text-[13px] transition-all cursor-pointer shadow-sm"
          >
            <CornerUpLeft className="w-4 h-4" /> Reply
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 border border-border/80 text-text-secondary hover:bg-surface hover:text-text-primary hover:border-text-secondary/30 rounded-full font-bold text-[10.5px] md:text-[13px] transition-all cursor-pointer">
            <Forward className="w-4 h-4" /> Forward
          </button>
        </div>
      </div>
    </>
  );
}
