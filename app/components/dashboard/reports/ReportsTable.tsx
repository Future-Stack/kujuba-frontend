/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Download, Eye, Star } from "lucide-react";
import {
  useGetReportsQuery,
  useToggleReportFavoriteMutation,
  useArchiveReportMutation,
  useRestoreReportMutation,
  Report,
} from "@/app/redux/features/reportsApi";
import ReportDetailsModal from "./ReportDetailsModal";
import { toast } from "react-toastify";

type StatusFilter = "All" | "Started" | "Completed" | "Archive";

const statusStyle: Record<string, string> = {
  Complete: "bg-[#E6F9F0] text-[#10B981]",
  Completed: "bg-[#E6F9F0] text-[#10B981]",
  Pending: "bg-red-50 text-red-400",
  Started: "bg-amber-50 text-amber-500",
  Archived: "bg-slate-100 text-slate-500",
  Cancelled: "bg-red-50 text-red-400",
};

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}
function TableSkeleton() {
  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="min-w-[1200px] border border-gray-100 rounded-[20px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F6FA]">
              {Array.from({ length: 9 }).map((_, i) => (
                <th key={i} className="py-4 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ReportsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab")?.toLowerCase();
  const activeFilter: StatusFilter =
    tabParam === "started"
      ? "Started"
      : tabParam === "completed"
      ? "Completed"
      : tabParam === "archive" || tabParam === "archived"
      ? "Archive"
      : "All";

  const setActiveFilter = (f: StatusFilter) => {
    const param =
      f === "Started"
        ? "started"
        : f === "Completed"
        ? "completed"
        : f === "Archive"
        ? "archive"
        : "";
    router.replace(param ? `${pathname}?tab=${param}` : pathname);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // ── Queries ──
  const { data, isLoading, isFetching } = useGetReportsQuery({ page });

  // ── Mutations ──
  const [toggleFavorite] = useToggleReportFavoriteMutation();
  const [archiveReport, { isLoading: isArchiving }] = useArchiveReportMutation();
  const [restoreReport] = useRestoreReportMutation();

  // ── Extract data ──
  const reports = data?.reports ?? [];
  const pagination = data?.pagination;

  // ── Client-side filter ──
  const filteredReports = useMemo(() => {
    let result = [...reports];

    if (activeFilter === "Archive") {
      result = result.filter((r) => r.is_archived);
    } else if (activeFilter === "Completed") {
      result = result.filter((r) => r.status === "Completed"); 
    } else if (activeFilter === "Started") {
      result = result.filter((r) => r.status === "Started"); 
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.user_name.toLowerCase().includes(q) ||
          r.inspection_id.toLowerCase().includes(q) ||
          r.inspector_email.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeFilter, searchQuery, reports]);


  const counts = useMemo(() => ({
    All: reports.length,
    Completed: reports.filter((r) => r.status === "Completed").length, 
    Started: reports.filter((r) => r.status === "Started").length,     
    Archive: reports.filter((r) => r.is_archived).length,
  }), [reports]);

  const busy = isLoading || isFetching;
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    if (!filteredReports.length) return;
    const headers = ["User Name", "Location", "Inspection ID", "Report ID", "Inspector Email", "Created Date", "Status", "Homeowner Feedback"];
    const rows = filteredReports.map((r) => [
      r.user_name,
      r.location ?? "",
      r.inspection_id,
      r.report_id,
      r.inspector_email,
      r.created_date,
      r.status ?? "",
      r.report_details?.notes ?? "",
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

  async function downloadPDF(url?: string, fileName?: string) {
    if (!url) { toast.error("No report file available."); return; }
    try {
      // toast.info("Downloading...");
      toast.success("Download started!");
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName ?? "report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Downloaded successfully!");
    } catch {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName ?? "report.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    }
  }

  function viewPDF(url?: string) {
    if (!url) { toast.error("No report file available."); return; }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    setTogglingId(id);
    try {
      const res = await toggleFavorite(id).unwrap();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setTogglingId(null);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      const res = await archiveReport(id).unwrap();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const res = await restoreReport(id).unwrap();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  
  return (
    <div className="w-full bg-white min-h-screen my-6 md:my-12 font-roboto antialiased select-none">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Name and Email ..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => { setActiveFilter("All"); setPage(1); }}
              className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeFilter === "All" ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                }`}
            >
              All
              <span className="px-1.5 py-0.5 min-w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-slate-100 text-slate-600">
                {counts.All}
              </span>
            </button>

            {(["Started","Completed", "Archive"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); setPage(1); }}
                className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeFilter === filter ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                  }`}
              >
                {filter}
                <span className={`min-w-4 h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] ${filter === "Completed" ? "bg-[#10B981] text-white" :
                    filter === "Archive" ? "bg-primaryColor text-white" :
                      "text-white bg-[#FBBF24]"
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
      {busy ? (
        <div className="w-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-sm"><TableSkeleton/></p>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[1300px] border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-[#F5F6FA] border-b border-gray-100 text-[13px] font-semibold text-gray-900 leading-5">
                  <th className="py-4 px-5">User</th>
                  <th className="py-4 px-4">Inspection ID</th>
                  <th className="py-4 px-4">Report ID</th>
                  <th className="py-4 px-4">Inspector</th>
                  <th className="py-4 px-4">Report Details</th>
                  <th className="py-4 px-4">Homeowner Feedback</th>
                  <th className="py-4 px-4">Created Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-5 flex items-center gap-3">
                      <span className="font-medium text-sm py-3 leading-5 text-gray-900 block">
                        {row.user_name?.trim() || "—"}
                      </span>
                    </td>

                    <td className="py- px-4 text-gray-900 text-sm font-normal leading-5">{row.inspection_id}</td>
                    <td className="py- px-4 text-gray-900 text-sm font-normal leading-5">{row.report_id}</td>

                    <td className=" px-4">
                      <span className="font-normal text-gray-900 text-[13px] leading-5">{row.inspector_email}</span>
                    </td>

                    <td className="py- px-4">
                      <button
                        onClick={() => setSelectedReport(row)}
                        className="text-primaryColor font-medium text-sm leading-5 hover:underline cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>

                    <td className="py-0 px-4 max-w-[220px]">
                      {row.report_details?.notes?.trim() ? (
                        <span className="text-gray-600 text-[13px] leading-5 line-clamp-2">
                          {row.report_details.notes}
                        </span>
                      ) : (
                        <span className="inline-block px-2.5  rounded-md text-[13px] font-bold text-slate-400">
                          No Feedback
                        </span>
                      )}
                    </td>

                    <td className="py-0 px-4 text-gray-900 text-sm font-normal leading-5">{row.created_date}</td>

                    <td className="py-0 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${statusStyle[row.status] ?? "bg-slate-100 text-slate-500"}`}>
                        {row.status}
                      </span>
                    </td>

                    {/* ── Action Buttons ── */}
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-center gap-1">

                        {/* 1. Download PDF */}
                        <button
                          onClick={() => downloadPDF(row.report_details?.report_file, `Report_${row.report_id}.pdf`)}
                          title="Download PDF"
                          className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* 2. View PDF */}
                        <button
                          onClick={() => viewPDF(row.report_details?.report_file)}
                          title="View & Print PDF"
                          className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* 3. Star / Favourite toggle */}
                        <button
                          onClick={() => handleToggleFavorite(row.id, row.is_favorite)}
                          disabled={togglingId === row.id}
                          title={row.is_favorite ? "Unstar" : "Star"}
                          className={`p-2 rounded-sm cursor-pointer transition-colors border border-gray-100 disabled:opacity-50 ${row.is_favorite
                              ? "bg-amber-50 text-amber-400 hover:bg-amber-100 border-amber-100"
                              : "text-[#5C6470] hover:text-amber-400 bg-[#EFEFFF] hover:bg-amber-50"
                            }`}
                        >
                          <Star className={`w-4 h-4 ${row.is_favorite ? "fill-amber-400" : ""}`} />
                        </button>

                        {/* 4. Archive / Restore toggle */}
                        <button
                          onClick={() => row.is_archived ? handleRestore(row.id) : handleArchive(row.id)}
                          title={row.is_archived ? "Restore" : "Archive"}
                          disabled={isArchiving}
                          className={`p-2 rounded-sm cursor-pointer transition-colors border ${row.is_archived
                              ? "text-white bg-primaryColor border-blue-200"  // ← active/highlighted
                              : "text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 border-gray-100"
                            }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14.0007 2H2.00065C1.63246 2 1.33398 2.29848 1.33398 2.66667V4.66667C1.33398 5.03486 1.63246 5.33333 2.00065 5.33333H14.0007C14.3688 5.33333 14.6673 5.03486 14.6673 4.66667V2.66667C14.6673 2.29848 14.3688 2 14.0007 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.66602 5.33337V12.6667C2.66602 13.0203 2.80649 13.3595 3.05654 13.6095C3.30659 13.8596 3.64573 14 3.99935 14H11.9993C12.353 14 12.6921 13.8596 12.9422 13.6095C13.1922 13.3595 13.3327 13.0203 13.3327 12.6667V5.33337" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.66602 8H9.33268" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              {totalPages > 1 && (
                <tfoot>
                  <tr>
                    <td colSpan={9}>
                      <div className="flex items-center justify-between mt-4 px-4 pb-3">
                        <span className="text-sm text-gray-500">
                          Page {page} of {totalPages} · {filteredReports.length} total
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Prev
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                            .reduce<(number | "...")[]>((acc, p, i, arr) => {
                              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                              acc.push(p);
                              return acc;
                            }, [])
                            .map((p, i) =>
                              p === "..." ? (
                                <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                              ) : (
                                <button
                                  key={p}
                                  onClick={() => setPage(p as number)}
                                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${p === page
                                      ? "bg-primaryColor text-white border border-primaryColor"
                                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                  {p}
                                </button>
                              )
                            )}
                          <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <span className="text-sm text-gray-500">
                Page {pagination.current_page} of {pagination.last_page} · {pagination.total} total
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.prev_page_url}
                  className="px-3 py-1.5 text-sm rounded-sm border border-gray-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.next_page_url}
                  className="px-3 py-1.5 text-sm rounded-sm border border-gray-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-bold text-sm">  No inspection reports have been archived yet.</p>
        </div>
      )}

      {/* Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}






// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useMemo } from "react";
// import { Search, Download, Eye, Star } from "lucide-react";
// import {
//   useGetReportsQuery,
//   useGetReportStatsQuery,
//   useToggleReportFavoriteMutation,
//   useArchiveReportMutation,
//   useRestoreReportMutation,
//   ReportQueryParams,
//   Report,
// } from "@/app/redux/features/reportsApi";
// import ReportDetailsModal from "./ReportDetailsModal";
// import { toast } from "react-toastify";

// type StatusFilter = "All" | "Started" | "Completed" | "Archive";

// const statusStyle: Record<string, string> = {
//   Complete: "bg-[#E6F9F0] text-[#10B981]",
//   Completed: "bg-[#E6F9F0] text-[#10B981]",
//   Pending: "bg-red-50 text-red-400",
//   Started: "bg-amber-50 text-amber-500",
//   Archived: "bg-slate-100 text-slate-500",
//   Cancelled: "bg-red-50 text-red-400",
// };

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function ReportsTable() {
//   const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const [selectedReport, setSelectedReport] = useState<Report | null>(null);
//   const [togglingId, setTogglingId] = useState<number | null>(null);

//   // ── Step 1: queryParams FIRST
//   const queryParams: ReportQueryParams = useMemo(() => {
//     if (activeFilter === "Archive") return { page, is_archived: 1 };
//     if (activeFilter === "Completed") return { page, is_archived: 0, status: "Completed" };
//     if (activeFilter === "Started") return { page, is_archived: 0, status: "Started" };
//     return { page, is_archived: 0 };
//   }, [activeFilter, page]);

//   // ── Step 2: queries
//   const { data, isLoading, isFetching } = useGetReportsQuery(queryParams);
//   const { data: stats } = useGetReportStatsQuery();

//   // ── Step 3: mutations
//   const [toggleFavorite] = useToggleReportFavoriteMutation();
//   const [archiveReport, { isLoading: isArchiving }] = useArchiveReportMutation();
//   const [restoreReport] = useRestoreReportMutation();

//   // ── Step 4: extract data
//   const reports = data?.reports ?? [];
//   const pagination = data?.pagination;

//   const filteredReports = useMemo(() => {
//     let result = [...reports];
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       result = result.filter(
//         (r) =>
//           r.user_name.toLowerCase().includes(q) ||
//           r.inspection_id.toLowerCase().includes(q) ||
//           r.inspector_email.toLowerCase().includes(q)
//       );
//     }
//     return result;
//   }, [searchQuery, reports]);

//   const { data: allData } = useGetReportsQuery({ is_archived: 0 });
//   const { data: completedData } = useGetReportsQuery({ is_archived: 0, status: "Completed" });
//   const { data: startedData } = useGetReportsQuery({ is_archived: 0, status: "Started" });
//   const { data: archivedData } = useGetReportsQuery({ is_archived: 1 });

//   const counts = {
//     All: allData?.pagination?.total ?? 0,
//     Completed: completedData?.pagination?.total ?? 0,
//     Started: startedData?.pagination?.total ?? 0,
//     Archive: archivedData?.pagination?.total ?? 0,
//   };

//   const busy = isLoading || isFetching;
//   const ITEMS_PER_PAGE = 10;
//   const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const handleExportCSV = () => {
//     if (!filteredReports.length) return;
//     const headers = ["User Name", "Location", "Inspection ID", "Report ID", "Inspector Email", "Created Date", "Status", "Homeowner Feedback"];
//     const rows = filteredReports.map((r) => [
//       r.user_name,
//       r.location ?? "",
//       r.inspection_id,
//       r.report_id,
//       r.inspector_email,
//       r.created_date,
//       r.status ?? "",
//       r.report_details?.notes ?? "",
//     ]);
//     const csv =
//       "data:text/csv;charset=utf-8," +
//       [headers.join(","), ...rows.map((e) => e.map((v) => `"${v}"`).join(","))].join("\n");
//     const link = document.createElement("a");
//     link.setAttribute("href", encodeURI(csv));
//     link.setAttribute("download", `Inspection_Reports_${activeFilter}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   async function downloadPDF(url?: string, fileName?: string) {
//     if (!url) { toast.error("No report file available."); return; }
//     try {
//       toast.info("Downloading...");
//       const res = await fetch(url, { mode: "cors" });
//       if (!res.ok) throw new Error();
//       const blob = await res.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = fileName ?? "report.pdf";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//       toast.success("Downloaded successfully!");
//     } catch {
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName ?? "report.pdf";
//       link.target = "_blank";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       toast.success("Download started!");
//     }
//   }

//   function viewPDF(url?: string) {
//     if (!url) { toast.error("No report file available."); return; }
//     window.open(url, "_blank", "noopener,noreferrer");
//   }

//   const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
//     setTogglingId(id);
//     try {
//       const res = await toggleFavorite(id).unwrap();
//       toast.success(res.message);
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Something went wrong");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const handleArchive = async (id: number) => {
//     try {
//       const res = await archiveReport(id).unwrap();
//       toast.success(res.message);
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Something went wrong");
//     }
//   };

//   const handleRestore = async (id: number) => {
//     try {
//       const res = await restoreReport(id).unwrap();
//       toast.success(res.message);
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Something went wrong");
//     }
//   };

 
//   return (
//     <div className="w-full bg-white min-h-screen my-6 md:my-12 font-roboto antialiased select-none">

//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
//         <div className="flex flex-col lg:flex-row items-stretch sm:items-center gap-4 flex-1">
//           <div className="relative w-full lg:max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search Name and Email ..."
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
//               className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
//             />
//           </div>

//           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
//             <button
//               onClick={() => { setActiveFilter("All"); setPage(1); }}
//               className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeFilter === "All" ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
//                 }`}
//             >
//               All
//               <span className="px-1.5 py-0.5 min-w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-slate-100 text-slate-600">
//                 {counts.All}
//               </span>
//             </button>

//             {(["Completed", "Started", "Archive"] as const).map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => { setActiveFilter(filter); setPage(1); }}
//                 className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeFilter === filter ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
//                   }`}
//               >
//                 {filter}
//                 <span className={`min-w-4 h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] ${filter === "Completed" ? "bg-emerald-50 text-emerald-600" :
//                     filter === "Archive" ? "bg-slate-100 text-slate-500" :
//                       "text-orange-500 bg-orange-50"
//                   }`}>
//                   {counts[filter]}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={handleExportCSV}
//           disabled={filteredReports.length === 0}
//           className="flex items-center gap-2 bg-primaryColor hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm shadow-md shadow-blue-100 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <Download className="w-4 h-4" />
//           Export Data
//         </button>
//       </div>

//       {/* ── Table ── */}
//       {busy ? (
//         <div className="w-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
//           <p className="text-gray-400 font-bold text-sm">Loading reports...</p>
//         </div>
//       ) : filteredReports.length > 0 ? (
//         <div className="w-full overflow-x-auto no-scrollbar">
//           <div className="min-w-[1300px] border border-gray-100 rounded-2xl overflow-hidden">
//             <table className="w-full text-left border-collapse bg-white">
//               <thead>
//                 <tr className="bg-[#F5F6FA] border-b border-gray-100 text-[13px] font-semibold text-gray-900 leading-5">
//                   <th className="py-4 px-5">User</th>
//                   <th className="py-4 px-4">Inspection ID</th>
//                   <th className="py-4 px-4">Report ID</th>
//                   <th className="py-4 px-4">Inspector</th>
//                   <th className="py-4 px-4">Report Details</th>
//                   <th className="py-4 px-4">Homeowner Feedback</th>
//                   <th className="py-4 px-4">Created Date</th>
//                   <th className="py-4 px-4">Status</th>
//                   <th className="py-4 px-5 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {filteredReports.map((row) => (
//                   <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
//                     <td className="py-3.5  flex items-center gap-3">
//                       <div>
//                         <span className="font-medium py-3.5 px-4 text-sm leading-5 text-gray-900 block">{row.user_name?.trim() || "—"}</span>
//                       </div>
//                     </td>

//                     <td className=" text-gray-900 text-sm font-normal leading-5">{row.inspection_id}</td>
//                     <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.report_id}</td>

//                     <td className="py-3.5 px-4">
//                       <span className="font-normal text-gray-900 text-[13px] leading-5">{row.inspector_email}</span>
//                     </td>

//                     <td className="py-3.5 px-4">
//                       <button
//                         onClick={() => setSelectedReport(row)}
//                         className="text-primaryColor font-medium text-sm leading-5 hover:underline cursor-pointer"
//                       >
//                         View Details
//                       </button>
//                     </td>

//                     <td className="py-3.5 px-4 max-w-[220px]">
//                       {row.report_details?.notes?.trim() ? (
//                         <span className="text-gray-600 text-[13px] leading-5 line-clamp-2">
//                           {row.report_details.notes}
//                         </span>
//                       ) : (
//                         <span className="inline-block px-2.5 py-0.5 rounded-md text-[13px] font-bold text-slate-400">
//                           No Feedback
//                         </span>
//                       )}
//                     </td>

//                     <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.created_date}</td>

//                     <td className="py-4 px-4">
//                       <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${statusStyle[row.status] ?? "bg-slate-100 text-slate-500"}`}>
//                         {row.status}
//                       </span>
//                     </td>

//                     {/* ── Action Buttons ── */}
//                     <td className="py-4 5">
//                       <div className="flex items-center justify-center gap-1">

//                         {/* 1. Download PDF */}
//                         <button
//                           onClick={() => downloadPDF(row.report_details?.report_file, `Report_${row.report_id}.pdf`)}
//                           title="Download PDF"
//                           className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
//                         >
//                           <Download className="w-4 h-4" />
//                         </button>

//                         {/* 2. View PDF */}
//                         <button
//                           onClick={() => viewPDF(row.report_details?.report_file)}
//                           title="View & Print PDF"
//                           className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>

//                         {/* 3. Star / Favourite toggle */}
//                         <button
//                           onClick={() => handleToggleFavorite(row.id, row.is_favorite)}
//                           disabled={togglingId === row.id}
//                           title={row.is_favorite ? "Unstar" : "Star"}
//                           className={`p-2 rounded-sm cursor-pointer transition-colors border border-gray-100 disabled:opacity-50 ${row.is_favorite
//                               ? "bg-amber-50 text-amber-400 hover:bg-amber-100 border-amber-100"
//                               : "text-[#5C6470] hover:text-amber-400 bg-[#EFEFFF] hover:bg-amber-50"
//                             }`}
//                         >
//                           <Star className={`w-4 h-4 ${row.is_favorite ? "fill-amber-400" : ""}`} />
//                         </button>

//                         {/* 4. Archive / Restore toggle */}
//                         {row.is_archived ? (
//                           <button
//                             onClick={() => handleRestore(row.id)}
//                             title="Restore"
//                             className="p-2 text-emerald-500 hover:text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-sm cursor-pointer transition-colors border border-emerald-100"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                               <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//                               <path d="M3 3v5h5" />
//                             </svg>
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => handleArchive(row.id)}
//                             title="Archive"
//                             disabled={isArchiving}
//                             className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//                               <path d="M14.0007 2H2.00065C1.63246 2 1.33398 2.29848 1.33398 2.66667V4.66667C1.33398 5.03486 1.63246 5.33333 2.00065 5.33333H14.0007C14.3688 5.33333 14.6673 5.03486 14.6673 4.66667V2.66667C14.6673 2.29848 14.3688 2 14.0007 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M2.66602 5.33337V12.6667C2.66602 13.0203 2.80649 13.3595 3.05654 13.6095C3.30659 13.8596 3.64573 14 3.99935 14H11.9993C12.353 14 12.6921 13.8596 12.9422 13.6095C13.1922 13.3595 13.3327 13.0203 13.3327 12.6667V5.33337" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M6.66602 8H9.33268" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>
//                           </button>
//                         )}

//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//               {totalPages > 1 && (
//                 <tfoot>
//                   <tr>
//                     <td colSpan={9}>
//                       <div className="flex items-center justify-between mt-4 px-1 pb-2">
//                         <span className="text-sm text-gray-500">
//                           Page {page} of {totalPages} · {filteredReports.length} total
//                         </span>
//                         <div className="flex items-center gap-1.5">
//                           <button
//                             onClick={() => setPage((p) => Math.max(1, p - 1))}
//                             disabled={page <= 1}
//                             className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
//                           >
//                             Prev
//                           </button>
//                           {Array.from({ length: totalPages }, (_, i) => i + 1)
//                             .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
//                             .reduce<(number | "...")[]>((acc, p, i, arr) => {
//                               if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
//                               acc.push(p);
//                               return acc;
//                             }, [])
//                             .map((p, i) =>
//                               p === "..." ? (
//                                 <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
//                               ) : (
//                                 <button
//                                   key={p}
//                                   onClick={() => setPage(p as number)}
//                                   className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${p === page
//                                       ? "bg-primaryColor text-white border border-primaryColor"
//                                       : "border border-gray-200 text-gray-600 hover:bg-gray-50"
//                                     }`}
//                                 >
//                                   {p}
//                                 </button>
//                               )
//                             )}
//                           <button
//                             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                             disabled={page >= totalPages}
//                             className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
//                           >
//                             Next
//                           </button>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 </tfoot>
//               )}
//             </table>
//           </div>

//           {pagination && pagination.last_page > 1 && (
//             <div className="flex items-center justify-between mt-4 px-1">
//               <span className="text-sm text-gray-500">
//                 Page {pagination.current_page} of {pagination.last_page} · {pagination.total} total
//               </span>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={!pagination.prev_page_url}
//                   className="px-3 py-1.5 text-sm rounded-sm border border-gray-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setPage((p) => p + 1)}
//                   disabled={!pagination.next_page_url}
//                   className="px-3 py-1.5 text-sm rounded-sm border border-gray-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="w-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
//           <p className="text-gray-400 font-bold text-sm">No inspection reports matches your current query or filters.</p>
//         </div>
//       )}

//       {/* Details Modal */}
//       {selectedReport && (
//         <ReportDetailsModal
//           report={selectedReport}
//           onClose={() => setSelectedReport(null)}
//         />
//       )}
//     </div>
//   );
// }