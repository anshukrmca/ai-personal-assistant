import React from "react";
import { ArrowLeft, Inbox, Star, Send, File, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FeedItem } from "@/lib/types";

interface GmailSidebarProps {
  activeFolder: string;
  setActiveFolder: (f: string) => void;
  setSelectedEmail: (e: FeedItem | null) => void;
  setIsReplying: (r: boolean) => void;
  items: FeedItem[];
}

export function GmailSidebar({
  activeFolder,
  setActiveFolder,
  setSelectedEmail,
  setIsReplying,
  items,
}: GmailSidebarProps) {
  const router = useRouter();

  return (
    <div className="w-[260px] shrink-0 flex flex-col py-3 pr-4 pl-2 hidden lg:flex">
      <div className="px-3 pb-3">
        <button 
          onClick={() => router.push('/briefing')}
          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-text-secondary hover:bg-surface-raised rounded-xl transition-all font-semibold text-[10.5px] md:text-[13px] mb-4 border border-border/50 hover:text-text-primary hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <button 
          onClick={() => { setSelectedEmail(null); setIsReplying(true); }}
          className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-accent to-[#9061f9] text-white rounded-2xl hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:brightness-110 active:scale-[0.98] transition-all font-bold shadow-sm w-full"
        >
          <Plus className="w-5 h-5 shrink-0" /> Compose
        </button>
      </div>
      
      <div className="flex flex-col gap-1">
        <button 
          onClick={() => { setActiveFolder("Inbox"); setSelectedEmail(null); }}
          className={`flex items-center justify-between py-2.5 pr-4 rounded-r-xl transition-all ${
            activeFolder === "Inbox" 
              ? "bg-accent/10 text-accent font-bold pl-5 border-l-4 border-accent shadow-sm" 
              : "text-text-secondary hover:bg-surface-raised pl-6 hover:text-text-primary hover:pl-7"
          }`}
        >
          <div className="flex items-center gap-3.5 text-[10.5px] md:text-[14px]">
            <Inbox className="w-4 h-4 fill-current" /> Inbox
          </div>
          <span className={`text-[10px] md:text-[11px] px-2 py-0.5 rounded-full ${
            activeFolder === "Inbox" ? "bg-accent text-white font-bold" : "bg-surface-raised text-text-secondary font-semibold"
          }`}>{items.filter(i => i.folder === "inbox" || !i.folder).length}</span>
        </button>
        
        <button 
          onClick={() => { setActiveFolder("Starred"); setSelectedEmail(null); }}
          className={`flex items-center gap-3.5 py-2.5 rounded-r-xl transition-all ${
            activeFolder === "Starred" 
              ? "bg-accent/10 text-accent font-bold pl-5 border-l-4 border-accent shadow-sm" 
              : "text-text-secondary hover:bg-surface-raised pl-6 hover:text-text-primary hover:pl-7"
          }`}
        >
          <Star className={`w-4 h-4 ${activeFolder === "Starred" ? "text-accent fill-current" : "text-text-secondary"}`} /> Starred
        </button>
        
        <button 
          onClick={() => { setActiveFolder("Sent"); setSelectedEmail(null); }}
          className={`flex items-center justify-between py-2.5 pr-4 rounded-r-xl transition-all ${
            activeFolder === "Sent" 
              ? "bg-accent/10 text-accent font-bold pl-5 border-l-4 border-accent shadow-sm" 
              : "text-text-secondary hover:bg-surface-raised pl-6 hover:text-text-primary hover:pl-7"
          }`}
        >
          <div className="flex items-center gap-3.5 text-[10.5px] md:text-[14px]">
            <Send className="w-4 h-4 text-current" /> Sent
          </div>
        </button>
        
        <button 
          onClick={() => { setActiveFolder("Drafts"); setSelectedEmail(null); }}
          className={`flex items-center justify-between py-2.5 pr-4 rounded-r-xl transition-all ${
            activeFolder === "Drafts" 
              ? "bg-accent/10 text-accent font-bold pl-5 border-l-4 border-accent shadow-sm" 
              : "text-text-secondary hover:bg-surface-raised pl-6 hover:text-text-primary hover:pl-7"
          }`}
        >
          <div className="flex items-center gap-3.5 text-[10.5px] md:text-[14px]">
            <File className="w-4 h-4 text-current" /> Drafts
          </div>
        </button>
      </div>
    </div>
  );
}
