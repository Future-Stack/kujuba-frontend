"use client";

import React from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";

interface ApprovalRequest {
  id: string;
  name: string;
  tags: string[];
  avatarUrl: string;
}

const requests: ApprovalRequest[] = [
  { id: "1", name: "Jonathan King", tags: ["Four Point", "Roof Inspection"], avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80" },
  { id: "2", name: "Peter Brooks", tags: ["Wind Mitigation", "Flood Elevation"], avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" },
  { id: "3", name: "Cindy Mateo", tags: ["Combined", "Four Point"], avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
  { id: "4", name: "Thomas Walsh", tags: ["Roof Inspection", "Combined"], avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
];

export default function RequestApproval() {
  return (
    <div className="w-full bg-white rounded-[28px] border border-gray-100 font-roboto  shadow-sm flex flex-col justify-between ">
      <div>
        {/* Card Header */}
        <h3 className="text-base md:text-lg font-bold text-gray-900  p-5 md:p-6 leading-5.5 m px-1 border-b border-gray-100 pb-4">Request Approval</h3>

        {/* List Body */}
        <div className="space-y-6 px-5 md:px-6 pt-4">
          {requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0">
                  <Image
                    src={req.avatarUrl}
                    alt={req.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm  leading-5 mb-1">{req.name}</h4>
                  <p className="text-xs md:text-sm text-gray-600 font-normal leading-4 mt-0.5">
                    {req.tags.join(" • ")}
                  </p>
                </div>
              </div>

              {/* Action Buttons Container */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Accept Button */}
                <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#e8fbf0] hover:bg-[#d1f7e0] text-[#09BD3C] flex items-center justify-center transition-colors">
                  <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
                </button>
                {/* Decline Button */}
                <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#fde8e8] hover:bg-[#fbd2d2] text-[#dc2626] flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

       <div className="px-4 md:px-6 pb-4">
        <button className="w-full mt-6 border-2 border-primaryColor hover:bg-blue-50 text-primaryColor font-normal text-sm py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer tracking-wide">
        View All
      </button>
  </div>

    </div>
  );
}