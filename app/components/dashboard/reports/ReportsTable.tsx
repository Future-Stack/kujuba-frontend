"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Download, Eye, Star, Trash2 } from "lucide-react";

type ReportStatus = "Complete" | "Pending" | "Started" | "Archived";

interface InspectionReport {
  id: string;
  user: {
    name: string;
    location: string;
    avatar?: string;
    initials?: string;
  };
  inspectionId: string;
  reportId: string;
  inspectorEmail: string;
  reportDetails: {
    text: string;
    subText?: string;
    isSubmitted: boolean;
  };
  createdDate: string;
  status: ReportStatus;
}

const seed: InspectionReport[] = [
  { id: "1", user: { name: "Brian Thompson", location: "Florida", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "brian@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "24 Dec 2025", status: "Complete" },
  { id: "2", user: { name: "Florence Haith", location: "Florida", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "florence@example.com", reportDetails: { text: "Not Submitted Yet", isSubmitted: false }, createdDate: "10 Dec 2025", status: "Pending" },
  { id: "3", user: { name: "Jerry Palmer", location: "Florida", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "jerry@example.com", reportDetails: { text: "Not Submitted Yet", isSubmitted: false }, createdDate: "27 Nov 2025", status: "Pending" },
  { id: "4", user: { name: "Mark Brainerd", location: "Florida", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "mark@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "27 Nov 2025", status: "Complete" },
  { id: "5", user: { name: "Roy Thomas", location: "Florida", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "roy@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "06 Nov 2025", status: "Complete" },
  { id: "6", user: { name: "Alisia Chen", location: "Florida", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "alisia@example.com", reportDetails: { text: "Not Submitted Yet", isSubmitted: false }, createdDate: "25 Oct 2025", status: "Started" },
  { id: "7", user: { name: "Kelly Myers", location: "Florida", initials: "KM" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "kelly@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "14 Oct 2025", status: "Complete" },
  { id: "8", user: { name: "James Walton", location: "Florida", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "james@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "03 Oct 2025", status: "Archived" },
];

// ── Download single row as CSV ─────────────────────────────────────────────
function downloadRowCSV(row: InspectionReport) {
  const headers = ["User Name", "Location", "Inspection ID", "Report ID", "Inspector Email", "Report Details", "Created Date", "Status"];
  const values = [
    row.user.name, row.user.location, row.inspectionId, row.reportId,
    row.inspectorEmail, row.reportDetails.text, row.createdDate, row.status,
  ];
  const csv =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), values.map((v) => `"${v}"`).join(",")].join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", `Report_${row.reportId}_${row.user.name.replace(/\s+/g, "_")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ── Print / PDF preview ────────────────────────────────────────────────────
function printRowPDF(row: InspectionReport) {
  const statusColor =
    row.status === "Complete" ? "#10B981"
    : row.status === "Pending" ? "#F87171"
    : row.status === "Started" ? "#F59E0B"
    : "#94A3B8";
  const statusBg =
    row.status === "Complete" ? "#E6F9F0"
    : row.status === "Pending" ? "#FEF2F2"
    : row.status === "Started" ? "#FFFBEB"
    : "#F1F5F9";

  const win = window.open("", "_blank", "width=820,height=650");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="utf-8"/>
    <title>Inspection Report – ${row.reportId}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Segoe UI',Helvetica,Arial,sans-serif;background:#fff;color:#111;padding:48px}
      .header{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:20px;margin-bottom:32px}
      .header h1{font-size:22px;font-weight:700;letter-spacing:-.5px}
      .badge{display:inline-block;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:700;background:${statusBg};color:${statusColor}}
      .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:14px}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 40px;margin-bottom:32px}
      .field label{display:block;font-size:11px;color:#888;margin-bottom:3px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
      .field span{font-size:14px;font-weight:500;color:#111}
      .highlight{background:#F5F6FA;border-radius:10px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:32px}
      .highlight .lbl{font-size:13px;color:#555;font-weight:600}
      .highlight .val{font-size:20px;font-weight:800;color:#111}
      .footer{border-top:1px solid #eee;padding-top:16px;font-size:11px;color:#aaa;text-align:center}
      @media print{body{padding:32px}}
    </style></head><body>
    <div class="header">
      <div>
        <h1>Inspection Report</h1>
        <div style="margin-top:6px;display:flex;align-items:center;gap:8px">
          <span style="font-size:13px;color:#555">${row.reportId} &nbsp;·&nbsp; ${row.inspectionId}</span>
          <span class="badge">${row.status === "Pending" ? "Not Submitted" : row.status}</span>
        </div>
      </div>
      <div style="text-align:right;font-size:13px">
        <div style="font-weight:600;color:#111">${row.user.name}</div>
        <div style="margin-top:4px;color:#666">${row.user.location}</div>
        <div style="margin-top:4px;color:#666">Created: ${row.createdDate}</div>
      </div>
    </div>
    <div class="highlight">
      <span class="lbl">Report Details</span>
      <div style="text-align:right">
        <div class="val">${row.reportDetails.text}</div>
        ${row.reportDetails.subText ? `<div style="font-size:12px;color:#888;margin-top:4px">${row.reportDetails.subText}</div>` : ""}
      </div>
    </div>
    <p class="section-title">Report Information</p>
    <div class="grid">
      <div class="field"><label>Inspector Email</label><span>${row.inspectorEmail}</span></div>
      <div class="field"><label>Created Date</label><span>${row.createdDate}</span></div>
      <div class="field"><label>Inspection ID</label><span>${row.inspectionId}</span></div>
      <div class="field"><label>Report ID</label><span>${row.reportId}</span></div>
      <div class="field"><label>Location</label><span>${row.user.location}</span></div>
      <div class="field"><label>Status</label><span class="badge">${row.status === "Pending" ? "Not Submitted" : row.status}</span></div>
    </div>
    <div class="footer">Computer-generated report · No signature required</div>
    <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
  </body></html>`);
  win.document.close();
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ReportsTable() {
  const [activeFilter, setActiveFilter] = useState<"All" | ReportStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<InspectionReport[]>(seed);
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  const counts = useMemo(() => ({
    All: reports.length,
    Complete: reports.filter((r) => r.status === "Complete").length,
    Pending: reports.filter((r) => r.status === "Pending").length,
    Started: reports.filter((r) => r.status === "Started").length,
    Archived: reports.filter((r) => r.status === "Archived").length,
  }), [reports]);

  const filteredReports = useMemo(() => {
    let result = [...reports];
    if (activeFilter !== "All") result = result.filter((r) => r.status === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.user.name.toLowerCase().includes(q) ||
          r.inspectionId.toLowerCase().includes(q) ||
          r.inspectorEmail.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeFilter, searchQuery, reports]);

  // Bulk export
  const handleExportCSV = () => {
    if (!filteredReports.length) return;
    const headers = ["User Name", "Location", "Inspection ID", "Report ID", "Inspector Email", "Report Status", "Created Date", "Status"];
    const rows = filteredReports.map((r) => [
      r.user.name, r.user.location, r.inspectionId, r.reportId,
      r.inspectorEmail, r.reportDetails.text, r.createdDate, r.status,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((v) => `"${v}"`).join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `Inspection_Reports_${activeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle star
  const toggleStar = (id: string) => {
    setStarredIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Archive row
  const archiveRow = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Archived" as ReportStatus } : r))
    );
  };

  return (
    <div className="w-full bg-white min-h-screen my-6 md:my-12 font-roboto antialiased select-none">

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveFilter("All")}
              className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "All" ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
              }`}
            >
              All
            </button>
            {(["Complete", "Pending", "Started", "Archived"] as ReportStatus[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === filter ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                }`}
              >
                {filter}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  filter === "Complete" ? "bg-emerald-50 text-emerald-600" :
                  filter === "Pending" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                }`}>
                  {counts[filter]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredReports.length === 0}
          className="flex items-center gap-2 bg-primaryColor hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm shadow-md shadow-blue-100 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* ── Table ── */}
      {filteredReports.length > 0 ? (
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[1200px] border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-[#F5F6FA] border-b border-gray-100 text-[13px] font-semibold text-gray-900 leading-5">
                  <th className="py-4 px-5">User</th>
                  <th className="py-4 px-4">Inspection ID</th>
                  <th className="py-4 px-4">Report ID</th>
                  <th className="py-4 px-4">Inspector</th>
                  <th className="py-4 px-4">Report Details</th>
                  <th className="py-4 px-4">Created Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((row) => {
                  const isStarred = starredIds.has(row.id);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* User */}
                      <td className="py-4 px-5 flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                          {row.user.avatar ? (
                            <Image src={row.user.avatar} alt={row.user.name} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
                              {row.user.initials}
                            </div>
                          )}
                          <span className="absolute bottom-0 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                          <span className="font-medium text-sm leading-5 text-gray-900 block">{row.user.name}</span>
                          <span className="text-gray-600 text-[13px] mt-1 block font-normal leading-4">{row.user.location}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.inspectionId}</td>
                      <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.reportId}</td>

                      {/* Inspector */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-gray-900 text-[13px] leading-5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0 overflow-hidden relative">
                            {row.user.avatar && <Image src={row.user.avatar} alt="inspector" fill className="object-cover" unoptimized />}
                          </div>
                          <span className="font-normal">{row.inspectorEmail}</span>
                        </div>
                      </td>

                      {/* Report Details */}
                      <td className="py-3.5 px-4">
                        {row.reportDetails.isSubmitted ? (
                          <div>
                            <span className="font-medium text-sm text-gray-900 block leading-5">{row.reportDetails.text}</span>
                            <span className="text-[#5C6470] text-xs mt-0.5 block font-normal leading-5">{row.reportDetails.subText}</span>
                          </div>
                        ) : (
                          <span className="text-red-500 font-medium text-sm leading-5">{row.reportDetails.text}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.createdDate}</td>

                      {/* Status badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          row.status === "Complete" ? "bg-[#E6F9F0] text-[#10B981]" :
                          row.status === "Pending" ? "bg-red-50 text-red-400" : "bg-amber-50 text-amber-500"
                        }`}>
                          {row.status === "Pending" ? "Not Submitted" : row.status}
                        </span>
                      </td>

                      {/* ── Action Buttons ── */}
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-1">

                          {/* 1. Download CSV */}
                          <button
                            onClick={() => downloadRowCSV(row)}
                            title="Download as CSV"
                            className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* 2. View / Print PDF */}
                          <button
                            onClick={() => printRowPDF(row)}
                            title="View & Print PDF"
                            className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* 3. Star / Favourite toggle */}
                          <button
                            onClick={() => toggleStar(row.id)}
                            title={isStarred ? "Unstar" : "Star"}
                            className={`p-2 rounded-sm cursor-pointer transition-colors border border-gray-100 ${
                              isStarred
                                ? "bg-amber-50 text-amber-400 hover:bg-amber-100 border-amber-100"
                                : "text-[#5C6470] hover:text-amber-400 bg-[#EFEFFF] hover:bg-amber-50"
                            }`}
                          >
                            <Star className={`w-4 h-4 ${isStarred ? "fill-amber-400" : ""}`} />
                          </button>

                          {/* 4. Archive row */}
                          <button
                            onClick={() => archiveRow(row.id)}
                            title="Archive"
                            disabled={row.status === "Archived"}
                            className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M14.0007 2H2.00065C1.63246 2 1.33398 2.29848 1.33398 2.66667V4.66667C1.33398 5.03486 1.63246 5.33333 2.00065 5.33333H14.0007C14.3688 5.33333 14.6673 5.03486 14.6673 4.66667V2.66667C14.6673 2.29848 14.3688 2 14.0007 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2.66602 5.33337V12.6667C2.66602 13.0203 2.80649 13.3595 3.05654 13.6095C3.30659 13.8596 3.64573 14 3.99935 14H11.9993C12.353 14 12.6921 13.8596 12.9422 13.6095C13.1922 13.3595 13.3327 13.0203 13.3327 12.6667V5.33337" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M6.66602 8H9.33268" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="w-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-sm">No inspection reports matches your current query or filters.</p>
        </div>
      )}
    </div>
  );
}