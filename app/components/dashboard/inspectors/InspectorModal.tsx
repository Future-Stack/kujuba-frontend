"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import {
  useGetInspectorByIdQuery,
  useApproveInspectorMutation,
  useRejectInspectorMutation,
  useSuspendInspectorMutation,
  useReactivateInspectorMutation,
} from "@/app/redux/features/inspectorApi";
import { toast } from "react-toastify";

// ─── types ───────────────────────────────────────────────────────────────────

export type InspectorStatus = "Active" | "Pending Review" | "Suspended" | "Rejected";

export interface InspectorCard {
  id: string;
  name: string;
  role: string;
  inspectionType: string;
  email: string;
  phone: string;
  status: InspectorStatus;
  avatarUrl: string;
  createdAt: number;
}

interface InspectorDetailModalProps {
  inspector: InspectorCard | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: InspectorStatus) => void;
}

// ─── style map ───────────────────────────────────────────────────────────────

const statusStyles: Record<InspectorStatus, string> = {
  Active:           "bg-green-100 text-green-700",
  "Pending Review": "bg-amber-100 text-amber-700",
  Suspended:        "bg-red-200 text-red-500",
  Rejected:         "bg-gray-100 text-gray-600",
};

// ─── modal detail skeleton ────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      {/* header */}
      <div className="flex items-center gap-4 pb-6 border-b border-[#F3F4F6]">
        <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/5" />
          <div className="h-3 bg-gray-100 rounded w-3/5" />
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-gray-100 rounded-full" />
            <div className="h-5 w-24 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
      {/* info grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#F9FAFB] rounded-lg px-3 py-2.5 space-y-2">
            <div className="h-2.5 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-full" />
          </div>
        ))}
      </div>
      {/* specializations */}
      <div className="space-y-2">
        <div className="h-2.5 bg-gray-200 rounded w-1/4" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>
      {/* performance */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-md" />
        ))}
      </div>
    </div>
  );
}

// ─── modal ────────────────────────────────────────────────────────────────────

