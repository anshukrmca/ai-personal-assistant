import { Bot, User, Loader2, Check } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { CalendarAction } from "./actions/CalendarAction";
import { CalendarUpdateAction } from "./actions/CalendarUpdateAction";
import { CalendarCancelAction } from "./actions/CalendarCancelAction";
import { WhatsAppSendAction } from "./actions/WhatsAppSendAction";
import { WhatsAppReadAction } from "./actions/WhatsAppReadAction";
import { EmailReadAction } from "./actions/EmailReadAction";
import { EmailSendAction } from "./actions/EmailSendAction";
// Rich view components
import { GmailInboxView } from "./richviews/GmailInboxView";
import { GmailDetailView } from "./richviews/GmailDetailView";
import { GmailComposeView } from "./richviews/GmailComposeView";
import { CalendarAgendaView } from "./richviews/CalendarAgendaView";
import { WhatsAppChatView } from "./richviews/WhatsAppChatView";
import { SlackChannelView } from "./richviews/SlackChannelView";

interface ChatMessageItemProps {
  message: ChatMessage;
  editingActionId: string | null;
  editPayload: any;
  setEditingActionId: (id: string | null) => void;
  setEditPayload: (payload: any) => void;
  enhancingActions: Record<string, boolean>;
  executingActions: Record<string, boolean>;
  onEnhanceAction: (messageId: string, actionId: string) => void;
  onCancelAction: (messageId: string, actionId: string) => void;
  onExecuteAction: (messageId: string, actionId: string) => void;
  onSendFollowUp?: (question: string) => void;
}

// Check if action type is a rich view (renders full-width, no confirm/cancel buttons)
const RICH_VIEW_TYPES = new Set([
  "email_inbox_view", "email_detail_view", "calendar_agenda_view",
  "whatsapp_chat_view", "slack_channel_view"
]);

// Compose view is special — it's a rich view but still has confirm/cancel
const RICH_EDITABLE_TYPES = new Set(["email_compose_view"]);

function getActionLabel(type: string): string {
  switch (type) {
    case "email": return "Send Email";
    case "draft": return "Create Draft";
    case "whatsapp": return "Send WhatsApp";
    case "whatsapp_read": return "WhatsApp Message";
    case "email_read": return "Email Read";
    case "calendar": return "Schedule Meeting";
    case "calendar_update": return "Update Meeting";
    case "calendar_cancel": return "Cancel Meeting";
    case "email_inbox_view": return "Gmail Inbox";
    case "email_detail_view": return "Email";
    case "email_compose_view": return "Compose Email";
    case "calendar_agenda_view": return "Calendar Agenda";
    case "whatsapp_chat_view": return "WhatsApp Chat";
    case "slack_channel_view": return "Slack Channel";
    default: return "Action";
  }
}

