async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data as T;
}

export const api = {
  requestOtp: (phoneNumber: string, channel: "sms" | "whatsapp") =>
    request<{ ok: boolean; message: string; devCode: string | null }>(
      "/api/auth/request-otp",
      { method: "POST", body: JSON.stringify({ phoneNumber, channel }) }
    ),

  verifyOtp: (phoneNumber: string, code: string, channel: "sms" | "whatsapp") =>
    request<{ ok: boolean; isNewUser: boolean; user: { userId: string; phoneNumber: string; name: string } }>(
      "/api/auth/verify-otp",
      { method: "POST", body: JSON.stringify({ phoneNumber, code, channel }) }
    ),

  me: () =>
    request<{ user: { userId: string; phoneNumber: string; name: string; avatar: string; email: string | null } | null }>(
      "/api/auth/me"
    ),

  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),

  getIntegrations: () =>
    request<{ integrations: import("@/lib/types").Integration[] }>("/api/integrations"),

  connectIntegration: (platform: string) =>
    request<{ ok: boolean; redirectUrl?: string }>("/api/integrations/connect", {
      method: "POST",
      body: JSON.stringify({ platform }),
    }),

  disconnectIntegration: (platform: string) =>
    request<{ ok: boolean }>("/api/integrations/disconnect", {
      method: "POST",
      body: JSON.stringify({ platform }),
    }),

  getBriefing: () =>
    request<{ briefing: import("@/lib/types").Briefing; items: import("@/lib/types").FeedItem[] }>(
      "/api/briefing/today"
    ),

  refreshBriefing: () =>
    request<{ briefing: import("@/lib/types").Briefing; items: import("@/lib/types").FeedItem[] }>(
      "/api/briefing/refresh",
      { method: "POST" }
    ),

  askChat: (question: string, activePlatform?: string) =>
    request<{ answer: string; messageId: string; actions?: import("@/lib/types").ChatAction[]; action?: import("@/lib/types").ChatAction }>("/api/chat/ask", {
      method: "POST",
      body: JSON.stringify({
        question,
        activePlatform,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localTime: new Date().toLocaleTimeString(),
      }),
    }),

  getChatHistory: () =>
    request<{ history: import("@/lib/types").ChatMessage[] }>("/api/chat/ask"),

  clearChatHistory: () =>
    request<{ ok: boolean }>("/api/chat/ask", { method: "DELETE" }),

  executeAction: (messageId: string, actionId: string, payloadOverride?: any) =>
    request<{ ok: boolean }>("/api/actions/execute", {
      method: "POST",
      body: JSON.stringify({ messageId, actionId, payloadOverride }),
    }),

  cancelAction: (messageId: string, actionId: string) =>
    request<{ ok: boolean }>(`/api/actions/execute?messageId=${messageId}&actionId=${actionId}`, {
      method: "DELETE",
    }),

  enhanceAction: (messageId: string, actionId: string) =>
    request<{ ok: boolean; payload: any }>("/api/actions/enhance", {
      method: "POST",
      body: JSON.stringify({ messageId, actionId }),
    }),

  generateAlertDraft: (item: any) =>
    request<{ draft: string }>("/api/alerts/draft", {
      method: "POST",
      body: JSON.stringify({ item }),
    }),

  getSuggestedRules: () =>
    request<{ rules: any[] }>("/api/alerts/rules"),

  getStatus: () =>
    request<{ aiProvider: string; mockOtp: boolean; mockData: boolean }>("/api/status"),
};
