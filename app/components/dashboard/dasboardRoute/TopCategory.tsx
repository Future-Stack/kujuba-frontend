"use client";

import React from "react";

interface CategoryItem {
  id: string;
  initials: string;
  title: string;
  bookings: string;
  demandRate: string;
  bgStyles: string; // Dynamic coloring for the unique avatar backgrounds
  textStyles: string;
}

const categories: CategoryItem[] = [
  { id: "1", initials: "FP", title: "Four Point Inspection", bookings: "1,248", demandRate: "94%", bgStyles: "bg-[#f3e8ff]", textStyles: "text-[#a855f7]" },
  { id: "2", initials: "RI", title: "Roof Inspection", bookings: "1,032", demandRate: "94%", bgStyles: "bg-[#ffedd5]", textStyles: "text-[#f97316]" },
  { id: "3", initials: "WI", title: "Wind Mitigation", bookings: "924", demandRate: "92%", bgStyles: "bg-[#e2f0ec]", textStyles: "text-[#0f766e]" },
  { id: "4", initials: "CI", title: "Combined Inspection", bookings: "811", demandRate: "94%", bgStyles: "bg-[#ffe4e6]", textStyles: "text-[#f43f5e]" },
  { id: "5", initials: "FE", title: "Flood Elevation", bookings: "624", demandRate: "88%", bgStyles: "bg-[#fef3c7]", textStyles: "text-[#d97706]" },
  { id: "6", initials: "OI", title: "Other Inspection", bookings: "524", demandRate: "88%", bgStyles: "bg-[#ffedd5]", textStyles: "text-[#ea580c]" },
];

export default function TopCategory() {
  return (
    <div className="w-full bg-white rounded-[20px] border border-gray-100  hover:shadow-sm font-roboto flex flex-col justify-between ">
      <div>
        <h3 className="text-base md:text-lg font-bold text-gray-900  py-4 px-5 leading-5.5   border-b border-gray-100 pb-4">Top Category</h3>

        <div className="space-y-6 px-4 py-4">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Initials Placeholder Badge */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 tracking-wider ${cat.bgStyles} ${cat.textStyles}`}>
                  {cat.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm  leading-snug truncate">{cat.title}</h4>
                  <p className="text-xs md:text-sm text-gray-600 font-normal leading-4 mt-0.5">
                    Total Bookings : {cat.bookings}
                  </p>
                </div>
              </div>

              {/* Demand Rate Analytics */}
              <div className="text-right shrink-0 ">
                <p className="text-sm  font-medium text-gray-900 leading-5">{cat.demandRate}</p>
                <p className="text-sm text-gray-400 font-normal leading-4 mt-0.5 ">Demand Rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}