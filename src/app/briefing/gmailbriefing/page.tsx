"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import type { FeedItem } from "@/lib/types";
import { 
  Inbox, Star, Clock, Send, File, Tag, ChevronDown, Plus,
  Square, RotateCw, MoreVertical, ChevronLeft, ChevronRight,
  ArrowLeft, Archive, Trash2, Mail, Clock3, CheckCircle2, CornerUpLeft,
  MoreHorizontal, Forward
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function GmailBriefingPage() {
  const router = useRouter();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<FeedItem | null>(null);
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFolder]);

  async function handleRefresh() {
    setRefreshing(true);
    setLoading(true);
    try {
      const res = await api.refreshBriefing();
      setItems(res.items.filter(i => i.type === "email"));
      setCurrentPage(1);
      setSelectedEmail(null);
    } catch (err) {
      console.error("Failed to refresh Gmail briefing:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }

  function toggleStar(itemId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const currentlyStarred = item.priority === "high";
    const nextStarred = !currentlyStarred;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, priority: (nextStarred ? "high" : "low") }
          : item
      )
    );

    fetch("/api/briefing/toggle-star", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, starred: nextStarred }),
    }).catch((err) => console.error("Failed to persist star status:", err));
  }

  function toggleStarDetail(itemId: string) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const currentlyStarred = item.priority === "high";
    const nextStarred = !currentlyStarred;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, priority: (nextStarred ? "high" : "low") }
          : item
      )
    );
    setSelectedEmail((prev) =>
      prev && prev.id === itemId
        ? { ...prev, priority: (nextStarred ? "high" : "low") }
        : prev
    );

    fetch("/api/briefing/toggle-star", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, starred: nextStarred }),
    }).catch((err) => console.error("Failed to persist star status:", err));
  }

  useEffect(() => {
    api.getBriefing().then((r) => {
      // Filter only emails for this specific page
      setItems(r.items.filter(i => i.type === "email"));
      setLoading(false);
    });
  }, []);

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

  async function handleSendReply() {
    if (!replyText.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate sending
    setSending(false);
    setIsReplying(false);
    setReplyText("");
    setSelectedEmail(null); // Go back to inbox after sending
  }

  // Filter items based on active folder
  const displayItems = items.filter(item => {
    if (activeFolder === "Inbox") return item.folder === "inbox" || !item.folder;
    if (activeFolder === "Sent") return item.folder === "sent";
    if (activeFolder === "Drafts") return item.folder === "drafts";
    if (activeFolder === "Starred") return item.priority === "high";
    return false;
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(displayItems.length / ITEMS_PER_PAGE);
  const paginatedItems = displayItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <AppShell>
      {/* Modern Gmail uses theme background and text */}
      <div className="flex h-[calc(100vh-2rem)] md:h-screen bg-bg text-text-primary font-sans pt-2">
        
        {/* Left Sidebar */}
        <div className="w-[260px] shrink-0 flex flex-col py-3 pr-4 pl-2 hidden md:flex">
          <div className="px-3 pb-3">
            <button 
              onClick={() => router.push('/briefing')}
              className="flex items-center gap-2 px-4 py-2.5 text-text-secondary hover:bg-surface-raised rounded-xl transition-all font-semibold text-[13px] mb-4 border border-border/50 hover:text-text-primary hover:-translate-x-1"
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
              <div className="flex items-center gap-3.5 text-[14px]">
                <Inbox className="w-4 h-4 fill-current" /> Inbox
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
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
              <div className="flex items-center gap-3.5 text-[14px]">
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
              <div className="flex items-center gap-3.5 text-[14px]">
                <File className="w-4 h-4 text-current" /> Drafts
              </div>
            </button>
          </div>

        
        </div>

        {/* Main Content Area (Rounded White Box) */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface rounded-3xl overflow-hidden border border-border/60 shadow-sm mr-2 mb-2">
          
          {selectedEmail ? (
            // ================== EMAIL DETAIL VIEW ==================
            <div className="flex flex-col h-full bg-surface-raised/30">
              {/* Detail Toolbar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
                <div className="flex items-center gap-5 text-text-secondary">
                  <button 
                    onClick={() => { setSelectedEmail(null); setIsReplying(false); }}
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
                      {decodeHtmlEntities(selectedEmail.title)}
                    </h1>
                    <span className="shrink-0 bg-accent/10 text-accent text-[11px] font-bold px-2.5 py-1 rounded-full border border-accent/20">
                      Inbox
                    </span>
                  </div>

                  {/* Sender details */}
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border-soft">
                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[15px] shrink-0 border border-accent/20 shadow-sm">
                      {selectedEmail.from.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="font-bold text-[14px] text-text-primary mr-1">
                            {decodeHtmlEntities(selectedEmail.from)}
                          </span>
                          <span className="text-[12px] text-text-tertiary truncate block sm:inline">
                            &lt;{selectedEmail.from.toLowerCase().replace(/\s/g, '.')}@example.com&gt;
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-text-secondary text-[12px]">
                          <span>{formatGmailTime(selectedEmail.receivedAt)}</span>
                          <button 
                            onClick={() => toggleStarDetail(selectedEmail.id)}
                            className="p-1 hover:bg-surface-raised rounded-lg transition-colors cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${selectedEmail.priority === 'high' ? 'fill-[#f4b400] text-[#f4b400]' : 'text-text-tertiary hover:text-[#f4b400]'}`} />
                          </button>
                          <button className="p-1 hover:bg-surface-raised rounded-lg text-text-tertiary hover:text-text-primary">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">to me</div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="text-[14.5px] text-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
                    {decodeHtmlEntities(selectedEmail.snippet)}
                    {"\n\n"}
                    Best regards,
                    {"\n"}{decodeHtmlEntities(selectedEmail.from)}
                  </div>
                </div>

                {/* Reply Box */}
                {!isReplying ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsReplying(true)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent to-[#9061f9] text-white hover:shadow-md hover:brightness-110 active:scale-98 rounded-full font-bold text-[13px] transition-all cursor-pointer shadow-sm"
                    >
                      <CornerUpLeft className="w-4 h-4" /> Reply
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 border border-border/80 text-text-secondary hover:bg-surface hover:text-text-primary hover:border-text-secondary/30 rounded-full font-bold text-[13px] transition-all cursor-pointer">
                      <Forward className="w-4 h-4" /> Forward
                    </button>
                  </div>
                ) : (
                  <div className="bg-surface border border-border/60 rounded-2xl shadow-md overflow-hidden flex flex-col transition-all">
                    <div className="bg-surface-raised/60 px-4 py-3 border-b border-border/40 text-text-secondary text-[13px] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CornerUpLeft className="w-4 h-4 text-accent" /> 
                        <span>Replying to <span className="font-bold text-text-primary">{decodeHtmlEntities(selectedEmail.from)}</span></span>
                      </div>
                      <span className="text-[11px] text-text-tertiary">Draft saved</span>
                    </div>
                    <textarea 
                      autoFocus
                      className="w-full p-5 min-h-[160px] outline-none border-none resize-none text-[14px] leading-relaxed text-text-primary bg-transparent focus:ring-0 placeholder:text-text-tertiary"
                      placeholder={`Reply to ${selectedEmail.from}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex items-center justify-between px-4 py-3 bg-surface-raised border-t border-border/40">
                      <button 
                        onClick={handleSendReply}
                        disabled={sending || !replyText.trim()}
                        className="bg-gradient-to-r from-accent to-[#9061f9] hover:brightness-110 text-white px-6 py-2.5 rounded-full font-bold text-[13px] transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                      >
                        {sending ? "Sending..." : "Send Reply"}
                      </button>
                      <button 
                        onClick={() => setIsReplying(false)}
                        className="p-2.5 hover:bg-danger/10 hover:text-danger rounded-xl text-text-secondary transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // ================== EMAIL LIST VIEW ==================
            <>
              {/* Top Toolbar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-surface">
                <div className="flex items-center gap-4 text-text-secondary">
                  <button className="hover:bg-surface-raised p-2 rounded-lg cursor-pointer transition-all border border-border/20">
                    <Square className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={handleRefresh}
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
                
                <div className="flex items-center gap-4 text-text-secondary text-[12px] font-semibold">
                  <span>
                    {displayItems.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, displayItems.length)} of {displayItems.length}
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
                        {/* Checkbox & Star mock */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-4 h-4 bg-surface-raised rounded" />
                          <div className="w-4 h-4 bg-surface-raised rounded-full" />
                        </div>
                        {/* Sender mock */}
                        <div className="w-40 md:w-56 h-4 bg-surface-raised rounded shrink-0" />
                        {/* Subject & Snippet mock */}
                        <div className="flex-1 flex gap-2 min-w-0">
                          <div className="w-1/3 h-4 bg-surface-raised rounded shrink-0" />
                          <div className="w-1/2 h-4 bg-surface-raised/60 rounded hidden sm:block" />
                        </div>
                        {/* Time mock */}
                        <div className="w-12 h-4 bg-surface-raised rounded shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : displayItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-text-secondary">
                    <Inbox className="w-12 h-12 text-text-tertiary mb-3 stroke-[1.5]" />
                    <p className="font-semibold">No emails found</p>
                    <p className="text-[13px] text-text-tertiary mt-1">There are no items in your {activeFolder} folder.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {paginatedItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEmail(item)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.005] group ${
                          item.priority === 'high' 
                            ? 'bg-surface border-border/80 hover:border-accent/40 shadow-sm' 
                            : 'bg-surface border-border/40 hover:border-accent/20 shadow-sm/50'
                        }`}
                      >
                        {/* Checkbox & Star */}
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

                        {/* Sender */}
                        <div className={`w-40 md:w-52 shrink-0 truncate text-[14px] ${item.priority === 'high' ? 'font-bold text-text-primary' : 'text-text-secondary font-medium'}`}>
                          {decodeHtmlEntities(item.from)}
                        </div>

                        {/* Subject & Snippet */}
                        <div className="flex-1 truncate text-[13.5px] min-w-0">
                          <span className={`${item.priority === 'high' ? 'font-bold text-text-primary' : 'text-text-primary font-medium'} mr-2`}>
                            {decodeHtmlEntities(item.title)}
                          </span>
                          <span className="text-text-tertiary mr-2">—</span>
                          <span className="text-text-secondary">{decodeHtmlEntities(item.snippet)}</span>
                        </div>

                        {/* Priority Badge */}
                        {item.priority === 'high' && (
                          <span className="hidden sm:inline-block shrink-0 bg-danger/10 text-danger border border-danger/20 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            High Priority
                          </span>
                        )}

                        {/* Time */}
                        <div className={`shrink-0 text-[12px] w-16 text-right group-hover:opacity-0 transition-opacity font-semibold ${item.priority === 'high' ? 'text-accent' : 'text-text-secondary'}`}>
                          {formatGmailTime(item.receivedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Footer */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between px-6 py-5 text-[11px] text-text-tertiary border-t border-border/40 mt-8">
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
          )}
        </div>

      </div>
    </AppShell>
  );
}