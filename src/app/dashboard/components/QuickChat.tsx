"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/apiClient";

export default function QuickChat() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi Anshu! Ask me anything about today's briefing, alerts, or meetings." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chat sessions on load and query live history of the primary active session
  useEffect(() => {
    (async () => {
      try {
        const res = await api.getChatSessions();
        setChatSessions(res.sessions || []);
        if (res.sessions && res.sessions.length > 0) {
          const historyRes = await api.getChatHistory(res.sessions[0].id);
          if (historyRes.history && historyRes.history.length > 0) {
            const formatted = historyRes.history.map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            }));
            setMessages(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to load chat sessions inside QuickChat", err);
      }
    })();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setSending(true);

    try {
      let activeChatId = "";
      if (chatSessions.length === 0) {
        const newSession = await api.createChatSession("Dashboard Quick Chat");
        activeChatId = newSession.id;
        setChatSessions([newSession]);
      } else {
        activeChatId = chatSessions[0].id;
      }

      const res = await api.askChat(userMessage, activeChatId);
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I ran into a connection issue. Please check your network and try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border/80 bg-surface dark:bg-[#100d22]/75 dark:backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-display font-bold text-[16px] text-text-primary tracking-tight">
            Quick AI Agent
          </h3>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-success pulse-dot" title="Assistant Ready" />
      </div>

      {/* Message History area (scrollable) */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-3 h-[180px] overflow-y-auto pr-1.5 scrollbar-thin scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed font-semibold transition-all duration-200 ${
              msg.role === "user"
                ? "bg-accent text-white self-end rounded-tr-none shadow-sm"
                : "bg-surface-raised/60 border border-border/40 text-text-primary self-start rounded-tl-none dark:bg-surface-raised/20"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {sending && (
          <div className="bg-surface-raised/60 border border-border/40 text-text-primary self-start rounded-2xl rounded-tl-none px-3.5 py-2.5 text-[12.5px] flex items-center gap-2 dark:bg-surface-raised/20">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
            <span className="text-text-secondary font-medium">Assistant is thinking...</span>
          </div>
        )}
      </div>

      {/* Input panel */}
      <form onSubmit={handleSend} className="flex gap-2 items-center relative mt-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Anshu AI..."
          disabled={sending}
          className="flex-1 bg-surface-raised/40 border border-border/60 hover:border-border rounded-xl px-4 py-2.5 text-[13px] font-semibold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all dark:bg-surface-raised/10"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="p-2.5 bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] hover:shadow-md text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
