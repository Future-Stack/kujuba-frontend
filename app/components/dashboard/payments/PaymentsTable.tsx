"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Download, Eye } from "lucide-react";

type TransactionStatus = "Complete" | "Pending" | "Canceled";

interface Transaction {
  id: string;
  user: {
    name: string;
    location: string;
    avatar?: string;
    initials?: string;
  };
  transactionId: string;
  paymentType: "Inspection Fee" | "Cancellation Penalty";
  inspectorEmail: string;
  phone: string;
  amount: string;
  createdDate: string;
  status: TransactionStatus;
}

const initialTransactions: Transaction[] = [
  { id: "1", user: { name: "Brian Thompson", location: "Florida", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" }, transactionId: "INS-0125454556", paymentType: "Inspection Fee", inspectorEmail: "brian@example.com", phone: "+1 212 555 0145", amount: "$345", createdDate: "24 Dec 2025", status: "Complete" },
  { id: "2", user: { name: "Florence Haith", location: "Florida", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" }, transactionId: "INS-0125454556", paymentType: "Inspection Fee", inspectorEmail: "florence@example.com", phone: "+1 310 555 0190", amount: "$299", createdDate: "10 Dec 2025", status: "Canceled" },
  { id: "3", user: { name: "Jerry Palmer", location: "Florida", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" }, transactionId: "INS-0125454556", paymentType: "Cancellation Penalty", inspectorEmail: "jerry@example.com", phone: "+1 415 555 0122", amount: "$199", createdDate: "27 Nov 2025", status: "Complete" },
  { id: "4", user: { name: "Mark Brainerd", location: "Florida", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" }, transactionId: "INS-0125454556", paymentType: "Inspection Fee", inspectorEmail: "mark@example.com", phone: "+1 646 555 0167", amount: "$299", createdDate: "27 Nov 2025", status: "Complete" },
  { id: "5", user: { name: "Roy Thomas", location: "Florida", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" }, transactionId: "INS-0125454556", paymentType: "Cancellation Penalty", inspectorEmail: "roy@example.com", phone: "+1 702 555 0181", amount: "$299", createdDate: "06 Nov 2025", status: "Complete" },
  { id: "6", user: { name: "Alisia Chen", location: "Florida", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" }, transactionId: "INS-0125454556", paymentType: "Inspection Fee", inspectorEmail: "alisia@example.com", phone: "+1 305 555 0174", amount: "$250", createdDate: "25 Oct 2025", status: "Pending" },
  { id: "7", user: { name: "Kelly Myers", location: "Florida", initials: "KM" }, transactionId: "INS-0125454556", paymentType: "Cancellation Penalty", inspectorEmail: "kelly@example.com", phone: "+1 503 555 0133", amount: "$120", createdDate: "14 Oct 2025", status: "Complete" },
];

// ─── Single-row CSV download ───────────────────────────────────────────────
function downloadRowAsCSV(row: Transaction) {
  const headers = ["User Name", "Location", "Transaction ID", "Payment Type", "Inspector Email", "Phone", "Amount", "Created Date", "Status"];
  const values = [
    row.user.name,
    row.user.location,
    row.transactionId,
    row.paymentType,
    row.inspectorEmail,
    row.phone,
    row.amount,
    row.createdDate,
    row.status,
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), values.map((v) => `"${v}"`).join(",")].join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", `Transaction_${row.transactionId}_${row.user.name.replace(/\s+/g, "_")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Print PDF preview for a single row ───────────────────────────────────
function printRowAsPDF(row: Transaction) {
  const statusColor =
    row.status === "Complete"
      ? "#01B664"
      : row.status === "Pending"
      ? "#DC3545"
      : "#FA6161";

  const statusBg =
    row.status === "Complete"
      ? "#E9F9F2"
      : row.status === "Pending"
      ? "#FAE7E7"
      : "#FFF1F1";

  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Transaction Receipt – ${row.transactionId}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
          background: #fff;
          color: #111;
          padding: 48px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #111;
          padding-bottom: 20px;
          margin-bottom: 32px;
        }
        .header h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .header .meta { font-size: 12px; color: #666; text-align: right; }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          background: ${statusBg};
          color: ${statusColor};
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #888;
          margin-bottom: 14px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 32px;
          margin-bottom: 32px;
        }
        .field label {
          display: block;
          font-size: 11px;
          color: #888;
          margin-bottom: 3px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field span {
          font-size: 14px;
          font-weight: 500;
          color: #111;
        }
        .amount-box {
          background: #F5F6FA;
          border-radius: 10px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .amount-box .label { font-size: 13px; color: #555; font-weight: 600; }
        .amount-box .value { font-size: 28px; font-weight: 800; color: #111; }
        .footer {
          border-top: 1px solid #eee;
          padding-top: 16px;
          font-size: 11px;
          color: #aaa;
          text-align: center;
        }
        @media print {
          body { padding: 32px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>Transaction Receipt</h1>
          <div style="margin-top:6px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:13px; color:#555;">${row.transactionId}</span>
            <span class="badge">${row.status}</span>
          </div>
        </div>
        <div class="meta">
          <div style="font-size:13px; font-weight:600; color:#111;">${row.user.name}</div>
          <div style="margin-top:4px;">${row.user.location}</div>
          <div style="margin-top:4px;">Issued: ${row.createdDate}</div>
        </div>
      </div>

      <div class="amount-box">
        <span class="label">Total Amount</span>
        <span class="value">${row.amount}</span>
      </div>

      <p class="section-title">Transaction Details</p>
      <div class="grid">
        <div class="field">
          <label>Payment Type</label>
          <span>${row.paymentType}</span>
        </div>
        <div class="field">
          <label>Created Date</label>
          <span>${row.createdDate}</span>
        </div>
        <div class="field">
          <label>Inspector Email</label>
          <span>${row.inspectorEmail}</span>
        </div>
        <div class="field">
          <label>Phone</label>
          <span>${row.phone}</span>
        </div>
        <div class="field">
          <label>Status</label>
          <span class="badge">${row.status}</span>
        </div>
        <div class="field">
          <label>Location</label>
          <span>${row.user.location}</span>
        </div>
      </div>

      <div class="footer">
        This is a computer-generated receipt and does not require a signature.
      </div>

      <script>
        window.onload = function () {
          window.print();
          window.onafterprint = function () { window.close(); };
        };
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function PaymentsTable() {
  const [activeFilter, setActiveFilter] = useState<"All" | TransactionStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => ({
    All: initialTransactions.length,
    Complete: initialTransactions.filter((t) => t.status === "Complete").length,
    Pending: initialTransactions.filter((t) => t.status === "Pending").length,
    Canceled: initialTransactions.filter((t) => t.status === "Canceled").length,
  }), []);

  const filteredTransactions = useMemo(() => {
    let result = [...initialTransactions];
    if (activeFilter !== "All") result = result.filter((t) => t.status === activeFilter);
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.user.name.toLowerCase().includes(query) ||
          t.transactionId.toLowerCase().includes(query) ||
          t.inspectorEmail.toLowerCase().includes(query)
      );
    }
    return result;
  }, [activeFilter, searchQuery]);

  // Bulk export (top Export Data button)
  const handleExportData = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ["User Name", "Location", "Transaction ID", "Payment Type", "Inspector Email", "Phone", "Amount", "Created Date", "Status"];
    const rows = filteredTransactions.map((t) => [
      t.user.name, t.user.location, t.transactionId, t.paymentType,
      t.inspectorEmail, t.phone, t.amount, t.createdDate, t.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Transactions_${activeFilter}_View.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white min-h-screen font-roboto my-6 md:my-12 antialiased select-none">

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-4xl">

          {/* Search */}
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

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {(["All", "Complete", "Pending", "Canceled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === f ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                }`}
              >
                {f}
                {f !== "All" && (
                  <span className={`min-w-4 h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] text-white ${
                    f === "Complete" ? "bg-emerald-500" : f === "Pending" ? "bg-amber-400" : "bg-red-400"
                  }`}>
                    {counts[f]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Export */}
        <div className="flex items-center gap-2.5 self-end lg:self-auto">
          <button
            onClick={handleExportData}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-2 bg-primaryColor hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm shadow-md shadow-blue-100 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      {filteredTransactions.length > 0 ? (
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[1200px] border border-gray-100 rounded-[20px] overflow-hidden">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-[#F5F6FA] border-b border-gray-100 text-[13px] font-semibold text-gray-900 leading-5">
                  <th className="py-4 px-5">User</th>
                  <th className="py-4 px-4">Transaction ID</th>
                  <th className="py-4 px-4">Payment Type</th>
                  <th className="py-4 px-4">Inspector</th>
                  <th className="py-4 px-4">Method</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Created Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                        {row.user.avatar ? (
                          <Image src={row.user.avatar} alt={row.user.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-[#EBF0FF] text-[#4353FF] flex items-center justify-center font-bold text-xs">
                            {row.user.initials}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-1 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <span className="font-medium text-sm leading-5 text-gray-900 block">{row.user.name}</span>
                        <span className="text-gray-600 text-[13px] mt-1 block font-normal leading-4">{row.user.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.transactionId}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.paymentType}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.inspectorEmail}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.phone}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.amount}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.createdDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-3 py-1.5 rounded text-[10px] font-bold ${
                        row.status === "Complete" ? "bg-[#E9F9F2] text-[#01B664]" :
                        row.status === "Pending" ? "bg-[#FAE7E7] text-[#DC3545]" : "bg-[#FFF1F1] text-[#FA6161]"
                      }`}>
                        {row.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Download single row CSV */}
                        <button
                          onClick={() => downloadRowAsCSV(row)}
                          title="Download as CSV"
                          className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#F8F8F8] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {/* View / Print PDF */}
                        <button
                          onClick={() => printRowAsPDF(row)}
                          title="View & Print PDF"
                          className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#F8F8F8] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="w-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-sm">No transactions matches your current filters or search text.</p>
        </div>
      )}
    </div>
  );
}