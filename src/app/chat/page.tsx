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
import { Bot, Loader2 } from "lucide-react";

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
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.getChatHistory(),
      api.getBriefing(),
      api.getIntegrations(),
    ]).then(([historyRes, briefingRes, integrationsRes]) => {
      setMessages(historyRes.history);
      setItems(briefingRes.items);
      setIntegrations(integrationsRes.integrations);
      setLoadingHistory(false);
      
      // Generate dynamic suggestions based on data
      if (briefingRes.items && briefingRes.items.length > 0) {
        generateSuggestions(briefingRes.items, "all");
      }
    });
  }, []);

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
    if (!question.trim() || sending) return;
    setInput("");
    setSending(true);

    const optimisticUser: ChatMessage = {
      id: `temp-${uuid()}`,
      userId: "",
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);

    try {
      const res = await api.askChat(question, activePlatform);
      const assistantMsg: ChatMessage = {
        id: res.messageId,
        userId: "",
        role: "assistant",
        content: res.answer,
        actions: res.actions,
        action: res.action,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setSending(false);
    }
  }

  async function handleNewChat() {
    try {
      await api.clearChatHistory();
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
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

  const connectedPlatforms = integrations
    .filter((i) => i.status === "connected")
    .map((i) => {
      if (i.platform === "google_calendar") return "Google Calendar";
      return i.platform.charAt(0).toUpperCase() + i.platform.slice(1);
    });

  const connectedText = connectedPlatforms.length > 0
    ? connectedPlatforms.join(" & ")
    : "none";

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col h-[calc(100vh-2rem)] md:h-screen">
        <ChatHeader 
          integrations={integrations} 
          activePlatform={activePlatform}
          onPlatformChange={handlePlatformChange}
          onNewChat={handleNewChat} 
        />

        <div className={`flex-1 overflow-y-auto px-4 py-4 mb-4 flex flex-col gap-6 scrollbar-thin rounded-3xl transition-colors duration-500 ${activePlatform === 'whatsapp' ? 'bg-[#efeae2] border border-[#d1cabc]' : activePlatform === 'gmail' ? 'bg-[#f6f8fc] border border-[#e8eaed]' : ''}`}>
          {loadingHistory ? (
            <div className="flex-1 flex items-center justify-center text-text-tertiary text-[13px] py-20">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading agent session…
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
                  {messages.filter(m => activePlatform === 'all' || m.platformContext === activePlatform || !m.platformContext).map((m) => (
                    <ChatMessageItem
                      key={m.id}
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
    </AppShell>
  );
}

