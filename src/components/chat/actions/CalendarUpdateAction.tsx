import React from "react";
import { ChatMessage } from "@/lib/types";

interface CalendarUpdateActionProps {
  m: ChatMessage;
  editingActionId: string | null;
  editPayload: any;
  setEditPayload: (payload: any) => void;
}

export function CalendarUpdateAction({
  m,
  editingActionId,
  editPayload,
  setEditPayload,
}: CalendarUpdateActionProps) {
  const isEditing = editingActionId === m.id;
  const payload = isEditing ? editPayload : m.action!.payload;

  return (
    <>
      <div className="flex flex-col gap-1">
        <span className="text-text-tertiary font-medium">Target Event:</span>
        <span className="font-semibold">{payload.targetEventId}</span>
      </div>
      {payload.summary && (
        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary font-medium">New Title:</span>
          {isEditing ? (
            <input
              type="text"
              value={payload.summary || ""}
              onChange={(e) => setEditPayload({ ...payload, summary: e.target.value })}
              className="bg-surface border border-border rounded-md px-2 py-1 text-[10.5px] md:text-[13px] outline-none focus:border-accent w-full"
            />
          ) : (
            <span className="font-semibold">{payload.summary}</span>
          )}
        </div>
      )}
      {payload.startTime && (
        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary font-medium">New Time:</span>
          {isEditing ? (
            <input
              type="text"
              value={payload.startTime || ""}
              onChange={(e) => setEditPayload({ ...payload, startTime: e.target.value })}
              className="bg-surface border border-border rounded-md px-2 py-1 text-[10.5px] md:text-[13px] outline-none focus:border-accent w-full"
            />
          ) : (
            <span className="font-semibold">
              {new Date(payload.startTime).toLocaleString()}
            </span>
          )}
        </div>
      )}
      {payload.attendees && payload.attendees.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary font-medium">New Attendees:</span>
          {isEditing ? (
            <textarea
              value={payload.attendees.join(", ")}
              onChange={(e) =>
                setEditPayload({
                  ...payload,
                  attendees: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="bg-surface border border-border rounded-md px-2 py-1 text-[10.5px] md:text-[13px] outline-none focus:border-accent w-full min-h-[60px]"
            />
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {payload.attendees.map((email: string, i: number) => (
                <span
                  key={i}
                  className="bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-md text-[10px] md:text-[11px] font-bold"
                >
                  {email}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
