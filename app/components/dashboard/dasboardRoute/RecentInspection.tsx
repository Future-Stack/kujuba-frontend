"use client";

import Link from "next/link";
import React from "react";
import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";

interface InspectionItem {
  id: number;
  inspection_type: string;
  inspector: string;
  image: string;
  status: string;
  duration: string | null;
}

// ── STATUS STYLE ───────────────────────────────

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "assigned":
      return "bg-blue-100 text-blue-600";
    case "completed":
      return "bg-green-100 text-green-600";
    case "started":
      return "bg-orange-100 text-orange-600";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const colors = [
  { bg: "bg-[#fff3e0]", text: "text-[#e65100]" },
  { bg: "bg-[#e8eaf6]", text: "text-[#3f51b5]" },
  { bg: "bg-[#e0f2f1]", text: "text-[#004d40]" },
  { bg: "bg-[#f3e5f5]", text: "text-[#4a148c]" },
  { bg: "bg-[#fce4ec]", text: "text-[#880e4f]" },
];

function RecentInspectionSkeleton() {
  return (
    <div className="w-full bg-white rounded-[20px] border p-5 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 rounded mb-4" />

      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex justify-between items-center mb-4">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gray-200 rounded-xl" />
            <div>
              <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="h-3 w-12 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>

        </div>
      ))}

      <div className="h-10 w-full bg-gray-200 rounded mt-6" />
    </div>
  );
}



export default function RecentInspection() {
  const { data, isLoading, isError } = useGetOverviewQuery();

  const getColor = (index: number) => {
  return colors[index % colors.length];
};

  if (isLoading) return <RecentInspectionSkeleton />;

  if (isError || !data?.success) {
    return (
      <div className="w-full bg-white rounded-[20px] border p-4 text-red-500 text-center">
        Failed to load inspections
      </div>
    );
  }

  const list: InspectionItem[] = data.data.recent_inspections || [];

  return (
    <div className="w-full h-full bg-white rounded-[20px] border font-roboto flex flex-col justify-between hover:shadow-sm">

      {/* HEADER */}
      <div>
        <h3 className="text-base md:text-lg font-bold text-gray-900 px-5 py-4 border-b border-gray-100">
          Recent Inspection
        </h3>

    
<div className="space-y-5 px-5 md:px-6 pt-5 pb-2">
  {list.length === 0 ? (
    <div className="text-center py-8 text-gray-400 text-sm">
      No inspections found
    </div>
  ) : (
    list.map((item, index) => {
      const color = colors[index % colors.length];

      return (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3"
        >
          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 tracking-wider ${color.bg} ${color.text}`}
            >
              {item.inspection_type?.slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.inspection_type}
              </h4>

              <p className="text-xs text-gray-500 truncate">
                Inspector: {item.inspector}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-right shrink-0 flex flex-col items-end gap-1">
            <span className="text-sm font-medium text-gray-900">
              {item.duration || "N/A"}
            </span>

            <span
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-medium ${getStatusStyle(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>
        </div>
      );
    })
  )}
</div>
      </div>

      {/* FOOTER */}
      <div className="px-4 md:px-6 pb-4">
        <Link href="/dashboard/inspections">
          <button className="w-full mt-6 border border-primaryColor text-primaryColor text-sm py-2 rounded-xl hover:bg-blue-50 transition">
            View All
          </button>
        </Link>
      </div>

    </div>
  );
}



// "use client";

// import Link from "next/link";
// import React from "react";

// interface InspectionItem {
//   id: string;
//   initials: string;
//   title: string;
//   inspector: string;
//   timeDuration: string;
//   status: "Ongoing" | "Completed";
//   bgStyles: string;
//   textStyles: string;
// }

// const inspections: InspectionItem[] = [
//   { id: "1", initials: "FS", title: "Four Point Inspection", inspector: "Jonathan King", timeDuration: "4h 22m", status: "Ongoing", bgStyles: "bg-[#fff3e0]", textStyles: "text-[#e65100]" },
//   { id: "2", initials: "TZ", title: "Roof Inspection", inspector: "Peter Brooks", timeDuration: "2h 33m", status: "Completed", bgStyles: "bg-[#e8eaf6]", textStyles: "text-[#3f51b5]" },
//   { id: "3", initials: "CP", title: "Wind Mitigation Inspection", inspector: "Cindy Mateo", timeDuration: "4h 33m", status: "Completed", bgStyles: "bg-[#e0f2f1]", textStyles: "text-[#004d40]" },
//   { id: "4", initials: "PD", title: "Combined Inspection", inspector: "Thomas Walsh", timeDuration: "4h 33m", status: "Completed", bgStyles: "bg-[#f3e5f5]", textStyles: "text-[#4a148c]" },
//   { id: "5", initials: "CL", title: "Flood Elevation Inspection", inspector: "Eliz Hiltner", timeDuration: "4h 33m", status: "Completed", bgStyles: "bg-[#fce4ec]", textStyles: "text-[#880e4f]" },
// ];

// export default function RecentInspection() {
//   return (
//     <div className="w-full bg-white rounded-[20px] border border-gray-200 font-roboto  hover:shadow-sm flex flex-col justify-between min-h-[520px]">
//       <div>
//         <h3 className="text-base md:text-lg font-bold text-gray-900  px-5 py-4 leading-5.5  border-b border-gray-100 pb-4">Recent Inspection</h3>

//         <div className="space-y-6 px-4 pt-4">
//           {inspections.map((item) => (
//             <div key={item.id} className="flex items-center justify-between gap-3">
//               <div className="flex items-center gap-3.5 min-w-0">
//                 {/* Rounded Box Initials Badge */}
//                 <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 tracking-wider ${item.bgStyles} ${item.textStyles}`}>
//                   {item.initials}
//                 </div>
//                 <div className="min-w-0">
//                   <h4 className="font-medium text-gray-900 text-sm  leading-5 mb-1">{item.title}</h4>
//                   <p className="text-xs md:text-sm text-gray-600 font-normal leading-4 mt-0.5">
//                     Inspector: {item.inspector}
//                   </p>
//                 </div>
//               </div>

//               {/* Duration and Status Pills */}
//               <div className="text-right shrink-0 flex flex-col items-end gap-1">
//                 <span className="text-sm  font-medium text-gray-900 leading-5">{item.timeDuration}</span>
//                 <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-medium  ${
//                   item.status === "Ongoing" 
//                     ? "bg-[#FFEDF6] text-[#E22871]" 
//                     : "bg-[#E9F9F2] text-[#01B664]"
//                 }`}>
//                   {item.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Primary Action Button */}
     
//         <div className="px-4 md:px-6 pb-4">
//            <Link href="/dashboard/inspections">
//         <button className="w-full mt-6 border border-primaryColor hover:bg-blue-50 text-primaryColor font-normal text-sm py-2 px-5 rounded-xl transition-all duration-200 cursor-pointer tracking-wide">
//         View All
//       </button>
//       </Link>
//       </div>
//     </div>
//   );
// }