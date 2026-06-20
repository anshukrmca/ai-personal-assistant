"use client";

import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface CalendarEvent {
  summary: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  location?: string;
  attendees?: string[];
  description?: string;
}

interface CalendarAgendaViewProps {
  payload: Record<string, unknown>;
  richData?: Record<string, unknown>[];
}

export function CalendarAgendaView({ payload, richData }: CalendarAgendaViewProps) {
  const events: CalendarEvent[] = (richData as unknown as CalendarEvent[])
    || (payload.events as CalendarEvent[])
    || [];

  const dateLabel = (payload.date as string) || new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const eventColors = ["#4285F4", "#0B8043", "#8E24AA", "#D50000", "#F4511E", "#039BE5"];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-surface shadow-sm mt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-surface-raised border-b border-border">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-[#4285F4]" />
          <span className="text-[10.5px] md:text-[14px] font-bold text-text-primary">{dateLabel}</span>
        </div>
        <span className="text-[10px] md:text-[11px] font-medium text-text-secondary bg-surface px-2 py-0.5 rounded-full">{events.length} events</span>
      </div>

      {/* Timeline */}
      <div className="px-5 py-3">
        {events.map((event, idx) => {
          const color = eventColors[idx % eventColors.length];
          const startTime = new Date(event.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
          const endTime = event.endTime
            ? new Date(event.endTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
            : event.durationMinutes
            ? new Date(new Date(event.startTime).getTime() + event.durationMinutes * 60000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
            : "";

          return (
            <div key={idx} className="flex gap-3 py-2.5 group">
              {/* Time column */}
              <div className="w-[70px] shrink-0 text-right text-[10.5px] md:text-[12px] text-text-secondary font-medium pt-0.5">
                {startTime}
              </div>

              {/* Color bar + content */}
              <div className="flex-1 flex gap-3">
                <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 py-1.5 px-3 rounded-lg hover:bg-surface-raised transition-colors">
                  <div className="text-[10.5px] md:text-[13px] font-bold text-text-primary">{event.summary}</div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] md:text-[11px] text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {startTime}{endTime ? ` – ${endTime}` : ""}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {event.attendees.length} attendees
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <div className="text-[10px] md:text-[12px] text-text-tertiary mt-1 truncate">{event.description}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="py-8 text-center text-text-tertiary text-[10.5px] md:text-[13px]">
            No events scheduled for today.
          </div>
        )}
      </div>
    </div>
  );
}
