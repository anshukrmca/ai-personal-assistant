import { CryptoUtil } from "./crypto";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let finalBody = options?.body;

  // 1. Encrypt outgoing body if it exists, but skip for auth routes since they establish the keys
  if (finalBody && typeof finalBody === 'string' && !url.includes('/api/auth/')) {
    try {
      const key = typeof window !== "undefined" ? sessionStorage.getItem('ai_assistant_enc_key') : null;
      const iv = typeof window !== "undefined" ? sessionStorage.getItem('ai_assistant_enc_iv') : null;
      if (key && iv) {
        const encrypted = CryptoUtil.encrypt(finalBody, key, iv);
        if (encrypted) {
          finalBody = JSON.stringify({ payload: encrypted });
        }
      }
    } catch (e) {
      console.warn('Failed to encrypt outgoing request body', e);
    }
  }

  const res = await fetch(url, {
    ...options,
    body: finalBody,
    headers: { "Content-Type": "application/json", ...options?.headers },
    credentials: "include",
  });
  
  const rawData = await res.json().catch(() => ({}));
  
  if (!res.ok || rawData.success === false) {
    if (res.status === 401 && typeof window !== "undefined" && !url.includes("/api/auth/")) {
      // Keep theme preference if it exists, clear everything else
      const theme = localStorage.getItem("theme");
      localStorage.clear();
      sessionStorage.clear();
      if (theme) localStorage.setItem("theme", theme);
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      window.location.href = "/login";
    }
    throw new Error(rawData.message || rawData.error || "Request failed");
  }

  // Handle ApiResponse envelope
  const isApiResponse = rawData && typeof rawData.success === 'boolean';
  let responseData = isApiResponse ? rawData.data : rawData;

  // 2. Decrypt incoming data if it's a ciphertext string
  if (typeof responseData === 'string' && responseData.includes(':')) {
    try {
      const key = typeof window !== "undefined" ? sessionStorage.getItem('ai_assistant_enc_key') : null;
      const iv = typeof window !== "undefined" ? sessionStorage.getItem('ai_assistant_enc_iv') : null;
      if (key && iv) {
        const decrypted = CryptoUtil.decrypt(responseData, key, iv);
        if (decrypted !== null) {
          responseData = decrypted;
        }
      }
    } catch (e) {
      console.warn('Failed to decrypt incoming response data', e);
    }
  }

  return responseData as T;
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

  verifyFirebaseToken: (idToken: string) =>
    request<{ ok: boolean; isNewUser: boolean; user: any; encryptionKey?: string; encryptionIv?: string }>(
      "/api/auth/session",
      { method: "POST", body: JSON.stringify({ idToken }) }
    ),

  me: () =>
    request<{ user: { userId: string; phoneNumber: string; name: string; avatar: string; email: string | null; username: string | null; country: string | null; timezone: string | null; bio: string | null; } | null }>(
      "/api/auth/me"
    ),

  updateProfile: (data: { name?: string; email?: string; avatar?: string; username?: string; country?: string; timezone?: string; bio?: string; phoneNumber?: string; }) =>
    request<{ user: { userId: string; phoneNumber: string; name: string; avatar: string; email: string | null; username: string | null; country: string | null; timezone: string | null; bio: string | null; } }>(
      "/api/auth/me",
      { method: "POST", body: JSON.stringify(data) }
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

  getChatSessions: () =>
    request<{ sessions: import("@/lib/types").ChatSession[] }>("/api/chat/sessions"),

  createChatSession: (title?: string) =>
    request<import("@/lib/types").ChatSession>("/api/chat/sessions", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  deleteChatSession: (chatId: string) =>
    request<{ success: boolean }>(`/api/chat/sessions/${chatId}`, { method: "DELETE" }),

  askChat: (question: string, chatId: string, activePlatform?: string) =>
    request<{ answer: string; messageId: string; actions?: import("@/lib/types").ChatAction[]; action?: import("@/lib/types").ChatAction }>("/api/chat/ask", {
      method: "POST",
      body: JSON.stringify({
        question,
        chatId,
        activePlatform,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localTime: new Date().toLocaleTimeString(),
      }),
    }),

  getChatHistory: (chatId: string) =>
    request<{ history: import("@/lib/types").ChatMessage[] }>(`/api/chat/ask?chatId=${chatId}`),

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
