"use client";

interface WhatsAppMsg {
  from: string;
  body: string;
  time: string;
  isMe?: boolean;
}

interface WhatsAppChatViewProps {
  payload: Record<string, unknown>;
  richData?: Record<string, unknown>[];
}

export function WhatsAppChatView({ payload, richData }: WhatsAppChatViewProps) {
  const messages: WhatsAppMsg[] = (richData as unknown as WhatsAppMsg[])
    || (payload.messages as WhatsAppMsg[])
    || [];

  const chatName = (payload.chatName as string) || (payload.from as string) || "Chat";

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border shadow-sm mt-2">
      {/* WhatsApp header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#008069] text-white">
        <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-[14px] font-bold shrink-0">
          {chatName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-[14px] font-medium">{chatName}</div>
          <div className="text-[11px] text-white/70">online</div>
        </div>
      </div>

      {/* Chat body */}
      <div className="bg-[#efeae2] dark:bg-[#0b141a] px-4 py-3 flex flex-col gap-1.5 min-h-[100px] max-h-[300px] overflow-y-auto"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc6' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-1.5 shadow-sm text-[13px] leading-relaxed ${
              msg.isMe 
                ? "bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef] rounded-tr-none" 
                : "bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef] rounded-tl-none"
            }`}>
              {!msg.isMe && (
                <div className="text-[11px] font-bold text-[#00a884] mb-0.5">{msg.from}</div>
              )}
              <div>{msg.body}</div>
              <div className="text-[10px] text-[#667781] dark:text-[#8696a0] text-right mt-0.5">
                {msg.time}
                {msg.isMe && <span className="ml-1 text-[#53bdeb]">✓✓</span>}
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="py-8 text-center text-[#667781] dark:text-text-tertiary text-[13px]">
            No messages to display.
          </div>
        )}
      </div>
    </div>
  );
}
