"use client";

import React from "react";
import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";

function TopCategorySkeleton() {
  return (
    <div className="w-full bg-white rounded-[20px] border p-5 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-6" />

      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between mb-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gray-200" />

            <div>
              <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>

          <div>
            <div className="h-3 w-12 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

const colors = [
  { bg: "bg-[#f3e8ff]", text: "text-[#a855f7]" },
  { bg: "bg-[#ffedd5]", text: "text-[#f97316]" },
  { bg: "bg-[#e2f0ec]", text: "text-[#0f766e]" },
  { bg: "bg-[#ffe4e6]", text: "text-[#f43f5e]" },
  { bg: "bg-[#fef3c7]", text: "text-[#d97706]" },
  { bg: "bg-[#dbeafe]", text: "text-[#2563eb]" },
];

const getInitials = (title: string) => {
  const words = title.trim().split(" ");

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return title.slice(0, 2).toUpperCase();
};

const getDemandRate = (
  bookings: number,
  maxBookings: number
) => {
  return `${Math.round((bookings / maxBookings) * 100)}%`;
};

export default function TopCategory() {
  const { data, isLoading, isError } = useGetOverviewQuery();

  if (isLoading) return <TopCategorySkeleton />;

  if (isError || !data?.success) {
    return (
      <div className="w-full bg-white rounded-[20px] border p-4 text-center text-red-500">
        Failed to load categories
      </div>
    );
  }

  const categories = data.data.top_inspection_types || [];

  const maxBookings = Math.max(
    ...categories.map((item) => item.total_bookings),
    1
  );

  return (
    <div className="w-full bg-white rounded-[20px] border border-gray-200 hover:shadow-sm font-roboto flex flex-col justify-between">
      
      <div>
        <h3 className="text-base md:text-lg font-bold text-gray-900 py-4 px-5 border-b border-gray-100">
          Top Category
        </h3>

        <div className="space-y-6 px-4 py-4">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No categories found
            </div>
          ) : (
            categories.map((cat, index) => {
              const color = colors[index % colors.length];

              const demandRate = getDemandRate(
                cat.total_bookings,
                maxBookings
              );

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 tracking-wider ${color.bg} ${color.text}`}
                    >
                      {getInitials(cat.title)}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {cat.title}
                      </h4>

                      <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                        Total Bookings : {cat.total_bookings}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {demandRate}
                    </p>

                    <p className="text-sm text-gray-400 mt-0.5">
                      Demand Rate
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}



// "use client";

// import React from "react";

// interface CategoryItem {
//   id: string;
//   initials: string;
//   title: string;
//   bookings: string;
//   demandRate: string;
//   bgStyles: string; // Dynamic coloring for the unique avatar backgrounds
//   textStyles: string;
// }

// const categories: CategoryItem[] = [
//   { id: "1", initials: "FP", title: "Four Point Inspection", bookings: "1,248", demandRate: "94%", bgStyles: "bg-[#f3e8ff]", textStyles: "text-[#a855f7]" },
//   { id: "2", initials: "RI", title: "Roof Inspection", bookings: "1,032", demandRate: "94%", bgStyles: "bg-[#ffedd5]", textStyles: "text-[#f97316]" },
//   { id: "3", initials: "WI", title: "Wind Mitigation", bookings: "924", demandRate: "92%", bgStyles: "bg-[#e2f0ec]", textStyles: "text-[#0f766e]" },
//   { id: "4", initials: "CI", title: "Combined Inspection", bookings: "811", demandRate: "94%", bgStyles: "bg-[#ffe4e6]", textStyles: "text-[#f43f5e]" },
//   { id: "5", initials: "FE", title: "Flood Elevation", bookings: "624", demandRate: "88%", bgStyles: "bg-[#fef3c7]", textStyles: "text-[#d97706]" },
//   { id: "6", initials: "OI", title: "Other Inspection", bookings: "524", demandRate: "88%", bgStyles: "bg-[#ffedd5]", textStyles: "text-[#ea580c]" },
// ];

// export default function TopCategory() {
//   return (
//     <div className="w-full bg-white rounded-[20px] border border-gray-200  hover:shadow-sm font-roboto flex flex-col justify-between ">
//       <div>
//         <h3 className="text-base md:text-lg font-bold text-gray-900  py-4 px-5 leading-5.5   border-b border-gray-100 pb-4">Top Category</h3>

//         <div className="space-y-6 px-4 py-4">
//           {categories.map((cat) => (
//             <div key={cat.id} className="flex items-center justify-between gap-3 group">
//               <div className="flex items-center gap-3.5 min-w-0">
//                 {/* Initials Placeholder Badge */}
//                 <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 tracking-wider ${cat.bgStyles} ${cat.textStyles}`}>
//                   {cat.initials}
//                 </div>
//                 <div className="min-w-0">
//                   <h4 className="font-medium text-gray-900 text-sm  leading-snug truncate">{cat.title}</h4>
//                   <p className="text-xs md:text-sm text-gray-600 font-normal leading-4 mt-0.5">
//                     Total Bookings : {cat.bookings}
//                   </p>
//                 </div>
//               </div>

//               {/* Demand Rate Analytics */}
//               <div className="text-right shrink-0 ">
//                 <p className="text-sm  font-medium text-gray-900 leading-5">{cat.demandRate}</p>
//                 <p className="text-sm text-gray-400 font-normal leading-4 mt-0.5 ">Demand Rate</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }