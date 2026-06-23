/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Search, Download, Eye } from "lucide-react";
import {
  useGetPaymentsQuery,
  PaymentItem,
} from "@/app/redux/features/paymentsApi"; 



type UIStatus = "Paid" | "Pending" | "Canceled";

function mapStatus(status: PaymentItem["status"]): UIStatus {
  switch (status) {
    case "paid":    return "Paid";
    case "pending": return "Pending";
    default:        return "Canceled";
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}


function downloadRowAsCSV(item: PaymentItem) {
  const booking  = item.inspection_booking;
  const homeowner = booking.homeowner;
  const inspector = booking.inspection_assign?.inspector;

  const headers = ["Transaction ID","Payment Type","Status","Total","Inspector Share","Admin Share","Urgent Fee","Platform Fee","Homeowner","Inspector","Property Address","Created Date"];
  const values  = [
    item.trx_id, item.payment_type, item.status,
    `$${item.total}`, `$${item.inspector_share}`, `$${item.admin_share}`,
    `$${item.urgent_fee}`, `$${item.platform_fee}`,
    `${homeowner.first_name} ${homeowner.last_name}`,
    inspector ? `${inspector.first_name} ${inspector.last_name}` : "Unassigned",
    booking.property_address, formatDate(item.created_at),
  ];

  const csv = "data:text/csv;charset=utf-8," +
    [headers.join(","), values.map((v) => `"${v}"`).join(",")].join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = `Transaction_${item.trx_id}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function printRowAsPDF(item: PaymentItem) {
  const booking   = item.inspection_booking;
  const homeowner = booking.homeowner;
  const inspector = booking.inspection_assign?.inspector;
  const uiStatus  = mapStatus(item.status);

  const statusColor = uiStatus === "Paid" ? "#01B664" : uiStatus === "Pending" ? "#DC3545" : "#FA6161";
  const statusBg    = uiStatus === "Paid" ? "#E9F9F2" : uiStatus === "Pending" ? "#FAE7E7" : "#FFF1F1";

  const win = window.open("", "_blank", "width=800,height=600");
  if (!win) return;

  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Receipt – ${item.trx_id}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',sans-serif;background:#fff;color:#111;padding:48px}
    .header{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:20px;margin-bottom:32px}
    .badge{display:inline-block;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:700;background:${statusBg};color:${statusColor}}
    .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:14px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 32px;margin-bottom:32px}
    .field label{display:block;font-size:11px;color:#888;margin-bottom:3px;font-weight:600;text-transform:uppercase}
    .field span{font-size:14px;font-weight:500;color:#111}
    .amount-box{background:#F5F6FA;border-radius:10px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:32px}
    .footer{border-top:1px solid #eee;padding-top:16px;font-size:11px;color:#aaa;text-align:center}
  </style></head><body>
  <div class="header">
    <div><h1 style="font-size:22px;font-weight:700">Transaction Receipt</h1>
    <div style="margin-top:6px;display:flex;align-items:center;gap:8px">
      <span style="font-size:13px;color:#555">${item.trx_id}</span>
      <span class="badge">${uiStatus}</span>
    </div></div>
    <div style="font-size:12px;color:#666;text-align:right">
      <div style="font-size:13px;font-weight:600;color:#111">${homeowner.first_name} ${homeowner.last_name}</div>
      <div style="margin-top:4px">${booking.property_address}</div>
      <div style="margin-top:4px">Issued: ${formatDate(item.created_at)}</div>
    </div>
  </div>
  <div class="amount-box">
    <span style="font-size:13px;color:#555;font-weight:600">Total Amount</span>
    <span style="font-size:28px;font-weight:800;color:#111">$${item.total}</span>
  </div>
  <p class="section-title">Transaction Details</p>
  <div class="grid">
    <div class="field"><label>Payment Type</label><span>${item.payment_type.replace(/_/g," ")}</span></div>
    <div class="field"><label>Created Date</label><span>${formatDate(item.created_at)}</span></div>
    <div class="field"><label>Homeowner Email</label><span>${homeowner.email}</span></div>
    <div class="field"><label>Inspector</label><span>${inspector ? `${inspector.first_name} ${inspector.last_name}` : "Unassigned"}</span></div>
    <div class="field"><label>Inspector Share</label><span>$${item.inspector_share}</span></div>
    <div class="field"><label>Platform Fee</label><span>$${item.platform_fee}</span></div>
    <div class="field"><label>Urgent Fee</label><span>$${item.urgent_fee}</span></div>
    <div class="field"><label>Status</label><span class="badge">${uiStatus}</span></div>
  </div>
  <div class="footer">Computer-generated receipt. No signature required.</div>
  <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script>
  </body></html>`);
  win.document.close();
}


