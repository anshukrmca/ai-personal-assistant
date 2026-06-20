import React from "react";
import { Square, RotateCw, MoreVertical, ChevronLeft, ChevronRight, Inbox, Star } from "lucide-react";
import type { FeedItem } from "@/lib/types";

interface GmailEmailListProps {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  items: FeedItem[];
  currentPage: number;
  setCurrentPage: (p: number | ((prev: number) => number)) => void;
  itemsPerPage: number;
  activeFolder: string;
  onSelectEmail: (item: FeedItem) => void;
  toggleStar: (id: string, e: React.MouseEvent) => void;
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

export function GmailEmailList({
  loading,
  refreshing,
  onRefresh,
  items,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  activeFolder,
  onSelectEmail,
  toggleStar,
}: GmailEmailListProps) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-surface">
        <div className="flex items-center gap-2 sm:gap-4 text-text-secondary">
          <button className="hover:bg-surface-raised p-2 rounded-lg cursor-pointer transition-all border border-border/20">
            <Square className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={onRefresh}
            disabled={refreshing}
            className={`hover:bg-surface-raised p-2 rounded-lg cursor-pointer transition-all border border-border/20 ${
              refreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <RotateCw className={`w-4.5 h-4.5 ${refreshing ? "animate-spin text-accent" : ""}`} />
          </button>
          <button className="hover:bg-surface-raised p-2 rounded-lg cursor-pointer transition-all border border-border/20">
            <MoreVertical className="w-4.5 h-4.5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 text-text-secondary text-[10px] md:text-[12px] font-semibold">
          <span className="whitespace-nowrap">
            {items.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, items.length)} of {items.length}
          </span>
          <div className="flex items-center gap-1 bg-surface-raised/60 p-1 rounded-lg border border-border/20">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`p-1.5 rounded-md transition-all ${
                currentPage === 1 
                  ? "opacity-30 cursor-not-allowed text-text-tertiary" 
                  : "hover:bg-surface hover:text-text-primary cursor-pointer text-text-secondary"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={`p-1.5 rounded-md transition-all ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-30 cursor-not-allowed text-text-tertiary" 
                  : "hover:bg-surface hover:text-text-primary cursor-pointer text-text-secondary"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-surface-raised/30">
        {loading ? (
          <div className="flex flex-col animate-pulse divide-y divide-border/40">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-surface">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-4 h-4 bg-surface-raised rounded" />
                  <div className="w-4 h-4 bg-surface-raised rounded-full" />
                </div>
                <div className="w-40 md:w-56 h-4 bg-surface-raised rounded shrink-0" />
                <div className="flex-1 flex gap-2 min-w-0">
                  <div className="w-1/3 h-4 bg-surface-raised rounded shrink-0" />
                  <div className="w-1/2 h-4 bg-surface-raised/60 rounded hidden sm:block" />
                </div>
                <div className="w-12 h-4 bg-surface-raised rounded shrink-0" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-text-secondary">
            <Inbox className="w-12 h-12 text-text-tertiary mb-3 stroke-[1.5]" />
            <p className="font-semibold">No emails found</p>
            <p className="text-[10.5px] md:text-[13px] text-text-tertiary mt-1">There are no items in your {activeFolder} folder.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {paginatedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => onSelectEmail(item)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.005] group ${
                  item.priority === 'high' 
                    ? 'bg-surface border-border/80 hover:border-accent/40 shadow-sm' 
                    : 'bg-surface border-border/40 hover:border-accent/20 shadow-sm/50'
                }`}
              >
                <div className="flex items-center gap-3.5 shrink-0 text-text-tertiary group-hover:text-text-secondary transition-colors">
                  <button className="p-0.5 hover:bg-surface-raised rounded transition-colors">
                    <Square className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => toggleStar(item.id, e)}
                    className="p-0.5 hover:bg-surface-raised rounded transition-colors cursor-pointer"
                  >
                    <Star className={`w-4 h-4 ${item.priority === 'high' ? 'fill-[#f4b400] text-[#f4b400]' : ''}`} />
                  </button>
                </div>

                <div className={`w-40 md:w-52 shrink-0 truncate text-[10.5px] md:text-[14px] ${item.priority === 'high' ? 'font-bold text-text-primary' : 'text-text-secondary font-medium'}`}>
                  {decodeHtmlEntities(item.from)}
                </div>

                <div className="flex-1 truncate text-[10.5px] md:text-[13.5px] min-w-0">
                  <span className={`${item.priority === 'high' ? 'font-bold text-text-primary' : 'text-text-primary font-medium'} mr-2`}>
                    {decodeHtmlEntities(item.title)}
                  </span>
                  <span className="text-text-tertiary mr-2">—</span>
                  <span className="text-text-secondary">{decodeHtmlEntities(item.snippet)}</span>
                </div>

                {item.priority === 'high' && (
                  <span className="hidden sm:inline-block shrink-0 bg-danger/10 text-danger border border-danger/20 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    High Priority
                  </span>
                )}

                <div className={`shrink-0 text-[10px] md:text-[12px] w-16 text-right group-hover:opacity-0 transition-opacity font-semibold ${item.priority === 'high' ? 'text-accent' : 'text-text-secondary'}`}>
                  {formatGmailTime(item.receivedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between px-6 py-5 text-[10px] md:text-[11px] text-text-tertiary border-t border-border/40 mt-8">
          <div className="flex items-center gap-2.5">
            <span className="font-medium">0% of 15 GB used</span>
            <div className="w-16 h-1.5 bg-surface-raised rounded-full overflow-hidden border border-border/20">
              <div className="w-[2%] h-full bg-accent rounded-full" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Program Policies</a>
            <span className="text-right">
              Last account activity: 0 mins ago · <a href="#" className="text-accent hover:underline">Details</a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
