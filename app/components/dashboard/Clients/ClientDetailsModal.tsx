"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { X, Building, Mail, Phone, MapPin, Calendar, CheckCircle2, Clock, Ban, Trash2, Link2 } from "lucide-react";
import { ClientType } from "@/app/redux/features/clientApi";

type ClientDetailsModalProps = {
  client: ClientType | null;
  onClose: () => void;
  onSuspend: (id: number) => void;
  onUnsuspend: (id: number) => void;
  onDelete: (id: number) => void;
  onLinkBookings: (client: ClientType) => void;
};

export default function ClientDetailsModal({
  client,
  onClose,
  onSuspend,
  onUnsuspend,
  onDelete,
  onLinkBookings,
}: ClientDetailsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!client) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [client, onClose]);

  if (!client) return null;

  const fullName = client.full_name || `${client.first_name || ""} ${client.last_name || ""}`.trim();
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = client.status === "active";
  const isSuspended = client.status === "suspended";

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-roboto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-sora font-bold text-gray-900">
              Client Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl mb-6 border border-indigo-100/50">
          <div className="relative w-16 h-16 shrink-0">
            {client.image ? (
              <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white shadow-sm">
                <Image
                  src={client.image}
                  alt={fullName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-full bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                {initials || "CL"}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                isActive
                  ? "bg-emerald-500"
                  : isSuspended
                  ? "bg-rose-500"
                  : "bg-amber-500"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-gray-900 text-base truncate">
                {fullName}
              </h4>
              <span
                className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-md ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : isSuspended
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {client.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-indigo-600 mt-0.5 truncate">
              {client.company_name}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
              Type: {client.client_type?.replace("_", " ")}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <span className="text-xs text-gray-500 font-medium block">Total</span>
            <span className="text-lg font-bold text-gray-900 font-sora">
              {client.total_inspections ?? 0}
            </span>
          </div>
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/60 text-center">
            <span className="text-xs text-emerald-700 font-medium block">Completed</span>
            <span className="text-lg font-bold text-emerald-800 font-sora">
              {client.completed_inspections ?? 0}
            </span>
          </div>
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100/60 text-center">
            <span className="text-xs text-amber-700 font-medium block">Pending</span>
            <span className="text-lg font-bold text-amber-800 font-sora">
              {client.pending_inspections ?? 0}
            </span>
          </div>
          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100/60 text-center">
            <span className="text-xs text-blue-700 font-medium block">In Progress</span>
            <span className="text-lg font-bold text-blue-800 font-sora">
              {client.in_progress_inspections ?? 0}
            </span>
          </div>
        </div>

        {/* Contact Info List */}
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 mb-6 text-sm">
          <div className="p-3.5 flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-500 w-24 shrink-0 font-medium">Email:</span>
            <span className="text-gray-900 font-medium truncate">{client.email}</span>
          </div>
          <div className="p-3.5 flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-500 w-24 shrink-0 font-medium">Phone:</span>
            <span className="text-gray-900 font-medium">{client.phone || "N/A"}</span>
          </div>
          <div className="p-3.5 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-500 w-24 shrink-0 font-medium">Address:</span>
            <span className="text-gray-900 font-medium truncate">{client.address || "N/A"}</span>
          </div>
          <div className="p-3.5 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-500 w-24 shrink-0 font-medium">Created At:</span>
            <span className="text-gray-900 font-medium">{client.created_at || "N/A"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLinkBookings(client);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Link2 className="w-4 h-4" />
            Link Bookings
          </button>

          <div className="flex items-center gap-2">
            {isActive ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSuspend(client.id);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                Suspend
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onUnsuspend(client.id);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Unsuspend
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(client.id);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
