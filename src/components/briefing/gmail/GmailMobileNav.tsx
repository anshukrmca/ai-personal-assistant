import React from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FeedItem } from "@/lib/types";

interface GmailMobileNavProps {
  activeFolder: string;
  setActiveFolder: (f: string) => void;
  setSelectedEmail: (e: FeedItem | null) => void;
  setIsReplying: (r: boolean) => void;
}

export function GmailMobileNav({
  activeFolder,
  setActiveFolder,
  setSelectedEmail,
  setIsReplying,
}: GmailMobileNavProps) {
  const router = useRouter();

  return (
    <div className="flex lg:hidden overflow-x-auto gap-2 px-3 py-3 bg-surface border-b border-border/50 shrink-0 hide-scrollbar items-center">
      <button 
        onClick={() => router.push('/briefing')}
        className="shrink-0 p-1.5 mr-1 bg-surface-raised rounded-full text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button 
        onClick={() => { setSelectedEmail(null); setIsReplying(true); }}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg text-[12px] font-bold mr-2 shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" /> Compose
      </button>
      
      {['Inbox', 'Starred', 'Sent', 'Drafts'].map(folder => (
        <button
          key={folder}
          onClick={() => { setActiveFolder(folder); setSelectedEmail(null); }}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
            activeFolder === folder ? 'bg-accent/10 text-accent' : 'text-text-secondary bg-surface-raised'
          }`}
        >
          {folder}
        </button>
      ))}
    </div>
  );
}
