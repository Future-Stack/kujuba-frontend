/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  X, Calendar, Clock, Mail, Phone, MapPin, Home,
  ShieldCheck, UserCheck, UserCog, Download, CheckCircle,
  AlertOctagon, Loader2,
} from "lucide-react";
import InspectionPayment from "./PaymentInfo";
import InspectionReportMedia from "./InspectionReportMedia";
import ActivityTimeline from "./ActivityTimeLine";
import {
  useGetBookingDetailsQuery,
  useSuspendInspectorMutation,
  useMarkInspectionCompleteMutation,
} from "@/app/redux/features/inspectionApi";
import { toast } from "react-toastify";



interface Props {
  bookingId: number;
   assignStatus: string;
  columnTitle: string;
  inspectorId?: number | null; 
  onClose: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 py-1.5">
    <div className="w-4 h-4 shrink-0 mt-0.5">{icon}</div>
    <div className="flex flex-col">
      <span className="text-xs text-[#6A7282]">{label}</span>
      <span className="text-sm text-[#101828] font-medium">{value}</span>
    </div>
  </div>
);

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function formatTime(timeStr: string | null | undefined) {
  if (!timeStr) return "—";
  return timeStr;
}

// ─── Component ───────────────────────────────────────────────────────────────

const InspectionDetailsModal: React.FC<Props> = ({ bookingId, assignStatus, columnTitle,inspectorId, onClose }) => {
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmComplete, setConfirmComplete] = useState(false);

  // ── API ──────────────────────────────────────────────────────────────────
  const { data: bookingRes, isLoading } = useGetBookingDetailsQuery(bookingId);
  const [suspendInspector, { isLoading: suspending }] = useSuspendInspectorMutation();
  const [markComplete, { isLoading: completing }] = useMarkInspectionCompleteMutation();

  const d = bookingRes?.data;
console.log("Booking Details:", d);


console.log("assign_status =", d?.assign_status);
console.log("status =", d?.status);
  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleMarkComplete = async () => {
    if (!confirmComplete) { setConfirmComplete(true); return; }
    try {
      await markComplete(bookingId).unwrap();
      toast.success("Inspection marked as completed!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to mark complete.");
    } finally {
      setConfirmComplete(false);
    }
  };

const resolvedInspectorId: number | null = (d?.inspector as any)?.id ?? inspectorId ?? null;