export function ChatMessageItem({
  message: m,
  editingActionId,
  editPayload,
  setEditingActionId,
  setEditPayload,
  enhancingActions,
  executingActions,
  onEnhanceAction,
  onCancelAction,
  onExecuteAction,
  onSendFollowUp,
}: ChatMessageItemProps) {
  return (
    <div className="flex flex-col">
      {/* Text bubble */}
      <div
        className={`flex items-start gap-3.5 ${m.role === "user" ? "justify-end" : "justify-start"} rise-in`}
      >
        {m.role === "assistant" && (
          <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 shadow-sm">
            <Bot className="w-4 h-4 text-accent" />
          </div>
        )}
        <div
          className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-[10.5px] md:text-[14px] leading-relaxed shadow-sm ${
            m.role === "user"
              ? "user-bubble bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white font-semibold rounded-tr-none"
              : "bg-surface border border-border text-text-primary rounded-tl-none"
          }`}
        >
          {m.content}
        </div>
        {m.role === "user" && (
          <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
            <User className="w-4 h-4 text-text-secondary" />
          </div>
        )}
      </div>

      {/* Render all actions for this message */}
      {(m.actions || (m.action ? [{ ...m.action, id: m.id }] : [])).map((act, index) => {
        const actionId = act.id || m.id;
        const isRichView = RICH_VIEW_TYPES.has(act.type);
        const isRichEditable = RICH_EDITABLE_TYPES.has(act.type);
        const actionPayload = act.payload as any;

        return (
          <div key={`${actionId || 'action'}-${index}`} className="mt-2 flex flex-col">
            {/* Rich View Block (full-width, no wrapper card) */}
            {isRichView && (
              <div className="ml-[46px] max-w-[85%] rise-in">
                {act.type === "email_inbox_view" && (
                  <GmailInboxView
                    payload={actionPayload}
                    richData={act.richData}
                    onEmailClick={(email) => onSendFollowUp?.(`Show me the email from ${email.from} about "${email.subject}"`)}
                  />
                )}
                {act.type === "email_detail_view" && (
                  <GmailDetailView
                    payload={actionPayload}
                    onReply={(email) => onSendFollowUp?.(`Draft a reply to ${email.from} about "${email.subject}"`)}
                    onForward={(email) => onSendFollowUp?.(`Forward the email from ${email.from} about "${email.subject}"`)}
                  />
                )}
                {act.type === "calendar_agenda_view" && (
                  <CalendarAgendaView payload={actionPayload} richData={act.richData} />
                )}
                {act.type === "whatsapp_chat_view" && (
                  <WhatsAppChatView payload={actionPayload} richData={act.richData} />
                )}
                {act.type === "slack_channel_view" && (
                  <SlackChannelView payload={actionPayload} richData={act.richData} />
                )}
              </div>
            )}

            {/* Compose View (rich but editable with confirm/cancel) */}
            {isRichEditable && (
              <div className="ml-[46px] max-w-[85%] rise-in">
                <GmailComposeView
                  payload={actionPayload}
                  editingActionId={editingActionId}
                  messageId={actionId}
                  editPayload={editPayload}
                  setEditPayload={setEditPayload}
                />
                <div className="mt-2 flex items-center justify-end gap-2">
                  {act.status === "pending" ? (
                    <>
                      {editingActionId !== actionId && (
                        <>
                          <button 
                            disabled={enhancingActions[actionId]}
                            onClick={() => onEnhanceAction(m.id, actionId)} 
                            className="flex  cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-accent bg-accent/10 hover:bg-accent/20 font-bold text-[12px] transition-all disabled:opacity-50"
                          >
                            {enhancingActions[actionId] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "✨ Polish with AI"}
                          </button>
                          <button onClick={() => { setEditingActionId(actionId); setEditPayload(actionPayload); }} className="cursor-pointer px-3 py-1.5 rounded-lg text-text-secondary hover:bg-surface-raised font-bold text-[12px] transition-all">Edit</button>
                        </>
                      )}
                      <button 
                        disabled={executingActions[actionId]} 
                        onClick={() => { 
                          if (editingActionId === actionId) {
                            setEditingActionId(null); 
                            setEditPayload({}); 
                          } else {
                            onCancelAction(m.id, actionId);
                          }
                        }} 
                        className="px-3 py-1.5 cursor-pointer rounded-lg text-text-secondary hover:bg-surface-raised font-bold text-[12px] transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => onExecuteAction(m.id, actionId)} 
                        disabled={executingActions[actionId]}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-white font-bold text-[12px] shadow-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {executingActions[actionId] && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {editingActionId === actionId ? "Save & Send" : "Confirm & Send"}
                      </button>
                    </>
                  ) : act.status === "completed" ? (
                    <span className="text-[12px] font-bold text-success flex items-center gap-1.5 bg-success/10 px-2 py-1 rounded-md"><Check className="w-3.5 h-3.5"/> Sent successfully</span>
                  ) : (
                    <span className="text-[12px] font-bold text-text-tertiary bg-surface-raised border border-border px-2 py-1 rounded-md">Action cancelled</span>
                  )}
                </div>
              </div>
            )}

            {/* Legacy Action Card (for original action types) */}
            {!isRichView && !isRichEditable && (
              <div className="ml-[46px] max-w-[75%] bg-surface border border-border shadow-sm rounded-xl overflow-hidden rise-in">
                <div className="bg-surface-raised px-4 py-2 border-b border-border-soft flex items-center justify-between">
                  <span className="font-bold text-text-primary text-[10.5px] md:text-[13px]">
                    {getActionLabel(act.type)}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">{act.type.includes("_read") ? "Details" : "Preview"}</span>
                </div>
                <div className="p-4 flex flex-col gap-2 text-[10.5px] md:text-[13px]">
                  {/* Action components mapped to act instead of m */}
                  {act.type === "calendar" && <CalendarAction m={{ ...m, action: act }} editingActionId={editingActionId} editPayload={editPayload} setEditPayload={setEditPayload} />}
                  {act.type === "calendar_update" && <CalendarUpdateAction m={{ ...m, action: act }} editingActionId={editingActionId} editPayload={editPayload} setEditPayload={setEditPayload} />}
                  {act.type === "calendar_cancel" && <CalendarCancelAction m={{ ...m, action: act }} />}
                  {act.type === "whatsapp" && <WhatsAppSendAction m={{ ...m, action: act }} editingActionId={editingActionId} editPayload={editPayload} setEditPayload={setEditPayload} />}
                  {act.type === "whatsapp_read" && <WhatsAppReadAction m={{ ...m, action: act }} />}
                  {act.type === "email_read" && <EmailReadAction m={{ ...m, action: act }} />}
                  {(act.type === "email" || act.type === "draft") && <EmailSendAction m={{ ...m, action: act }} editingActionId={editingActionId} editPayload={editPayload} setEditPayload={setEditPayload} />}
                  
                  <div className="mt-3 pt-3 border-t border-border-soft flex items-center justify-end gap-2">
                    {act.status === "pending" ? (
                      <>
                        {editingActionId !== actionId && (
                          <>
                            <button 
                              disabled={enhancingActions[actionId]}
                              onClick={() => onEnhanceAction(m.id, actionId)} 
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-accent bg-accent/10 hover:bg-accent/20 font-bold text-[12px] transition-all disabled:opacity-50"
                            >
                              {enhancingActions[actionId] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "✨ Polish with AI"}
                            </button>
                            <button onClick={() => { setEditingActionId(actionId); setEditPayload(actionPayload); }} className="px-3 py-1.5 rounded-lg text-text-secondary hover:bg-surface-raised font-bold text-[12px] transition-all">Edit</button>
                          </>
                        )}
                        <button 
                          disabled={executingActions[actionId]} 
                          onClick={() => { 
                            if (editingActionId === actionId) {
                              setEditingActionId(null); 
                              setEditPayload({}); 
                            } else {
                              onCancelAction(m.id, actionId);
                            }
                          }} 
                          className="px-3 py-1.5 rounded-lg text-text-secondary hover:bg-surface-raised font-bold text-[12px] transition-all disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => onExecuteAction(m.id, actionId)} 
                          disabled={executingActions[actionId]}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-white font-bold text-[12px] shadow-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 ${act.type === 'calendar_cancel' ? 'bg-red-500' : 'bg-accent'}`}
                        >
                          {executingActions[actionId] && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          {editingActionId === actionId ? "Save & " : "Confirm & "} {act.type === "email" ? "Send" : act.type === "whatsapp" ? "Send" : act.type === "draft" ? "Draft" : act.type === "calendar_update" ? "Update" : act.type === "calendar_cancel" ? "Delete Event" : "Schedule"}
                        </button>
                      </>
                    ) : act.status === "completed" ? (
                      <span className="text-[12px] font-bold text-success flex items-center gap-1.5 bg-success/10 px-2 py-1 rounded-md"><Check className="w-3.5 h-3.5"/> {act.type.includes("_read") ? "Fetched successfully" : "Action executed successfully"}</span>
                    ) : (
                      <span className="text-[12px] font-bold text-text-tertiary bg-surface-raised border border-border px-2 py-1 rounded-md">Action cancelled</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