function exportAllAsCSV(payments: PaymentItem[], label: string) {
  if (!payments.length) return;
  const headers = ["Transaction ID","Payment Type","Status","Total","Inspector Share","Admin Share","Urgent Fee","Platform Fee","Homeowner","Inspector","Property Address","Created Date"];
  const rows = payments.map((item) => {
    const b = item.inspection_booking;
    const insp = b.inspection_assign?.inspector;
    return [
      item.trx_id, item.payment_type, item.status,
      `$${item.total}`, `$${item.inspector_share}`, `$${item.admin_share}`,
      `$${item.urgent_fee}`, `$${item.platform_fee}`,
      `${b.homeowner.first_name} ${b.homeowner.last_name}`,
      insp ? `${insp.first_name} ${insp.last_name}` : "Unassigned",
      b.property_address, formatDate(item.created_at),
    ].map((v) => `"${v}"`).join(",");
  });

  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = `Transactions_${label}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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
export default function PaymentsTable() {
  const [activeFilter, setActiveFilter] = useState<"All" | UIStatus>("All");
  const [searchQuery, setSearchQuery]   = useState("");

  const backendStatus =
    activeFilter === "Paid" ? "paid"
    : activeFilter === "Pending" ? "pending"
    : activeFilter === "Canceled" ? "failed"
    : undefined;

  const { data: apiResponse, isLoading, isError } = useGetPaymentsQuery({
    status: backendStatus,
    search: searchQuery.trim() || undefined,
  });

  
  const rawData = (apiResponse as any);
  const payments: PaymentItem[] = Array.isArray(rawData?.data?.data)
    ? rawData.data.data
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];

  const totalCount: number = rawData?.data?.total ?? rawData?.total ?? payments.length;

  const counts = useMemo(() => ({
    All:      totalCount,
    Paid: payments.filter((p) => p.status === "paid").length,
    Pending:  payments.filter((p) => p.status === "pending").length,
    Canceled: payments.filter((p) => p.status === "failed").length,
  }), [payments, totalCount]);


  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const paginatedPayments = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return payments.slice(startIndex, startIndex + itemsPerPage);
}, [payments, currentPage]);

const totalPages = Math.ceil(payments.length / itemsPerPage);
  return (
    <div className="w-full bg-white min-h-screen font-roboto my-6 md:my-12 antialiased select-none">


      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-4xl">

   
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by user or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
            />
          </div>

      
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {(["All", "Paid", "Pending", "Canceled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === f
                    ? "bg-black text-white"
                    : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                }`}
              >
                {f}
                {f !== "All" && (
                  <span className={`min-w-4 h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] text-white ${
                    f === "Paid" ? "bg-emerald-500" : f === "Pending" ? "bg-amber-400" : "bg-red-400"
                  }`}>
                    {counts[f]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Export */}
        <button
          onClick={() => exportAllAsCSV(payments, activeFilter)}
          disabled={payments.length === 0 || isLoading}
          className="flex items-center gap-2 bg-primaryColor hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm shadow-md shadow-blue-100 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed self-end lg:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Export Data
        </button>
      </div>

      
      {isLoading && (
        <div className="">
          <TableSkeleton/>
        </div>
      )}

      {/* ── Error ── */}
      {isError && !isLoading && (
        <div className="w-full text-center py-20 bg-red-50 rounded-2xl border border-dashed border-red-200">
          <p className="text-red-400 font-bold text-sm">Failed to load payments. Please try again.</p>
        </div>
      )}

      {/* ── Table ── */}
      {!isLoading && !isError && payments.length > 0 && (
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[1200px] border border-gray-100 rounded-[20px] overflow-hidden">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-[#F5F6FA] border-b border-gray-100 text-[13px] font-semibold text-gray-900 leading-5">
                  <th className="py-4 px-5">Homeowner</th>
                  <th className="py-4 px-4">Transaction ID</th>
                  <th className="py-4 px-4">Payment Type</th>
                  <th className="py-4 px-4">Inspector</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Admin Share</th>
                  <th className="py-4 px-4">Created Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPayments.map((item) => {
                  const booking   = item.inspection_booking;
                  const homeowner = booking.homeowner;
                  const inspector = booking.inspection_assign?.inspector;
                  const uiStatus  = mapStatus(item.status);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">

                      {/* Homeowner */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-[#EBF0FF] text-[#4353FF] flex items-center justify-center font-bold text-xs">
                            {getInitials(homeowner.first_name, homeowner.last_name)}
                            <span className="absolute bottom-0 right-0.5 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
                          </div>
                          <div>
                            <span className="font-medium text-sm leading-5 text-gray-900 block">
                              {homeowner.first_name} {homeowner.last_name}
                            </span>
                            <span className="text-gray-500 text-[12px] block">{homeowner.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-900 text-sm">{item.trx_id}</td>

                      <td className="py-3.5 px-4 text-gray-900 text-sm capitalize">
                        {item.payment_type.replace(/_/g, " ")}
                      </td>

                      <td className="py-3.5 px-4 text-sm">
                        {inspector
                          ? <span className="text-gray-900">{inspector.first_name} {inspector.last_name}</span>
                          : <span className="text-gray-400 italic">Unassigned</span>}
                      </td>

                      <td className="py-3.5 px-4 text-gray-900 text-sm font-medium">${item.total}</td>
                      <td className="py-3.5 px-4 text-gray-900 text-sm">${item.admin_share}</td>
                      <td className="py-3.5 px-4 text-gray-900 text-sm">{formatDate(item.created_at)}</td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-3 py-1.5 rounded text-[10px] font-bold ${
                          uiStatus === "Paid" ? "bg-[#E9F9F2] text-[#01B664]"
                          : uiStatus === "Pending" ? "bg-amber-50 text-[#FBBF24]"
                          : "bg-[#FFF1F1] text-[#FA6161]"
                        }`}>
                          {uiStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => downloadRowAsCSV(item)}
                            title="Download as CSV"
                            className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#F8F8F8] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => printRowAsPDF(item)}
                            title="View & Print PDF"
                            className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#F8F8F8] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
                          >
                            <Eye className="w-4 h-4" />
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
      )}

      {/* ── Empty ── */}
      {!isLoading && !isError && payments.length === 0 && (
        <div className="w-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-sm">
            No transactions match your current filters or search.
          </p>
        </div>
      )}

      {totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-6">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-2  border rounded disabled:opacity-100"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1  border border-primaryColor cursor-pointer rounded ${
          currentPage === i + 1
            ? "bg-primaryColor text-white"
            : "bg-white text-black"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
      }
      disabled={currentPage === totalPages}
      className="px-3 py-2 border cursor-pointer rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
    </div>
  );
}