const handleSuspend = async () => {
  if (!d?.inspector?.name) return;
  if (!confirmSuspend) { setConfirmSuspend(true); return; }

  if (!resolvedInspectorId) {
    toast.error("Inspector ID is missing — please close and reopen this card, then try again.");
    setConfirmSuspend(false);
    return;
  }

  try {
    await suspendInspector(resolvedInspectorId).unwrap();
    toast.success("Inspector suspended successfully!");
    console.log()
    onClose();
  } catch (err: any) {
    toast.error(err?.data?.message || "Failed to suspend inspector.");
    console.log(err)
  } finally {
    setConfirmSuspend(false);
  }
};

  const handleDownloadReport = () => {
    if (!d) return;

    // Build a simple text report from booking details
    const lines = [
      `INSPECTION REPORT`,
      `=================`,
      `Booking ID   : ${d.booking_id}`,
      `Title        : ${d.inspection_title}`,
      `Status       : ${d.status}`,
      `Urgent       : ${d.urgent_status ? "Yes" : "No"}`,
      `Scheduled    : ${formatDate(d.scheduled_date)} at ${formatTime(d.scheduled_time)}`,
      ``,
      `HOMEOWNER`,
      `---------`,
      `Name         : ${d.homeowner?.name ?? "—"}`,
      `Email        : ${d.homeowner?.email ?? "—"}`,
      `Phone        : ${d.homeowner?.phone ?? "—"}`,
      `Address      : ${d.homeowner?.address ?? "—"}`,
      `Property     : ${d.homeowner?.property_type ?? "—"} — ${d.homeowner?.property_size ?? "—"}`,
      ``,
      `INSPECTOR`,
      `---------`,
      `Name         : ${d.inspector?.name ?? "Not assigned"}`,
      `Email        : ${d.inspector?.email ?? "—"}`,
      `Phone        : ${d.inspector?.phone ?? "—"}`,
      `License      : ${d.inspector?.license_number ?? "—"}`,
      `Assigned On  : ${formatDate(d.inspector?.assigned_on)}`,
      ``,
      `PAYMENT`,
      `-------`,
      `Inspection Fee    : ${d.payment?.inspection_fee ?? "—"}`,
      `Urgent Fee        : ${d.payment?.urgent_fee ?? "—"}`,
      `Platform Comm.    : ${d.payment?.platform_commission ?? "—"}`,
      `Inspector Payout  : ${d.payment?.inspector_payout ?? "—"}`,
      `Method            : ${d.payment?.method ?? "—"}`,
      `Status            : ${d.payment?.status ?? "—"}`,
      `Paid On           : ${formatDate(d.payment?.paid_on)}`,
      ``,
      `NOTE`,
      `----`,
      d.note ?? "—",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = `inspection_report_${bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  // ── Derived display values ────────────────────────────────────────────────
  const status     = d?.status ?? "";
  const isCompleted = status === "completed";
  const isCanceled  = status === "cancelled" || status === "canceled";
  const isAssigned  = status === "assigned";
  const isPending   = status === "pending";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">

        {/* ── LOADING ── */}
        {isLoading && (
          <div className="flex items-center justify-center py-32 gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading details…</span>
          </div>
        )}

        {!isLoading && d && (
          <>
            {/* ── TOP HEADER ── */}
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg md:text-xl font-sora leading-7 font-semibold text-gray-900">
                    #{d.booking_id}
                  </span>

                  {/* Status badge */}
             {assignStatus === "assigned" && (
  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
     Assigned
  </span>
)}

{assignStatus=== "pending" && (
  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
    Pending
  </span>
)}

{assignStatus === "completed" && (
  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#008236] border border-[#B9F8CF]">
    Completed
  </span>
)}

{assignStatus === "cancelled" && (
  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">
    Cancelled
  </span>
)}
                  {d.urgent_status === 1 && (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#CA3500] border border-[#FFD6A8] flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" />
                      Urgent
                    </span>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-sora leading-8 text-gray-900 mb-2">
                {d.inspection_title}
              </h2>

              <div className="flex items-center gap-4 text-sm text-[#4A5565] font-normal leading-5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(d.scheduled_date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(d.scheduled_time)}
                </span>
              </div>
            </div>

            {/* ── BODY ── */}
            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* HOMEOWNER */}
                <div className="border border-[#F3F4F6] rounded-xl p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15.8327 17.5V15.8333C15.8327 14.9493 15.4815 14.1014 14.8564 13.4763C14.2312 12.8512 13.3834 12.5 12.4993 12.5H7.49935C6.61529 12.5 5.76745 12.8512 5.14233 13.4763C4.5172 14.1014 4.16602 14.9493 4.16602 15.8333V17.5" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.99935 9.16667C11.8403 9.16667 13.3327 7.67428 13.3327 5.83333C13.3327 3.99238 11.8403 2.5 9.99935 2.5C8.1584 2.5 6.66602 3.99238 6.66602 5.83333C6.66602 7.67428 8.1584 9.16667 9.99935 9.16667Z" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-base md:text-lg leading-7 font-semibold text-[#101828]">Homeowner Information</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                      {d.homeowner?.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) ?? "?"}
                    </div>
                    <div>
                      <p className="text-base font-semibold font-sora leading-7 text-gray-900">{d.homeowner?.name ?? "—"}</p>
                      <p className="text-sm text-[#4A5565] font-normal leading-5">Property Owner</p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <InfoRow icon={<Mail className="w-4 h-4 text-gray-400" />}  label="Email"         value={d.homeowner?.email ?? "—"} />
                    <InfoRow icon={<Phone className="w-4 h-4 text-gray-400" />} label="Phone"         value={d.homeowner?.phone ?? "—"} />
                    <InfoRow icon={<MapPin className="w-4 h-4 text-gray-400" />} label="Address"      value={d.homeowner?.address ?? "—"} />
                    <InfoRow icon={<Home className="w-4 h-4 text-gray-400" />}  label="Property Type" value={d.homeowner?.property_type ?? "—"} />
                    <InfoRow icon={<ShieldCheck className="w-4 h-4 text-gray-400" />} label="Property Size" value={d.homeowner?.property_size ?? "—"} />
                  </div>
                </div>

                {/* INSPECTOR */}
                <div className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-base md:text-lg leading-7 font-semibold text-[#101828]">Inspector Information</span>
                  </div>

                  {d.inspector?.name ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                          {d.inspector.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-base font-semibold font-sora leading-7 text-gray-900">{d.inspector.name}</p>
                            {d.inspector.onboarding_completed && (
                              <span className="flex items-center gap-0.5 text-xs font-semibold leading-4 text-[#008236] bg-[#F0FDF4] border border-[#B9F8CF] px-1.5 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#4A5565] font-normal leading-5">
                            {d.inspector.inspection_types?.join(", ") ?? "Inspector"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <InfoRow icon={<Mail className="w-4 h-4 text-gray-400" />}      label="Email"          value={d.inspector.email ?? "—"} />
                        <InfoRow icon={<Phone className="w-4 h-4 text-gray-400" />}     label="Phone"          value={d.inspector.phone ?? "—"} />
                        <InfoRow icon={<ShieldCheck className="w-4 h-4 text-gray-400" />} label="License"      value={d.inspector.license_number ?? "—"} />
                        <InfoRow icon={<UserCheck className="w-4 h-4 text-gray-400" />} label="Assigned On"   value={formatDate(d.inspector.assigned_on)} />
                        <InfoRow icon={<CheckCircle className="w-4 h-4 text-gray-400" />} label="Earnings"    value={d.inspector.earnings ?? "—"} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <UserCog className="w-8 h-8 text-gray-200 mb-2" />
                      <p className="text-sm text-gray-400">No inspector assigned yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-components — pass real data as needed */}
              <InspectionPayment
  category={d.inspection_title}
  scheduledDate={d.scheduled_date}
  scheduledTime={d.scheduled_time}
  notes={d.note}
  rescheduleHistory={d.reschedule_history}
  payment={d.payment}
/>
              <InspectionReportMedia
                report={
                  d.report
                    ? {
                      images: (d.report.media?.photos ?? []).map(
                        (path: string, idx: number) => ({
                          id: idx,
                          url: path.startsWith("http")
                            ? path
                            : `https://api.connecttoinspect.com/storage/${path}`,
                          alt: `Inspection photo ${idx + 1}`,
                        })
                      ),
                      pdf_url: d.report.report_file
                        ? d.report.report_file.startsWith("http")
                          ? d.report.report_file
                          : `https://api.connecttoinspect.com/storage/${d.report.report_file}`
                        : null,
                      file_name: `Inspection_Report_${d.booking_id}.${d.report.report_file?.split(".").pop() ?? "pdf"}`,
                      uploaded_at: d.report.uploaded_on ?? null,
                      status: d.report.status ?? null,
                    }
                    : null
                }
              />
              <ActivityTimeline timeline={d.timeline} />
            </div>

            {/* ── ACTION FOOTER ── */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">

              {/* Download Report */}
              {/* Download Report — only when completed */}
              {assignStatus === "completed" && (
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-base font-medium leading-5 px-3.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Report
                </button>
              )}

              {/* Mark as Completed — only when not already completed/canceled */}
              {/* {!isCompleted && !isCanceled && (
                <button
                  onClick={handleMarkComplete}
                  disabled={completing}
                  className={`flex items-center gap-1.5 border text-base font-medium leading-5 px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-60 ${
                    confirmComplete
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {completing
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <CheckCircle className="w-3.5 h-3.5" />
                  }
                  {confirmComplete ? "Confirm Complete?" : "Mark as Completed"}
                </button>
              )} */}

              {/* Suspend Inspector — only when inspector is assigned */}
              {/* {d.inspector?.name && !isCanceled && (
                <button
                  onClick={handleSuspend}
                  disabled={suspending}
                  className={`flex items-center gap-1.5 border text-base font-medium leading-5 px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-60 ${
                    confirmSuspend
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-red-200 text-red-500 hover:bg-red-50"
                  }`}
                >
                  {suspending
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <AlertOctagon className="w-3.5 h-3.5" />
                  }
                  {confirmSuspend ? "Confirm Suspend?" : "Suspend Inspector"}
                </button>
              )} */}

              <button
                onClick={onClose}
                className="ml-auto flex items-center gap-1.5 border border-gray-200 text-gray-600 text-base font-medium leading-5 px-3.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Close
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default InspectionDetailsModal;

