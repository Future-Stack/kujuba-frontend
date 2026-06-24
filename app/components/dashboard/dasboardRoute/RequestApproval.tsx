"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";
import { toast } from "react-toastify";
import { useApproveInspectorMutation, useRejectInspectorMutation } from "@/app/redux/features/inspectorApi";

type InspectorStatus = "Active" | "Rejected";

interface ApprovalRequest {
  id: number;
  name: string;
  profile: {
    phone: string | null;
    address: string | null;
    avatar: string | null;
  };
  total_earnings: number;
}

// ── INITIALS HELPER ───────────────────────────────

const getInitials = (name: string) => {
  if (!name) return "U";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return parts[0][0].toUpperCase();
};

// ── SKELETON ───────────────────────────────

function RequestApprovalSkeleton() {
  return (
    <div className="w-full bg-white rounded-[20px] border p-5 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 rounded mb-4" />

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div>
              <div className="h-3 w-28 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded-full" />
            <div className="w-9 h-9 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}

      <div className="h-10 w-full bg-gray-200 rounded mt-6" />
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────

export default function RequestApproval() {
  const { data, isLoading, isError,refetch } = useGetOverviewQuery();
const [approveInspector, { isLoading: isApproving }] = useApproveInspectorMutation();
const [rejectInspector, { isLoading: isRejecting }] = useRejectInspectorMutation();

const handleApprove = async (id: number) => {
  try {
    await approveInspector(id).unwrap();
    toast.success("Inspector approved successfully!");
      refetch();
  } catch (err: any) {
    toast.error(err?.data?.message || "Failed to approve inspector.");
  }
};

const handleReject = async (id: number) => {
  try {
    await rejectInspector(id).unwrap();
    toast.success("Inspector rejected.");
      refetch();
  } catch (err: any) {
    toast.error(err?.data?.message || "Failed to reject inspector.");
  }
};
  if (isLoading) return <RequestApprovalSkeleton />;

  if (isError || !data?.success) {
    return (
      <div className="w-full bg-white rounded-[20px] border p-4 text-red-500 text-center">
        Failed to load requests
      </div>
    );
  }

  const list: ApprovalRequest[] = data.data.top_inspectors || [];

  return (
    <div className="w-full h-full bg-white rounded-[20px] border flex flex-col justify-between font-roboto">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Request Approval
          </h3>

          <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-400 text-white text-[10px] font-bold flex items-center justify-center">
            {list.length}
          </span>
        </div>

        {/* LIST */}
        <div className="space-y-5 px-5 md:px-6 pt-5 pb-2">

          {list.map((req) => {
            const hasAvatar = !!req.profile?.avatar;

            return (
              <div
                key={req.id}
                className="flex items-center justify-between"
              >

                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">

                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0">

                    {hasAvatar ? (
                      <Image
                        src={req.profile.avatar!}
                        alt={req.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {getInitials(req.name)}
                      </div>
                    )}

                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {req.name}
                    </h4>

                    <p className="text-xs text-gray-500 truncate">
                      {req.profile?.address || "No address available"}
                    </p>
                  </div>

                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-2 shrink-0">

                  {/* APPROVE */}
                  <button 
                  onClick={() => handleApprove(req.id)}
                   disabled={isApproving || isRejecting}
                  className="w-9 h-9 rounded-full bg-green-50 hover:bg-green-100 flex items-center cursor-pointer justify-center transition">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="#16a34a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* REJECT */}
                  <button 
                  onClick={() => handleReject(req.id)}
                  disabled={isApproving || isRejecting}
                  className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 flex items-center cursor-pointer justify-center transition">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* FOOTER */}
      <div className="px-4 md:px-6 pb-4">
        <Link href="/dashboard/inspectors?tab=pending">
          <button className="w-full mt-6 border border-primaryColor text-primaryColor text-sm py-2 rounded-[12px] hover:bg-blue-50 cursor-pointer transition">
            View All
          </button>
        </Link>
      </div>

    </div>
  );
}