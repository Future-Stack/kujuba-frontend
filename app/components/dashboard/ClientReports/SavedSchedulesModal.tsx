"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
  Power,
  RefreshCw,
  Mail,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetSchedulesQuery,
  useToggleScheduleStatusMutation,
  useDeleteScheduleMutation,
  ClientReportScheduleItem,
} from "@/app/redux/features/clientReportApi";

type SavedSchedulesModalProps = {
  open: boolean;
  onClose: () => void;
  onEditSchedule: (schedule: ClientReportScheduleItem) => void;
};

export default function SavedSchedulesModal({
  open,
  onClose,
  onEditSchedule,
}: SavedSchedulesModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, refetch } = useGetSchedulesQuery(undefined, {
    skip: !open,
  });

  const [toggleStatus, { isLoading: isToggling }] = useToggleScheduleStatusMutation();
  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteScheduleMutation();

  const rawData = data?.data ?? data;
  const rawList =
    Array.isArray(rawData)
      ? rawData
      : Array.isArray((rawData as any)?.schedules)
      ? (rawData as any).schedules
      : Array.isArray((rawData as any)?.data)
      ? (rawData as any).data
      : Array.isArray((data as any)?.schedules)
      ? (data as any).schedules
      : Array.isArray(data)
      ? data
      : [];

  const schedules: ClientReportScheduleItem[] = Array.isArray(rawList) ? rawList : [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleToggle = async (id: number) => {
    try {
      const res = await toggleStatus(id).unwrap();
      toast.success(res?.message || "Schedule status toggled!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle schedule status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this automated schedule?")) {
      return;
    }
    try {
      const res = await deleteSchedule(id).unwrap();
      toast.success(res?.message || "Schedule deleted successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete schedule");
    }
  };

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
        className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl border border-gray-100 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-sora font-bold text-gray-900">
                Automated Client Report Schedules
              </h3>
              <p className="text-xs text-gray-500">
                View, edit, toggle, or delete all configured recurring report schedules.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
              title="Refresh schedules"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {isLoading || isFetching ? (
            <div className="text-center py-12 text-gray-400 text-sm font-medium">
              Loading schedules...
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-gray-200">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">No active schedules saved yet</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Click &quot;Schedule Automated Report&quot; to create a new recurring schedule.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50/70">
                    <th className="py-2.5 px-3">Recipient Email</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Schedule Detail</th>
                    <th className="py-2.5 px-3">Send Time</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{s.recipient_email || s.email}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="capitalize font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                          {s.frequency}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-600">
                        {s.frequency === "weekly" ? (
                          <span className="capitalize">Every {s.day_of_week || "Mon"}</span>
                        ) : s.frequency === "monthly" ? (
                          <span>
                            {s.day_of_month ? `Day ${s.day_of_month} of month` : s.date ? `Date: ${s.date}` : "1st of month"}
                          </span>
                        ) : (
                          <span>Every Day</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{s.send_time || s.time || "09:00"} EST</span>
                      </td>

                      <td className="py-3 px-3">
                        {(() => {
                          const active = s.is_enabled ?? s.is_active ?? true;
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                active
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : "bg-gray-100 text-gray-500 border border-gray-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  active ? "bg-emerald-500" : "bg-gray-400"
                                }`}
                              />
                              {active ? "Active" : "Disabled"}
                            </span>
                          );
                        })()}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Active Button */}
                          <button
                            onClick={() => handleToggle(s.id)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              s.is_active
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                            }`}
                            title={s.is_active ? "Disable Schedule" : "Enable Schedule"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              onEditSchedule(s);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                            title="Edit Schedule"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                            title="Delete Schedule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
