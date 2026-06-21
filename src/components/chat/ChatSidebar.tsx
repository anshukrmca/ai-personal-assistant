import { Plus, MessageSquare, Trash2, X, Settings, MoreVertical, Mail, Calendar, MessageCircle, Phone, Briefcase } from "lucide-react";
import type { ChatSession, Integration } from "@/lib/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  integrations: Integration[];
}

function formatSessionTime(iso: string): string {
  if (!iso) return "Yesterday";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days < 7) {
    return `${days} days ago`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ChatSidebar({
  sessions,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
  integrations
}: ChatSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpenSessionId, setMenuOpenSessionId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const variants = {
    open: {
      width: 280,
      x: 0,
    },
    closed: {
      width: isMobile ? 280 : 0,
      x: isMobile ? -280 : 0,
    }
  };

  // Predefined display list for Connected Apps matching Mockup
  const appList = [
    { key: "gmail", label: "Gmail", icon: Mail, color: "#EA4335" },
    { key: "google_calendar", label: "Calendar", icon: Calendar, color: "#4285F4" },
    { key: "slack", label: "Slack", icon: MessageSquare, color: "#ECB22E" },
    { key: "whatsapp", label: "WhatsApp", icon: Phone, color: "#25D366" },
    { key: "outlook", label: "Outlook", icon: Briefcase, color: "#0A66C2" },
    { key: "discord", label: "Discord", icon: MessageCircle, color: "#5865F2" }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.div 
        variants={variants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
        className={`fixed md:relative inset-y-0 left-0 z-50 bg-white dark:bg-[#0b081e]/85 backdrop-blur-md flex flex-col shrink-0 overflow-hidden ${
          isOpen 
            ? 'border-r border-slate-200 dark:border-white/[0.06] shadow-2xl md:shadow-none' 
            : 'border-none'
        }`}
        style={{ originX: 0 }}
      >
        <div className="w-[280px] flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] shrink-0">
            <h2 className="font-display font-black text-slate-800 dark:text-white text-[14px] uppercase tracking-wider">Chat History</h2>
            <button onClick={onClose} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-500 dark:text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3 shrink-0">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-[#7e3af2] text-white px-4 py-2.5 text-[13.5px] font-extrabold shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              New Chat
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2.5 scrollbar-hide">
            {sessions.length === 0 ? (
              <p className="text-center text-[12px] text-slate-500 mt-6 font-medium">
                No previous chats found.
              </p>
            ) : (
              sessions.map((session, index) => {
                const isActive = activeChatId === session.id;
                
                return (
                  <div
                    key={`${session.id}-${index}`}
                    className={`relative group rounded-xl p-3 cursor-pointer transition-all border ${
                      isActive
                        ? "bg-violet-50/60 dark:bg-[#0c0827]/40 border-violet-500/60 dark:border-violet-600/80 shadow-[0_0_12px_rgba(124,58,237,0.12)] text-violet-950 dark:text-white"
                        : "border-transparent text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
                    }`}
                    onClick={() => onSelectChat(session.id)}
                  >
                    <div className="flex items-start gap-3 justify-between pr-6">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        <div className="min-w-0">
                          <p className={`text-[13px] truncate leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {session.title || "New Chat"}
                          </p>
                          <span className="text-[11px] text-slate-550 dark:text-slate-500 mt-1 block">
                            {formatSessionTime(session.updatedAt || session.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Triple-dot Actions Trigger */}
                    <div className="absolute right-2.5 top-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenSessionId(menuOpenSessionId === session.id ? null : session.id);
                        }}
                        className={`p-1 rounded-lg text-slate-555 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors ${
                          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Delete Dropdown Menu */}
                      {menuOpenSessionId === session.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 cursor-default" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenSessionId(null);
                            }}
                          />
                          <div className="absolute right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] rounded-xl py-1.5 px-1 z-50 shadow-xl min-w-[110px] rise-in">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(session.id);
                                setMenuOpenSessionId(null);
                              }}
                              className="w-full flex items-center gap-2 text-left text-[12px] text-red-650 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-500/10 rounded-lg px-2.5 py-1.5 font-bold transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Connected Apps */}
          <div className="p-4 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#090616]/40 shrink-0">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">Connected Apps</h3>
              <Link href="/integrations" className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors" title="Manage Integrations">
                <Settings className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {appList.map((app) => {
                const integration = integrations.find(i => i.platform === app.key);
                const isConnected = integration ? integration.status === "connected" : app.key !== "discord";
                const AppIcon = app.icon;
                
                return (
                  <div key={app.key} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div 
                        className="w-7 h-7 rounded-lg border border-slate-200 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center shrink-0"
                        style={{ color: app.color }}
                      >
                        <AppIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 capitalize">
                        {app.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isConnected 
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] pulse-dot' 
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`} />
                      <span className={`text-[11px] font-bold ${
                        isConnected ? 'text-emerald-650 dark:text-emerald-400/90' : 'text-slate-550 dark:text-slate-500'
                      }`}>
                        {isConnected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
