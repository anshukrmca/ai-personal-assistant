import { Plus, MessageSquare, Trash2, X, Settings } from "lucide-react";
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const variants = {
    open: {
      width: 256,
      x: 0,
    },
    closed: {
      width: isMobile ? 256 : 0,
      x: isMobile ? -256 : 0,
    }
  };

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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
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
        className={`fixed md:relative inset-y-0 left-0 z-50 bg-surface flex flex-col shrink-0 overflow-hidden ${isOpen ? 'border-r border-border shadow-2xl md:shadow-none' : 'border-none'}`}
        style={{ originX: 0 }}
      >
        <div className="w-64 flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-border-soft shrink-0">
            <h2 className="font-display font-bold text-text-primary text-[14px]">Chat History</h2>
            <button onClick={onClose} className="md:hidden p-1.5 rounded-lg hover:bg-surface-raised text-text-tertiary">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 shrink-0">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent text-white px-4 py-2.5 text-[13px] font-bold shadow-sm hover:opacity-90 active:scale-98 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 scrollbar-hide">
            {sessions.length === 0 ? (
              <p className="text-center text-[12px] text-text-tertiary mt-6 font-medium">
                No previous chats found.
              </p>
            ) : (
              sessions.map((session, index) => (
                <div
                  key={`${session.id}-${index}`}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    activeChatId === session.id
                      ? "bg-accent/10 text-accent font-bold"
                      : "text-text-secondary hover:bg-surface-raised font-medium"
                  }`}
                  onClick={() => onSelectChat(session.id)}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="text-[13px] truncate">
                      {session.title || "New Chat"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(session.id);
                    }}
                    className="p-1 rounded-md text-text-tertiary hover:bg-danger/10 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Connected Apps UI */}
          <div className="p-4 border-t border-border-soft shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-bold text-text-tertiary uppercase tracking-wider">Connected Apps</h3>
              <Link href="/dashboard" className="text-text-tertiary hover:text-accent transition-colors" title="Manage Integrations">
                <Settings className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide max-h-40 pb-2">
              {integrations.length === 0 ? (
                <p className="text-[12px] text-text-tertiary">No apps connected.</p>
              ) : (
                integrations.map(i => (
                  <div key={i.platform} className="flex items-center gap-2 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${i.status === 'connected' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-text-tertiary'}`} />
                    <span className={`text-[13px] font-medium ${i.status === 'connected' ? 'text-text-secondary' : 'text-text-tertiary'} capitalize`}>
                      {i.platform === "google_calendar" ? "Calendar" : i.platform}
                    </span>
                    {i.status !== 'connected' && (
                      <Link href="/integrations" className="ml-auto text-[11px] font-bold text-accent hover:underline">
                        Connect
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
