"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo } from "react";
import {
  FileText,
  Mail,
  Download,
  Filter,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import DatePicker from "@/app/components/ui/DatePicker";
import {
  useGetClientReportsClientsListQuery,
  useGenerateClientReportQuery,
  useDownloadClientReportPdfMutation,
  ClientReportItem,
} from "@/app/redux/features/clientReportApi";
import SendEmailModal from "./SendEmailModal";

export default function ClientReportsView() {
  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [frequency, setFrequency] = useState<string>("weekly");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("2026-09-01");
  const [endDate, setEndDate] = useState<string>("2026-09-13");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // RTK Query: Clients list
  const { data: clientsListRes, isLoading: loadingClients } =
    useGetClientReportsClientsListQuery();
  const clientsList = clientsListRes?.data || [];

  // Selected client object
  const currentClient = useMemo(() => {
    if (selectedClientId === "all") return null;
    return clientsList.find((c) => String(c.id) === String(selectedClientId));
  }, [clientsList, selectedClientId]);

  // RTK Query: Generated Report data
  const queryParams = useMemo(() => {
    return {
      client_id: selectedClientId === "all" ? undefined : selectedClientId,
      frequency,
      status: statusFilter,
      start_date: startDate,
      end_date: endDate,
    };
  }, [selectedClientId, frequency, statusFilter, startDate, endDate]);

  const {
    data: reportRes,
    isLoading: loadingReport,
    isFetching,
    refetch,
  } = useGenerateClientReportQuery(queryParams);

  const reportData = reportRes?.data;
  const reportsList: ClientReportItem[] = useMemo(() => {
    if (Array.isArray(reportData?.reports)) {
      return reportData.reports;
    }
    if (Array.isArray(reportData)) {
      return reportData;
    }
    if (Array.isArray((reportRes as any)?.reports)) {
      return (reportRes as any).reports;
    }
    return [];
  }, [reportData, reportRes]);

  // PDF Download Handler
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://api.connecttoinspect.com/api/v1";

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      const queryParams = new URLSearchParams();
      if (selectedClientId !== "all" && selectedClientId) {
        queryParams.append("client_id", String(selectedClientId));
      } else if (clientsList.length > 0) {
        // Fallback to first client if "all" is selected and client_id is required
        queryParams.append("client_id", String(clientsList[0].id));
      }

      if (frequency) queryParams.append("frequency", frequency);
      if (statusFilter) queryParams.append("status", statusFilter);
      if (startDate) queryParams.append("start_date", startDate);
      if (endDate) queryParams.append("end_date", endDate);

      const downloadUrl = `${baseUrl}/admin/client-reports/download-pdf?${queryParams.toString()}`;

      const res = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        let errorMsg = "Failed to download PDF report";
        try {
          const errJson = await res.json();
          errorMsg = errJson?.message || errJson?.error || errorMsg;
        } catch {
          // Response was not JSON
        }
        toast.error(errorMsg);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `client-report-${selectedClientId || "summary"}-${frequency}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF report downloaded successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to download PDF report");
    } finally {
      setIsDownloading(false);
    }
  };

  // Metrics summary values
  const totalBookings = reportData?.total_bookings ?? reportsList.length ?? 0;
  const completedReady =
    reportData?.completed_ready ??
    reportsList.filter((r) => r.status?.toLowerCase() === "completed").length ??
    0;
  const inProgress =
    reportData?.in_progress ??
    reportsList.filter(
      (r) =>
        r.status?.toLowerCase() === "started" ||
        r.status?.toLowerCase() === "in_progress" ||
        r.status?.toLowerCase() === "assigned"
    ).length ??
    0;
  const pendingSchedule =
    reportData?.pending_schedule ??
    reportsList.filter((r) => r.status?.toLowerCase() === "pending").length ??
    0;
  const completionRate =
    reportData?.completion_rate ??
    (totalBookings > 0
      ? `${Math.round((completedReady / totalBookings) * 100)}%`
      : "0%");

  return (
    <div className="w-full font-roboto antialiased">
      {/* Controls & Filter Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <h3 className="font-sora font-bold text-gray-900 text-sm">
              Report Filter Parameters
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-gray-200"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-indigo-600" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Client Select */}
          <div>
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              Client Company
            </label>
            <div className="relative">
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors font-medium text-gray-800 cursor-pointer"
              >
                <option value="all">All Corporate Clients</option>
                {clientsList.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company_name || client.name} ({client.email})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Frequency Select */}
          <div>
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              Report Frequency
            </label>
            <div className="relative">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors font-medium text-gray-800 cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Range</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              Inspection Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors font-medium text-gray-800 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="started">Started / In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Start Date Picker */}
          <div>
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              Start Date
            </label>
            <DatePicker
              value={startDate}
              onChange={(val) => setStartDate(val)}
              placeholder="Start Date"
            />
          </div>

          {/* End Date Picker */}
          <div>
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              End Date
            </label>
            <DatePicker
              value={endDate}
              onChange={(val) => setEndDate(val)}
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs px-4 py-2.5 rounded-lg border border-indigo-200 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email Report</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "Downloading PDF..." : "Download PDF Report"}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Container (Styled like the actual generated PDF report) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm overflow-hidden">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b-2 border-indigo-600 gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold font-sora text-indigo-700 tracking-tight">
              ConnectToInspect
            </h2>
            <p className="text-[11px] text-gray-500 font-medium">
              Home Inspection Management & Reporting Platform
            </p>
          </div>

          <div className="sm:text-right">
            <h3 className="text-sm font-bold font-sora text-gray-900">
              Client Inspection Summary Report
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5" suppressHydrationWarning>
              Generated: {new Date().toISOString().slice(0, 10)} (EST)
            </p>
          </div>
        </div>

        {/* Client Metadata Banner Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-xs grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-semibold w-28 shrink-0">Client / Company:</span>
            <span className="font-bold text-gray-900 truncate">
              {currentClient?.company_name || reportData?.client_info?.company_name || "N/A"}{" "}
              ({currentClient?.name || reportData?.client_info?.name || "All Clients"})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-semibold w-28 shrink-0">Report Period:</span>
            <span className="font-bold text-gray-900">
              {reportData?.period_label || `${frequency.toUpperCase()} (${startDate} to ${endDate})`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-semibold w-28 shrink-0">Client Type:</span>
            <span className="font-bold text-indigo-700 capitalize">
              {(currentClient?.client_type || reportData?.client_info?.client_type || "Insurance Company").replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-semibold w-28 shrink-0">Client Email:</span>
            <span className="font-bold text-gray-900 truncate">
              {currentClient?.email || reportData?.client_info?.email || "N/A"}
            </span>
          </div>
        </div>

        {/* Summary Metric Cards (5 Columns Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
            <span className="text-lg font-bold text-slate-800 font-sora block">
              {totalBookings}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Bookings
            </span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/60 p-3.5 rounded-xl text-center">
            <span className="text-lg font-bold text-emerald-700 font-sora block">
              {completedReady}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Completed & Ready
            </span>
          </div>

          <div className="bg-blue-50/60 border border-blue-200/60 p-3.5 rounded-xl text-center">
            <span className="text-lg font-bold text-blue-700 font-sora block">
              {inProgress}
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              In Progress
            </span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-xl text-center">
            <span className="text-lg font-bold text-amber-700 font-sora block">
              {pendingSchedule}
            </span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
              Pending Schedule
            </span>
          </div>

          <div className="bg-purple-50/60 border border-purple-200/60 p-3.5 rounded-xl text-center">
            <span className="text-lg font-bold text-purple-700 font-sora block">
              {completionRate}
            </span>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
              Completion Rate
            </span>
          </div>
        </div>

        {/* Homeowner Inspection Status & Reports Table */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-800 font-sora mb-3">
            Homeowner Inspection Status & Reports ({reportsList.length} Records)
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">REF #</th>
                  <th className="py-3 px-4">HOMEOWNER</th>
                  <th className="py-3 px-4">PROPERTY ADDRESS</th>
                  <th className="py-3 px-4">INSPECTION TYPE</th>
                  <th className="py-3 px-4">INSPECTOR</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">STATUS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {loadingReport ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      <div className="inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Loading report records...
                    </td>
                  </tr>
                ) : reportsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400 font-medium">
                      No inspection bookings recorded for this client in the selected date range.
                    </td>
                  </tr>
                ) : (
                  reportsList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-indigo-700">
                        {item.ref_no || item.booking_uid || `#${item.id || idx + 1}`}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {item.homeowner_name || item.homeowner?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">
                        {item.property_address || item.address || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {item.inspection_type || "Standard Inspection"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.inspector_name || item.inspector?.name || "Unassigned"}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-medium">
                        {item.date || item.scheduled_date || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.status?.toLowerCase() === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status?.toLowerCase() === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 text-[10px] text-gray-400 flex items-center justify-between flex-wrap gap-2">
          <span>ConnectToInspect + automated reporting</span>
          <span>For inquiries contact: david@connecttoinspect.com</span>
        </div>
      </div>

      {/* Send Email Modal */}
      <SendEmailModal
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        clientId={selectedClientId === "all" ? undefined : selectedClientId}
        frequency={frequency}
        startDate={startDate}
        endDate={endDate}
        status={statusFilter}
        defaultEmail={currentClient?.email || ""}
      />
    </div>
  );
}
