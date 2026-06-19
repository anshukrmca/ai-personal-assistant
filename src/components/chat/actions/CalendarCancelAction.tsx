import React from "react";
import { ChatMessage } from "@/lib/types";
import { AlertCircle } from "lucide-react";

interface CalendarCancelActionProps {
  m: ChatMessage;
}

export function CalendarCancelAction({ m }: CalendarCancelActionProps) {
  const payload = m.action!.payload;

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
        <div className="flex flex-col">
          <span className="text-red-800 text-[13px] font-semibold">Delete Event</span>
          <span className="text-red-700 text-[12px]">This action will permanently delete this event from your Google Calendar.</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-text-tertiary font-medium">Target Event:</span>
        <span className="font-semibold">{payload.targetEventId as string}</span>
      </div>
    </div>
  );
}
