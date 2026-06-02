"use client";

import Link from "next/link";
import React from "react";

interface InspectionItem {
  id: string;
  initials: string;
  title: string;
  inspector: string;
  timeDuration: string;
  status: "Ongoing" | "Completed";
  bgStyles: string;
  textStyles: string;
}

const inspections: InspectionItem[] = [
  { id: "1", initials: "FS", title: "Four Point Inspection", inspector: "Jonathan King", timeDuration: "4h 22m", status: "Ongoing", bgStyles: "bg-[#fff3e0]", textStyles: "text-[#e65100]" },
  { id: "2", initials: "TZ", title: "Roof Inspection", inspector: "Peter Brooks", timeDuration: "2h 33m", status: "Completed", bgStyles: "bg-[#e8eaf6]", textStyles: "text-[#3f51b5]" },
  { id: "3", initials: "CP", title: "Wind Mitigation Inspection", inspector: "Cindy Mateo", timeDuration: "4h 33m", status: "Completed", bgStyles: "bg-[#e0f2f1]", textStyles: "text-[#004d40]" },
  { id: "4", initials: "PD", title: "Combined Inspection", inspector: "Thomas Walsh", timeDuration: "4h 33m", status: "Completed", bgStyles: "bg-[#f3e5f5]", textStyles: "text-[#4a148c]" },
  { id: "5", initials: "CL", title: "Flood Elevation Inspection", inspector: "Eliz Hiltner", timeDuration: "4h 33m", status: "Completed", bgStyles: "bg-[#fce4ec]", textStyles: "text-[#880e4f]" },
];

export default function RecentInspection() {
  return (
    <div className="w-full bg-white rounded-[20px] border border-gray-100 font-roboto  hover:shadow-sm flex flex-col justify-between min-h-[520px]">
      <div>
        <h3 className="text-base md:text-lg font-bold text-gray-900  px-5 py-4 leading-5.5  border-b border-gray-100 pb-4">Recent Inspection</h3>

        <div className="space-y-6 px-4 pt-4">
          {inspections.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Rounded Box Initials Badge */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 tracking-wider ${item.bgStyles} ${item.textStyles}`}>
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm  leading-5 mb-1">{item.title}</h4>
                  <p className="text-xs md:text-sm text-gray-600 font-normal leading-4 mt-0.5">
                    Inspector: {item.inspector}
                  </p>
                </div>
              </div>

              {/* Duration and Status Pills */}
              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <span className="text-sm  font-medium text-gray-900 leading-5">{item.timeDuration}</span>
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-medium  ${
                  item.status === "Ongoing" 
                    ? "bg-[#FFEDF6] text-[#E22871]" 
                    : "bg-[#E9F9F2] text-[#01B664]"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action Button */}
     
        <div className="px-4 md:px-6 pb-4">
           <Link href="/dashboard/inspections">
        <button className="w-full mt-6 border border-primaryColor hover:bg-blue-50 text-primaryColor font-normal text-sm py-2 px-5 rounded-xl transition-all duration-200 cursor-pointer tracking-wide">
        View All
      </button>
      </Link>
      </div>
    </div>
  );
}