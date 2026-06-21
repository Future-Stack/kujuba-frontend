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




// import { Activity, CalendarIcon, ChartBar, CheckCircle, ClockIcon } from 'lucide-react';
// import React from 'react';


// // TypeScript schema matching timeline structures
// interface TimelineEvent {
//   id: number;
//   title: string;
//   date: string;
//   time: string;
// }

// export default function ActivityTimeline() {
//   // Ordered historical track logs extracted precisely from the design
//   const timelineData: TimelineEvent[] = [
//     { id: 1, title: "Booking created", date: "May 20, 2026", time: "2:15 PM" },
//     { id: 2, title: "Payment received", date: "May 20, 2026", time: "2:16 PM" },
//     { id: 3, title: "Inspector assigned", date: "May 21, 2026", time: "9:30 AM" },
//     { id: 4, title: "Inspection rescheduled", date: "May 22, 2026", time: "11:45 AM" },
//     { id: 5, title: "Inspection started", date: "May 28, 2026", time: "10:30 AM" },
//     { id: 6, title: "Inspection completed", date: "May 28, 2026", time: "1:45 PM" },
//     { id: 7, title: "Report uploaded", date: "May 28, 2026", time: "4:20 PM" },
//     { id: 8, title: "Payment released to inspector", date: "May 29, 2026", time: "10:00 AM" }
//   ];

//   return (
//     <div className=" antialiased">
//       <div className=" bg-white border border-slate-100 rounded-xl p-5 md:p-6 ">
        
//         {/* Header */}
//         <div className="flex items-center gap-2 mb-8">
//          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//   <path d="M18.3327 5.8335L11.2493 12.9168L7.08268 8.75016L1.66602 14.1668" stroke="#5E65FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M13.334 5.8335H18.334V10.8335" stroke="#5E65FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//           <h2 className="text-lg font-semibold text-slate-900 font-sora tracking-tight">Activity Timeline</h2>
//         </div>

//         {/* Timeline Core Flow Wrapper */}
//         <div className="relative pl-2 sm:pl-4">
          
//           {/* Vertical continuous accent track line */}
//           <div className="absolute left-[25px] sm:left-[33px] top-4 bottom-4 w-[2px] bg-emerald-500" />

//           {/* Group Blocks */}
//           <div className="space-y-6 relative">
//             {timelineData.map((event) => (
//               <div 
//                 key={event.id} 
//                 className="flex items-start gap-4 sm:gap-5 group relative"
//               >
                
//                 {/* Custom Check Circle Icon Wrapper with White Background Masking */}
//                 <div className="relative z-10 bg-white rounded-full p-0.5 shrink-0 transition-transform duration-200 group-hover:scale-105">
//                   <div className="bg-emerald-50 text-emerald-500 rounded-full p-1 border-2 border-[#00C950] shadow-sm">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//   <g clip-path="url(#clip0_1715_2497)">
//     <path d="M9.99935 18.3332C14.6017 18.3332 18.3327 14.6022 18.3327 9.99984C18.3327 5.39746 14.6017 1.6665 9.99935 1.6665C5.39698 1.6665 1.66602 5.39746 1.66602 9.99984C1.66602 14.6022 5.39698 18.3332 9.99935 18.3332Z" stroke="#00A63E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M7.5 10.0002L9.16667 11.6668L12.5 8.3335" stroke="#00A63E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
//   </g>
//   <defs>
//     <clipPath id="clip0_1715_2497">
//       <rect width="20" height="20" fill="white"/>
//     </clipPath>
//   </defs>
// </svg>
//                   </div>
//                 </div>

//                 {/* Text Metadata Content Block */}
//                 <div className="pt-1.5 sm:pt-2 flex flex-col space-y-1">
//                   <h3 className="text-sm sm:text-base font-normal leading-6 font-sora text-slate-900 transition-colors group-hover:text-indigo-600">
//                     {event.title}
//                   </h3>
                  
//                   {/* Row Containing Time and Date stamps */}
//                   <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-normal leading-4">
//                     <div className="flex items-center gap-1">
//                       <CalendarIcon className="w-3.5 h-3.5" />
//                       <span>{event.date}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <ClockIcon className="w-3.5 h-3.5" />
//                       <span>{event.time}</span>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             ))}
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }