"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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

interface InspectorDetail extends InspectorCard {
  location: string;
  licenseNumber: string;
  licenseExpiry: string;
  insuranceExpiry: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  completedCount: number;
  cancelledCount: number;
  totalEarnings: string;
}

interface InspectorDetailModalProps {
  inspector: InspectorCard | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: InspectorStatus) => void; // ✅ status change handler
}

function getDetail(inspector: InspectorCard): InspectorDetail {
  return {
    ...inspector,
    location: "Gainesville, FL",
    licenseNumber: "FL-INS-22491",
    licenseExpiry: "2026-10-03",
    insuranceExpiry: "2026-05-19",
    memberSince: "2024-03-11",
    rating: 2.8,
    reviewCount: 41,
    specializations: ["Roof", "Wind Mitigation"],
    completedCount: 89,
    cancelledCount: 18,
    totalEarnings: "$18.6K",
  };
}

const statusStyles: Record<InspectorStatus, string> = {
  Active:           "bg-green-100 text-green-700",
  "Pending Review": "bg-amber-100 text-amber-700",
  Suspended:        "bg-red-200 text-red-500",
  Rejected:         "bg-gray-100 text-gray-600",
};

export default function InspectorDetailModal({ inspector, onClose, onStatusChange }: InspectorDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (inspector) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [inspector]);

  if (!inspector) return null;

  const detail = getDetail(inspector);

  // ✅ Action handlers — call onStatusChange then close modal
  const handleSuspend = () => {
    onStatusChange(inspector.id, "Suspended");
    onClose();
  };

  const handleReActivate = () => {
    onStatusChange(inspector.id, "Active");
    onClose();
  };

  const handleApprove = () => {
    onStatusChange(inspector.id, "Active");
    onClose();
  };

  const handleReject = () => {
    onStatusChange(inspector.id, "Rejected");
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative font-roboto">

        {/* X close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 border-b border-[#F3F4F6] pb-6">
            <div className="relative w-14 h-14 shrink-0">
              <div className="w-full h-full rounded-full border border-gray-100">
                <Image src={inspector.avatarUrl} alt={inspector.name} fill className="object-cover" unoptimized />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-sora leading-6">{inspector.name}</h2>
              <p className="text-sm text-[#6B7280] font-roboto leading-5 mb-1.5">{inspector.email}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full leading-4  ${statusStyles[inspector.status]}`}>
                  {inspector.status}
                </span>
                <span className="text-xs text-[#D97706] bg-[#FFFBEB] px-2.5 py-0.5 font-medium rounded-full leading-4">
                  ⭐ {detail.rating} ({detail.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "PHONE",            value: detail.phone },
              { label: "LOCATION",         value: detail.location },
              { label: "LICENSE NUMBER",   value: detail.licenseNumber },
              { label: "LICENSE EXPIRY",   value: detail.licenseExpiry },
              { label: "INSURANCE EXPIRY", value: detail.insuranceExpiry },
              { label: "MEMBER SINCE",     value: detail.memberSince },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#F9FAFB] rounded-lg px-3 py-2.5">
                <p className="text-[10px] font-semibold text-[#9CA3AF] leading-4 uppercase mb-1">{label}</p>
                <p className="text-sm text-[#1F2937] font-medium leading-5">{value}</p>
              </div>
            ))}
          </div>

          {/* Specializations */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-[#6B7280] uppercase font-roboto leading-4  mb-2">Specializations</p>
            <div className="flex flex-wrap gap-2">
              {detail.specializations.map((s) => (
                <span key={s} className="text-xs font-medium bg-[#5E65FF1A] text-[#5E65FF] leading-4 px-3 py-1 rounded-full font-roboto ">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-[#6B7280] uppercase font-roboto leading-4 mb-2">Performance</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#ECFDF5] rounded-xl py-3 text-center ">
                <p className="text-xl font-bold font-sora leading-7 text-[#047857]">{detail.completedCount}</p>
                <p className="text-xs text-[#047857] mt-0.5">Completed</p>
              </div>
              <div className="bg-[#FEF2F2] rounded-xl py-3 text-center ">
                <p className="text-xl font-bold font-sora leading-7 text-[#DC2626]">{detail.cancelledCount}</p>
                <p className="text-xs text-[#EF4444] mt-0.5">Cancelled</p>
              </div>
              <div className="bg-[#5E65FF1A] rounded-xl py-3 text-center ">
                <p className="text-xl font-bold font-sora leading-7 text-[#5E65FF]">{detail.totalEarnings}</p>
                <p className="text-xs text-[#5E65FF] mt-0.5">Total Earnings</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#6B7280] uppercase font-roboto leading-4  mb-2">Documents</p>
            <div className="flex gap-2">
              <button className="border border-[#E5E7EB] text-gray-700 hover:bg-gray-50 text-sm font-normal leading-4 font-roboto px-4 py-2 rounded-xl transition-colors">
                View License
              </button>
              <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-normal leading-4 font-roboto px-4 py-2 rounded-xl transition-colors">
                View Insurance
              </button>
            </div>
          </div>

          {/* Footer Buttons — change based on current status */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-normal cursor-pointer leading-4 font-roboto px-4 py-2 rounded-xl transition-colors"
            >
              Close
            </button>

            <div className="flex gap-2">
              {/* ✅ Active → can Suspend */}
              {inspector.status === "Active" && (
                <button
                  onClick={handleSuspend}
                  className="border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2.5 cursor-pointer rounded-xl transition-colors"
                >
                  Suspend
                </button>
              )}

              {/* ✅ Suspended → can Suspend again or Re-Activate */}
              {inspector.status === "Suspended" && (
                <>
                  <button
                    onClick={handleSuspend}
                    className="border border-[#FECACA] text-[#DC2626] hover:bg-red-50 text-sm font-semibold leaidng-5 cursor-pointer px-5 py-2.5 rounded-xl transition-colors"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={handleReActivate}
                    className="bg-[#5E65FF] hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer leading-5 px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm"
                  >
                    Re-Activate
                  </button>
                </>
              )}

              {/* ✅ Pending Review → can Reject or Approve */}
              {inspector.status === "Pending Review" && (
                <>
                  <button
                    onClick={handleReject}
                    className="border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2.5 cursor-pointer rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 cursor-pointer rounded-xl transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                </>
              )}

              {/* ✅ Rejected → can Re-Activate */}
              {inspector.status === "Rejected" && (
                <button
                  onClick={handleReActivate}
                  className="bg-[#5E65FF] hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 cursor-pointer rounded-xl transition-colors shadow-sm"
                >
                  Re-Activate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}