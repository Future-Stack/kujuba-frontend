"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, Building } from "lucide-react";
import { toast } from "react-toastify";
import {
  useScheduleClientReportMutation,
  useUpdateScheduleMutation,
  useGetClientReportsClientsListQuery,
  ClientReportScheduleItem,
} from "@/app/redux/features/clientReportApi";

type ScheduleReportModalProps = {
  open: boolean;
  onClose: () => void;
  clientId?: number | string;
  defaultFrequency?: string;
  defaultEmail?: string;
  clientName?: string;
  editingSchedule?: ClientReportScheduleItem | null;
};

function extractErrorMessage(error: any, fallbackMessage: string): string {
  if (error?.data?.errors && typeof error.data.errors === "object") {
    const messages = Object.values(error.data.errors).flat().join(" ");
    if (messages) return messages;
  }
  if (typeof error?.data?.message === "string") {
    return error.data.message;
  }
  if (typeof error?.message === "string") {
    return error.message;
  }
  return fallbackMessage;
}

export default function ScheduleReportModal({
  open,
  onClose,
  clientId,
  defaultFrequency = "weekly",
  defaultEmail = "",
  clientName = "",
  editingSchedule = null,
}: ScheduleReportModalProps) {
  const { data: clientsListRes } = useGetClientReportsClientsListQuery(undefined, {
    skip: !open,
  });
  const clientsList = clientsListRes?.data || [];

  const [selectedClientId, setSelectedClientId] = useState<number | string>(
    clientId || ""
  );
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [scheduleFrequency, setScheduleFrequency] = useState(
    defaultFrequency === "daily" || defaultFrequency === "weekly" || defaultFrequency === "monthly"
      ? defaultFrequency
      : "weekly"
  );
  const [dayOfWeek, setDayOfWeek] = useState<string>("monday");
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [sendTime, setSendTime] = useState<string>("09:00");
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("all");
  const [isActive, setIsActive] = useState<boolean>(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const [scheduleReport, { isLoading: isCreating }] = useScheduleClientReportMutation();
  const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      if (editingSchedule) {
        setSelectedClientId(editingSchedule.client_id || clientId || "");
        setRecipientEmail(
          editingSchedule.recipient_email || editingSchedule.email || defaultEmail
        );
        setScheduleFrequency(editingSchedule.frequency || "weekly");
        setDayOfWeek(editingSchedule.day_of_week || "mon");
        setDayOfMonth(editingSchedule.day_of_month ? Number(editingSchedule.day_of_month) : 1);
        setSelectedDate(
          editingSchedule.date || new Date().toISOString().split("T")[0]
        );
        setSendTime(editingSchedule.send_time || editingSchedule.time || "09:00");
        setReportStatusFilter(
          editingSchedule.inspection_status || editingSchedule.status || "all"
        );
        setIsActive(editingSchedule.is_enabled ?? editingSchedule.is_active ?? true);
      } else {
        setSelectedClientId(clientId || (clientsList.length > 0 ? clientsList[0].id : ""));
        setRecipientEmail(defaultEmail);
        if (defaultFrequency === "daily" || defaultFrequency === "weekly" || defaultFrequency === "monthly") {
          setScheduleFrequency(defaultFrequency);
        }
        setDayOfWeek("mon");
        setDayOfMonth(1);
        setSelectedDate(new Date().toISOString().split("T")[0]);
        setSendTime("09:00");
        setReportStatusFilter("all");
        setIsActive(true);
      }
    }
  }, [open, defaultEmail, defaultFrequency, editingSchedule, clientId, clientsList]);

  // Update recipient email automatically when client selection changes
  const handleClientChange = (idVal: string | number) => {
    setSelectedClientId(idVal);
    const found = clientsList.find((c) => String(c.id) === String(idVal));
    if (found?.email) {
      setRecipientEmail(found.email);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail.trim()) {
      toast.error("Please enter a recipient email address");
      return;
    }

    const finalClientId =
      selectedClientId && selectedClientId !== "all"
        ? Number(selectedClientId)
        : clientId
        ? Number(clientId)
        : clientsList.length > 0
        ? Number(clientsList[0].id)
        : undefined;

    const dayOfWeekAbbrMap: Record<string, string> = {
      monday: "mon",
      tuesday: "tue",
      wednesday: "wed",
      thursday: "thu",
      friday: "fri",
      saturday: "sat",
      sunday: "sun",
      mon: "mon",
      tue: "tue",
      wed: "wed",
      thu: "thu",
      fri: "fri",
      sat: "sat",
      sun: "sun",
    };

    const payload: any = {
      client_id: finalClientId,
      recipient_email: recipientEmail.trim(),
      email: recipientEmail.trim(),
      frequency: scheduleFrequency,
      send_time: sendTime,
      time: sendTime,
      inspection_status: reportStatusFilter,
      status: reportStatusFilter,
      is_enabled: isActive,
      is_active: isActive,
      timezone: "America/New_York",
    };

    if (scheduleFrequency === "weekly") {
      payload.day_of_week = dayOfWeekAbbrMap[dayOfWeek.toLowerCase()] || dayOfWeek;
    }

    if (scheduleFrequency === "monthly") {
      payload.day_of_month = Number(dayOfMonth);
      if (selectedDate) payload.date = selectedDate;
    }

    try {
      if (editingSchedule?.id) {
        const res = await updateSchedule({
          id: editingSchedule.id,
          body: payload,
        }).unwrap();
        toast.success(res?.message || "Schedule updated successfully!");
      } else {
        const res = await scheduleReport(payload).unwrap();
        toast.success(res?.message || `Automated ${scheduleFrequency} report scheduled successfully!`);
      }
      onClose();
    } catch (error: any) {
      const msg = extractErrorMessage(error, "Failed to save schedule");
      toast.error(msg);
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
        className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-sora font-bold text-gray-900">
                {editingSchedule ? "Edit Scheduled Report" : "Schedule Automated Report"}
              </h3>
              <p className="text-[11px] text-gray-500">
                Automatically generate and email inspection summary reports on a recurring schedule.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Client Select Dropdown */}
          <div>
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              Client Company *
            </label>
            <div className="relative">
              <select
                value={selectedClientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-indigo-600 transition-colors cursor-pointer bg-white font-medium"
              >
                {clientsList.length > 0 ? (
                  clientsList.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company_name || client.name} ({client.email})
                    </option>
                  ))
                ) : (
                  <option value="">All Corporate Clients</option>
                )}
              </select>
            </div>
          </div>

          {/* Recipient Email */}
          <div>
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              Recipient Email Address *
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="e.g. client@company.com"
              className="w-full border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-indigo-600 transition-colors font-medium"
              required
            />
          </div>

          {/* Frequency & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
                Schedule Frequency *
              </label>
              <select
                value={scheduleFrequency}
                onChange={(e) => setScheduleFrequency(e.target.value)}
                className="w-full border border-gray-200 text-gray-800 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-indigo-600 transition-colors cursor-pointer bg-white font-medium"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Send Time */}
            <div>
              <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
                Preferred Send Time (EST)
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={sendTime}
                  onChange={(e) => setSendTime(e.target.value)}
                  className="w-full border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Day of week selection (Only if Frequency is Weekly) */}
          {scheduleFrequency === "weekly" && (
            <div>
              <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
                Day of the Week
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {[
                  { id: "mon", label: "Mon" },
                  { id: "tue", label: "Tue" },
                  { id: "wed", label: "Wed" },
                  { id: "thu", label: "Thu" },
                  { id: "fri", label: "Fri" },
                  { id: "sat", label: "Sat" },
                  { id: "sun", label: "Sun" },
                ].map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setDayOfWeek(day.id)}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer border ${
                      dayOfWeek.toLowerCase().startsWith(day.id)
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Schedule: Calendar & Fixed Date / Day of Month Selection */}
          {scheduleFrequency === "monthly" && (
            <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold font-sora text-indigo-950 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  Select Fixed Monthly Date / Day
                </label>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100/60 px-2 py-0.5 rounded-full">
                  Day {dayOfMonth} of month
                </span>
              </div>

              {/* Specific Calendar Date Picker */}
              <div>
                <label className="block text-[11px] text-gray-600 font-medium mb-1">
                  Calendar Date Picker (Fix Date)
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (e.target.value) {
                      const dt = new Date(e.target.value);
                      if (!isNaN(dt.getDate())) {
                        setDayOfMonth(dt.getDate());
                      }
                    }
                  }}
                  className="w-full border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-600 bg-white"
                />
              </div>

              {/* Day of Month Quick Selector (1 to 31) */}
              <div>
                <label className="block text-[11px] text-gray-600 font-medium mb-1.5">
                  Or Pick Day of the Month (1 - 31)
                </label>
                <div className="grid grid-cols-7 gap-1 max-h-28 overflow-y-auto p-1.5 bg-white border border-gray-200 rounded-lg">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDayOfMonth(d)}
                      className={`py-1 text-[11px] font-semibold rounded transition-all cursor-pointer ${
                        dayOfMonth === d
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Inspection Status Filter Included */}
          <div>
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              Include Inspections with Status
            </label>
            <select
              value={reportStatusFilter}
              onChange={(e) => setReportStatusFilter(e.target.value)}
              className="w-full border border-gray-200 text-gray-800 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-indigo-600 transition-colors cursor-pointer bg-white font-medium"
            >
              <option value="all">All Statuses (Completed, Pending, In Progress)</option>
              <option value="completed">Completed Inspections Only</option>
              <option value="pending">Pending Inspections Only</option>
            </select>
          </div>

          {/* Active Schedule Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-bold text-gray-800 font-sora block">
                Enable Schedule Immediately
              </span>
              <span className="text-[11px] text-gray-500">
                Automated email delivery will start on the next scheduled cycle.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? "Saving..." : editingSchedule ? "Update Schedule" : "Save Schedule"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
