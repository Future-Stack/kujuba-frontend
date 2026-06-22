import React from 'react';
import { CalendarIcon, ClockIcon, CheckCircle, Circle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineItem {
  event: string;
  timestamp: string | null;
}

interface Props {
  timeline?: TimelineItem[] | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateTime(ts: string | null) {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return null;
  const date = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return { date, time };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ActivityTimeline({ timeline }: Props) {
  const items = timeline ?? [];

  return (
    <div className="antialiased">
      <div className="bg-white border border-slate-100 rounded-xl p-5 md:p-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M18.3327 5.8335L11.2493 12.9168L7.08268 8.75016L1.66602 14.1668" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.334 5.8335H18.334V10.8335" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-lg font-semibold text-slate-900 font-sora tracking-tight">Activity Timeline</h2>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No activity yet</p>
        ) : (
          <div className="flex flex-col">
            {items.map((item, idx) => {
              const isDone = !!item.timestamp;
              const dt = formatDateTime(item.timestamp);
              const isLast = idx === items.length - 1;

              return (
                <div key={`${item.event}-${idx}`} className="flex items-stretch gap-4 sm:gap-5">

                  {/* Icon + connector column */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full p-1 border-2 shrink-0 transition-colors ${
                        isDone
                          ? "bg-emerald-50 text-emerald-500 border-[#00C950] shadow-sm"
                          : "bg-gray-50 text-gray-300 border-gray-200"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                      ) : (
                        <Circle className="w-4 h-4" strokeWidth={2} />
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-[2px] flex-1 my-1 rounded-full ${isDone ? "bg-emerald-500" : "bg-gray-200"}`} />
                    )}
                  </div>

                  {/* Text Metadata Content Block */}
                  <div className={`flex-1 flex flex-col space-y-1 pt-1.5 sm:pt-2 ${isLast ? "" : "pb-6"}`}>
                    <h3
                      className={`text-sm sm:text-base font-normal leading-6 font-sora transition-colors ${
                        isDone ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {item.event}
                    </h3>

                    {dt ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-normal leading-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>{dt.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          <span>{dt.time}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">Pending</span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