export default function InspectorDetailModal({
  inspector,
  onClose,
  onStatusChange,
}: InspectorDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fetch full details only when a card is selected
  const { data: detailData, isLoading: detailLoading } = useGetInspectorByIdQuery(
    Number(inspector?.id),
    { skip: !inspector }
  );

  const detail = detailData?.data;

  // Mutations
  const [approveInspector, { isLoading: approving }] = useApproveInspectorMutation();
  const [rejectInspector,  { isLoading: rejecting  }] = useRejectInspectorMutation();
  const [suspendInspector, { isLoading: suspending }] = useSuspendInspectorMutation();
  const [reactivateInspector, { isLoading: reactivating }] = useReactivateInspectorMutation();

  const anyLoading = approving || rejecting || suspending || reactivating;

  // ── close handlers ──────────────────────────────────────────────────────────
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = inspector ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [inspector]);

  if (!inspector) return null;


  const handleApprove = async () => {
    try {
      await approveInspector(Number(inspector.id)).unwrap();
      toast.success(`${inspector.name} has been approved.`);
      onStatusChange(inspector.id, "Active");
    } catch {
      toast.error("Failed to approve inspector. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectInspector(Number(inspector.id)).unwrap();
      toast.success(`${inspector.name} has been rejected.`);
      onStatusChange(inspector.id, "Rejected");
    } catch {
      toast.error("Failed to reject inspector. Please try again.");
    }
  };

  const handleSuspend = async () => {
    try {
      await suspendInspector(Number(inspector.id)).unwrap();
      toast.success(`${inspector.name} has been suspended.`);
      onStatusChange(inspector.id, "Suspended");
    } catch {
      toast.error("Failed to suspend inspector. Please try again.");
    }
  };

  const handleReActivate = async () => {
    try {
      await reactivateInspector(Number(inspector.id)).unwrap();
      toast.success(`${inspector.name} has been reactivated.`);
      onStatusChange(inspector.id, "Active");
    } catch {
      toast.error("Failed to reactivate inspector. Please try again.");
    }
  };

  const initials = inspector.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative font-roboto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="p-6">
          {detailLoading ? (
            <DetailSkeleton />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 border-b border-[#F3F4F6] pb-6">
                <div className="relative w-14 h-14 shrink-0">
                  <div className="relative w-full h-full rounded-full overflow-hidden border border-gray-100 bg-purple-50 flex items-center justify-center">
                    {inspector.avatarUrl ? (
                      <Image src={inspector.avatarUrl} alt={inspector.name} fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-purple-600 font-bold text-sm">{initials}</span>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 font-sora leading-6">{inspector.name}</h2>
                  <p className="text-sm text-[#6B7280] font-roboto leading-5 mb-1.5">{inspector.email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full leading-4 ${statusStyles[inspector.status]}`}>
                      {inspector.status}
                    </span>
                    {detail?.reviews && (
                      <span className="text-xs text-[#D97706] bg-[#FFFBEB] px-2.5 py-0.5 font-medium rounded-full leading-4">
                        ⭐ {detail.reviews.average_rating} ({detail.reviews.total_reviews} reviews)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "PHONE",            value: detail?.phone ?? inspector.phone },
                  { label: "LOCATION",         value: detail?.location ?? "—" },
                  { label: "LICENSE NUMBER",   value: detail?.license_number ?? "—" },
                  { label: "LICENSE EXPIRY",   value: detail?.license_expiry ?? "—" },
                  { label: "INSURANCE EXPIRY", value: detail?.insurance_expiry ?? "—" },
                  { label: "MEMBER SINCE",     value: detail?.member_since ? new Date(detail.member_since).toLocaleDateString() : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F9FAFB] rounded-lg px-3 py-2.5">
                    <p className="text-[10px] font-semibold text-[#9CA3AF] leading-4 uppercase mb-1">{label}</p>
                    <p className="text-sm text-[#1F2937] font-medium leading-5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Specializations */}
              {detail?.specializations && detail.specializations.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase font-roboto leading-4 mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.specializations.map((s) => (
                      <span key={s} className="text-xs font-medium bg-[#5E65FF1A] text-[#5E65FF] leading-4 px-3 py-1 rounded-full font-roboto">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance */}
              {detail?.performance && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase font-roboto leading-4 mb-2">Performance</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#ECFDF5] rounded-md py-3 text-center">
                      <p className="text-xl font-bold font-sora leading-7 text-[#047857]">{detail.performance.completed}</p>
                      <p className="text-xs text-[#047857] mt-0.5">Completed</p>
                    </div>
                    <div className="bg-[#FEF2F2] rounded-md py-3 text-center">
                      <p className="text-xl font-bold font-sora leading-7 text-[#DC2626]">{detail.performance.cancelled}</p>
                      <p className="text-xs text-[#EF4444] mt-0.5">Cancelled</p>
                    </div>
                    <div className="bg-[#5E65FF1A] rounded-md py-3 text-center">
                      <p className="text-xl font-bold font-sora leading-7 text-[#5E65FF]">{detail?.total_earnings_formatted ?? "—"}</p>
                      <p className="text-xs text-[#5E65FF] mt-0.5">Total Earnings</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              {/* <div className="mb-6">
                <p className="text-xs font-semibold text-[#6B7280] uppercase font-roboto leading-4 mb-2">Documents</p>
                <div className="flex gap-2">
                  <button className="border border-[#E5E7EB] text-gray-700 hover:bg-gray-50 text-sm font-normal leading-4 font-roboto px-4 py-2 rounded-md transition-colors">
                    View License
                  </button>
                  <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-normal leading-4 font-roboto px-4 py-2 rounded-md transition-colors">
                    View Insurance
                  </button>
                </div>
              </div> */}

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-normal cursor-pointer leading-4 font-roboto px-4 py-2 rounded-[8px] transition-colors"
                >
                  Close
                </button>

                <div className="flex gap-2">
                  {inspector.status === "Active" && (
                    <button
                      onClick={handleSuspend}
                      disabled={anyLoading}
                      className="border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2.5 cursor-pointer rounded-md transition-colors disabled:opacity-60"
                    >
                      {suspending ? "Suspending..." : "Suspend"}
                    </button>
                  )}

                  {inspector.status === "Suspended" && (
                    <>
                      {/* <button
                        onClick={handleSuspend}
                        disabled={anyLoading}
                        className="border border-[#FECACA] text-[#DC2626] hover:bg-red-50 text-sm font-semibold cursor-pointer px-5 py-2.5 rounded-md transition-colors disabled:opacity-60"
                      >
                        {suspending ? "Suspending..." : "Suspend"}
                      </button> */}
                      <button
                        onClick={handleReActivate}
                        disabled={anyLoading}
                        className="bg-[#5E65FF] hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer leading-5 px-5 py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-60"
                      >
                        {reactivating ? "Activating..." : "Re-Activate"}
                      </button>
                    </>
                  )}

                  {inspector.status === "Pending Review" && (
                    <>
                      <button
                        onClick={handleReject}
                        disabled={anyLoading}
                        className="border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2.5 cursor-pointer rounded-md transition-colors disabled:opacity-60"
                      >
                        {rejecting ? "Rejecting..." : "Reject"}
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={anyLoading}
                        className="bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 cursor-pointer rounded-md transition-colors shadow-sm disabled:opacity-60"
                      >
                        {approving ? "Approving..." : "Approve"}
                      </button>
                    </>
                  )}

                  {inspector.status === "Rejected" && (
                    <button
                      onClick={handleReActivate}
                      disabled={anyLoading}
                      className="bg-[#5E65FF] hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 cursor-pointer rounded-md transition-colors shadow-sm disabled:opacity-60"
                    >
                      {reactivating ? "Activating..." : "Re-Activate"}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}