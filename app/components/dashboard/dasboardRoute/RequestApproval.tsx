"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
type InspectorStatus = "Active" | "Pending Review" | "Suspended" | "Rejected";

interface ApprovalRequest {
  id: string;
  name: string;
  role: string;
  inspectionType: string;
  avatarUrl: string;
  status: InspectorStatus;
}

const STATIC_PENDING: ApprovalRequest[] = [
  { id: "1", name: "Jonathan King",  role: "Licensed Inspector", inspectionType: "Four Point • Roof Inspection",      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", status: "Pending Review" },
  { id: "2", name: "Peter Brooks",   role: "Licensed Inspector", inspectionType: "Wind Mitigation • Flood Elevation", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80", status: "Pending Review" },
  { id: "3", name: "Cindy Mateo",    role: "Licensed Inspector", inspectionType: "Combined • Four Point",             avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", status: "Pending Review" },
  { id: "4", name: "Thomas Walsh",   role: "Licensed Inspector", inspectionType: "Roof Inspection • Combined",        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", status: "Pending Review" },
];

// ── Props (optional) ───────────────────────────────────────────────────────
interface Props {
  inspectors?: ApprovalRequest[];
  onStatusChange?: (id: string, status: InspectorStatus) => void;
}

export default function RequestApproval({ inspectors, onStatusChange }: Props) {

  const [localList, setLocalList] = useState<ApprovalRequest[]>(STATIC_PENDING);

  const isShared = !!inspectors && !!onStatusChange;

  const pendingList = isShared
    ? inspectors.filter((i) => i.status === "Pending Review")
    : localList;

  const handleAction = (id: string, newStatus: "Active" | "Rejected") => {
    if (isShared) {
      onStatusChange!(id, newStatus);
    } else {
      // Local mode: list থেকে সরিয়ে দাও
      setLocalList((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="w-full bg-white rounded-[20px] border border-gray-200 hover:shadow-sm flex flex-col font-roboto justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <h3 className="text-base md:text-lg font-bold text-gray-900 leading-5">
            Request Approval
          </h3>
          {pendingList.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-400 text-white text-[10px] font-bold">
              {pendingList.length}
            </span>
          )}
        </div>

        {/* List */}
        <div className="space-y-5 px-5 md:px-6 pt-5 pb-2 min-h-[80px]">
          {pendingList.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-gray-400 font-medium">No pending requests</p>
            </div>
          ) : (
            pendingList.map((req) => (
              <div key={req.id} className="flex items-center justify-between gap-2">
                {/* Avatar + Info */}
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
                    <h4 className="font-medium text-gray-900 text-sm leading-5 mb-0.5 truncate">
                      {req.name}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 font-normal leading-4 truncate">
                      {req.inspectionType}
                    </p>
                  </div>
                </div>

                {/* Approve / Reject */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* ✓ Approve */}
                  <button
                    onClick={() => handleAction(req.id, "Active")}
                    title="Approve"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#e8fbf0] hover:bg-[#d1f7e0] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.3335 7.99996L6.66683 11.3333L13.3335 4.66663" stroke="#01B664" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* ✗ Reject */}
                  <button
                    onClick={() => handleAction(req.id, "Rejected")}
                    title="Reject"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#fde8e8] hover:bg-[#fbd2d2] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4L12 12" stroke="#DC3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 pb-4">
        <Link href="/dashboard/inspectors?tab=pending">
          <button className="w-full mt-6 border border-primaryColor hover:bg-blue-50 text-primaryColor font-normal text-sm py-2 px-5 rounded-[12px] transition-all duration-200 cursor-pointer tracking-wide">
            View All
          </button>
        </Link>
      </div>
    </div>
  );
}