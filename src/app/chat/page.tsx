"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import type { ChatMessage, FeedItem, Integration } from "@/lib/types";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatSummaryCard } from "@/components/chat/ChatSummaryCard";
import { ChatMessageItem } from "@/components/chat/ChatMessageItem";
import { ChatSuggestions } from "@/components/chat/ChatSuggestions";
import { ChatInputForm } from "@/components/chat/ChatInputForm";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Bot, Loader2, Menu } from "lucide-react";
import type { ChatSession } from "@/lib/types";

// Dynamic suggestions will be generated based on context

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [executingActions, setExecutingActions] = useState<Record<string, boolean>>({});
  const [enhancingActions, setEnhancingActions] = useState<Record<string, boolean>>({});
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editPayload, setEditPayload] = useState<any>({});
  const [suggestions, setSuggestions] = useState<string[]>([
    "What's my agenda for today?",
    "Summarize my unread emails",
    "Are there any urgent alerts?"
  ]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.getChatSessions(),
      api.getBriefing(),
      api.getIntegrations(),
    ]).then(async ([sessionsRes, briefingRes, integrationsRes]) => {
      setItems(briefingRes.items);
      setIntegrations(integrationsRes.integrations);

      let initialSessions = sessionsRes.sessions;
      if (initialSessions.length === 0) {
        const newSession = await api.createChatSession();
        initialSessions = [newSession];
      }
      setSessions(initialSessions);
      setActiveChatId(initialSessions[0].id);

      if (briefingRes.items && briefingRes.items.length > 0) {
        generateSuggestions(briefingRes.items, "all");
      }
    });
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    setLoadingHistory(true);
    api.getChatHistory(activeChatId).then((res) => {
      setMessages(res.history);
      setLoadingHistory(false);
    });
  }, [activeChatId]);

  const generateSuggestions = (allItems: FeedItem[], platform: string) => {
    const filtered = platform === "all" ? allItems : allItems.filter(i => i.source === platform);
    const dynamicSuggestions: string[] = [];
    const highPriority = filtered.find((i: FeedItem) => i.priority === "high");
    const followup = filtered.find((i: FeedItem) => i.requiresFollowUp);
    const calendarEvent = filtered.find((i: FeedItem) => i.source === "google_calendar");

    if (highPriority) {
      dynamicSuggestions.push(`Handle alert: ${highPriority.title}?`);
    }
    if (followup) {
      dynamicSuggestions.push(`Draft a reply to ${followup.from}?`);
    }
    if (calendarEvent) {
      dynamicSuggestions.push(`Check my meeting: ${calendarEvent.title}?`);
    }

    if (dynamicSuggestions.length < 3) {
      dynamicSuggestions.push(`Summarize my ${platform === "all" ? "inbox" : platform} for today`);
    }

    setSuggestions(dynamicSuggestions.slice(0, 3));
  };

  const handlePlatformChange = (platform: string) => {
    setActivePlatform(platform);
    generateSuggestions(items, platform);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(question: string) {
    if (!question.trim() || sending || !activeChatId) return;
    setInput("");
    setSending(true);

    const optimisticUser: ChatMessage = {
      id: `temp-${uuid()}`,
      chatId: activeChatId,
      userId: "",
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);

    try {
      const res = await api.askChat(question, activeChatId, activePlatform);
      const assistantMsg: ChatMessage = {
        id: res.messageId,
        chatId: activeChatId,
        userId: "",
        role: "assistant",
        content: res.answer,
        actions: res.actions,
        action: res.action,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Refresh sessions to get updated title if it was the first message
      if (messages.length === 0) {
        const sessionsRes = await api.getChatSessions();
        setSessions(sessionsRes.sessions);
      }
    } finally {
      setSending(false);
    }
  }

  async function handleNewChat() {
    try {
      const newSession = await api.createChatSession();
      setSessions((prev) => [newSession, ...prev]);
      setActiveChatId(newSession.id);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  }

  async function handleDeleteChat(chatId: string) {
    try {
      await api.deleteChatSession(chatId);
      setSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== chatId);
        if (activeChatId === chatId) {
          if (filtered.length > 0) {
            setActiveChatId(filtered[0].id);
          } else {
            // If empty, fetch a new one
            handleNewChat();
          }
        }
        return filtered;
      });
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  }

  // Filter items based on activePlatform
  const filteredItems = activePlatform === "all" ? items : items.filter(i => i.source === activePlatform);

  // Filter items for the status list (emails and high-priority messages)
  const statusItems = filteredItems.filter((i) => i.type === "email" || i.priority === "high").slice(0, 5);
  // Takeaways
  const takeaways = filteredItems.filter((i) => i.priority === "high" || i.requiresFollowUp).slice(0, 3);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleExecuteAction = async (messageId: string, actionId: string) => {
    setExecutingActions((prev) => ({ ...prev, [actionId]: true }));
    const payloadOverride = editingActionId === actionId ? editPayload : undefined;
    try {
      const res = await api.executeAction(messageId, actionId, payloadOverride);
      if (res.ok) {
        setEditingActionId(null);
        setEditPayload({});
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === messageId) {
              const updatedActions = m.actions?.map(a => a.id === actionId ? { ...a, status: "completed" as const, payload: payloadOverride ? { ...a.payload, ...payloadOverride } : a.payload } : a);
              return { ...m, actions: updatedActions, action: m.action && (!m.actions || m.actions.length === 0) ? { ...m.action, status: "completed", payload: payloadOverride ? { ...m.action.payload, ...payloadOverride } : m.action.payload } : m.action };
            }
            return m;
          })
        );
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const updatedActions = m.actions?.map(a => a.id === actionId ? { ...a, status: "failed" as const } : a);
            return { ...m, actions: updatedActions, action: m.action && (!m.actions || m.actions.length === 0) ? { ...m.action, status: "failed" } : m.action };
          }
          return m;
        })
      );
    } finally {
      setExecutingActions((prev) => ({ ...prev, [actionId]: false }));
    }
  };

  const handleCancelAction = async (messageId: string, actionId: string) => {
    // Optimistically update UI
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const updatedActions = m.actions?.map(a => a.id === actionId ? { ...a, status: "failed" as const } : a);
          return { ...m, actions: updatedActions, action: m.action && (!m.actions || m.actions.length === 0) ? { ...m.action, status: "failed" } : m.action };
        }
        return m;
      })
    );
    try {
      await api.cancelAction(messageId, actionId);
    } catch (err) {
      console.error("Failed to persist action cancellation", err);
    }
  };

  const handleEnhanceAction = async (messageId: string, actionId: string) => {
    setEnhancingActions((prev) => ({ ...prev, [actionId]: true }));
    try {
      const res = await api.enhanceAction(messageId, actionId);
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === messageId) {
              const updatedActions = m.actions?.map(a => a.id === actionId ? { ...a, payload: res.payload } : a);
              return { ...m, actions: updatedActions, action: m.action && (!m.actions || m.actions.length === 0) ? { ...m.action, payload: res.payload } : m.action };
            }
            return m;
          })
        );
        if (editingActionId === actionId) {
          setEditPayload(res.payload);
        }
      }
    } catch (err) {
      console.error("Enhance error:", err);
    } finally {
      setEnhancingActions((prev) => ({ ...prev, [actionId]: false }));
    }
  };


  return (
    <AppShell>
      <div className="flex h-full md:h-screen overflow-hidden relative w-full">
        <ChatSidebar
          sessions={sessions}
          activeChatId={activeChatId}
          onSelectChat={(id) => { setActiveChatId(id); setSidebarOpen(false); }}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          integrations={integrations}
        />
        <div className="flex-1 flex flex-col max-w-6xl mx-auto px-3 sm:px-6 md:px-10 pt-2 pb-1 sm:py-6 md:py-8 h-full w-full relative">
          <ChatHeader
            integrations={integrations}
            activePlatform={activePlatform}
            onPlatformChange={handlePlatformChange}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className={`flex-1 overflow-y-auto px-2 md:px-4 py-2 md:py-4 mb-1 md:mb-4 flex flex-col gap-6 scrollbar-hide rounded-3xl transition-colors duration-500 `}>
            {loadingHistory ? (
              <div className="flex-1 flex flex-col gap-8 pt-8 px-4 w-full max-w-4xl mx-auto">
                {/* Skeleton Message Right */}
                <div className="flex justify-end animate-pulse">
                  <div className="w-full max-w-[280px] h-[52px] bg-surface-raised border border-border-soft rounded-[20px] rounded-tr-[4px]" />
                </div>

                {/* Skeleton Message Left (Assistant) */}
                <div className="flex items-start gap-4 animate-pulse [animation-delay:150ms]">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-accent/50" />
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-[400px]">
                    <div className="w-full h-[88px] bg-surface-raised border border-border-soft rounded-[20px] rounded-tl-[4px]" />
                    <div className="w-2/3 h-[60px] bg-surface-raised border border-border-soft rounded-[20px]" />
                  </div>
                </div>

                {/* Skeleton Message Right */}
                <div className="flex justify-end animate-pulse [animation-delay:300ms]">
                  <div className="w-full max-w-[220px] h-[52px] bg-surface-raised border border-border-soft rounded-[20px] rounded-tr-[4px]" />
                </div>

                {/* Centered Spinner Status */}
                <div className="flex items-center justify-center pt-10 pb-4">
                  <div className="flex items-center gap-3 bg-surface border border-border px-5 py-2.5 rounded-full shadow-sm">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
                      <div className="absolute inset-0 border-2 border-accent rounded-full border-t-transparent animate-spin" />
                    </div>
                    <span className="text-[13px] font-bold text-text-secondary tracking-wide uppercase">Syncing Intel</span>
                    <span className="flex gap-0.5 ml-1">
                      <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ChatSummaryCard
                  todayLabel={todayLabel}
                  statusItems={statusItems}
                  takeaways={takeaways}
                  activePlatform={activePlatform}
                />

                {messages.filter(m => activePlatform === 'all' || m.platformContext === activePlatform || !m.platformContext).length > 0 && (
                  <div className="flex flex-col gap-4 pt-2">
                    {messages.filter(m => activePlatform === 'all' || m.platformContext === activePlatform || !m.platformContext).map((m, index) => (
                      <ChatMessageItem
                        key={`${m.id}-${index}`}
                        message={m}
                        editingActionId={editingActionId}
                        editPayload={editPayload}
                        setEditingActionId={setEditingActionId}
                        setEditPayload={setEditPayload}
                        enhancingActions={enhancingActions}
                        executingActions={executingActions}
                        onEnhanceAction={handleEnhanceAction}
                        onCancelAction={handleCancelAction}
                        onExecuteAction={handleExecuteAction}
                        onSendFollowUp={send}
                      />
                    ))}

                    {sending && (
                      <div className="flex items-start gap-3.5 justify-start">
                        <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 shadow-sm">
                          <Bot className="w-4 h-4 text-accent animate-pulse" />
                        </div>
                        <div className="bg-surface border border-border rounded-2xl px-5 py-3.5 flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                )}
              </>
            )}
          </div>

          <ChatSuggestions suggestions={suggestions} onSelect={send} />

          <ChatInputForm
            input={input}
            setInput={setInput}
            sending={sending}
            onSend={send}
          />
        </div>
      </div>
    </AppShell>
  );
}

