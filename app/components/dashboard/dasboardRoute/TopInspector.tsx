"use client";

import React from "react";
import Image from "next/image";

interface Inspector {
  id: string;
  name: string;
  location: string;
  totalEarnings: number;
  avatarUrl: string;
}

const inspectors: Inspector[] = [
  { id: "1", name: "Leon Baxter", location: "Florida, USA", totalEarnings: 6595, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
  { id: "2", name: "Charles Cline", location: "Florida, USA", totalEarnings: 6590, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
  { id: "3", name: "James Higham", location: "Florida, USA", totalEarnings: 6580, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
  { id: "4", name: "Thomas Ward", location: "Florida, USA", totalEarnings: 6260, avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80" },
];

export default function TopInspector() {
  return (
    <div className="w-full bg-white rounded-[28px] border border-gray-100 shadow-sm flex flex-col font-roboto justify-between">
      <div>
        {/* Card Header */}
        <h3 className="text-base md:text-lg font-bold text-gray-900  p-5 md:p-6 leading-5.5 m px-1 border-b border-gray-100 pb-4">Top Inspector</h3>

        {/* List Body */}
        <div className="space-y-5  px-4  pt-4">
          {inspectors.map((inspector) => (
            <div key={inspector.id} className="flex items-center  justify-between group transition-all">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0">
                  <Image
                    src={inspector.avatarUrl}
                    alt={inspector.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1 leading-5">{inspector.name}</h4>
                  <p className="text-xs md:text-sm text-gray-600 font-normal leading-4 mt-0.5">{inspector.location}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs md:text-sm text-gray-600 font-normal leading-4 ">Total Earnings</p>
                <p className="text-sm  font-semibold text-gray-900 leading-5 mt-0.5">
                  ${inspector.totalEarnings}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Action Button */}
  <div className="px-4 md:px-6 pb-4">
        <button className="w-full mt-6 border-2 border-primaryColor hover:bg-blue-50 text-primaryColor font-normal text-sm py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer tracking-wide">
        View All
      </button>
  </div>
    </div>
  );
}