/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Download,
  X,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Loader2,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import {
  useGetInspectorEarningsQuery,
  useGetInspectorPayoutHistoryQuery,
  InspectorEarning,
  PayoutHistoryItem,
} from "@/app/redux/features/inspectorApi";

// ─── helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(n?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n ?? 0);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-gray-900 font-sora">{value}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Payout History Modal ───────────────────────────────────────────────────
function PayoutHistoryModal({
  inspector,
  onClose,
}: {
  inspector: InspectorEarning;
  onClose: () => void;
}) {
  const { data, isLoading } = useGetInspectorPayoutHistoryQuery(inspector.id);
  const rawData = data?.data;
  const inspectorInfo = rawData?.inspector || inspector;
  const rawHistory = rawData?.payouts || rawData?.history || rawData?.data || rawData;
  const history: any[] = Array.isArray(rawHistory) ? rawHistory : [];

  const handleExport = () => {
    const headers = ["Payout ID", "Booking ID", "Inspection Title", "Homeowner", "Property Address", "Amount", "Status", "Date"];
    const rows = history.map((h) => [
      h.payout_id || h.id || "",
      h.booking_id || "",
      h.inspection_title || "N/A",
      h.homeowner_name || "N/A",
      h.property_address || "N/A",
      h.amount_formatted ?? formatCurrency(h.amount),
      h.status || "N/A",
      h.created_at || formatDate(h.inspection_date || h.paid_at),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v ?? ""}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `payout-history-${(inspectorInfo.name || inspector.name).replace(/\s+/g, "-").toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-roboto"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                {inspector.image ? (
                  <Image
                    src={inspector.image}
                    alt={inspector.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-indigo-600 font-bold text-sm">
                    {inspector.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base font-sora">{inspectorInfo.name || inspector.name}</h2>
              <p className="text-xs text-gray-500">{inspectorInfo.email || inspector.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primaryColor hover:opacity-90 rounded-lg cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50/50">
          {[
            {
              label: "Paid Out",
              value: inspectorInfo.total_paid_formatted ?? inspector.paid_amount_formatted ?? formatCurrency(inspectorInfo.total_paid ?? inspector.paid_amount),
              color: "text-emerald-600",
            },
            {
              label: "Pending",
              value: inspectorInfo.total_pending_formatted ?? inspector.pending_balance_formatted ?? formatCurrency(inspectorInfo.total_pending ?? inspector.pending_balance),
              color: "text-amber-600",
            },
            {
              label: "Stripe Status",
              value: inspectorInfo.stripe_connected ? "Connected" : "Not Connected",
              color: inspectorInfo.stripe_connected ? "text-indigo-600" : "text-gray-500",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 py-3 text-center">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{label}</p>
              <p className={`text-sm font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* History Table */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-primaryColor" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <DollarSign className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium text-sm">
                No payout history found for this inspector.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  <th className="py-3 px-4">Inspection / Property</th>
                  <th className="py-3 px-4">Homeowner</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h: any, idx: number) => {
                  const statusLower = String(h.status || "").toLowerCase();
                  return (
                    <tr key={h.payout_id || h.id || idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900 text-xs font-sora">
                          {h.inspection_title || `Booking #${h.booking_id}`}
                        </p>
                        <p className="text-[11px] text-gray-500 line-clamp-1 max-w-[240px]">
                          {h.property_address || `Booking #${h.booking_id}`}
                        </p>
                        <p className="text-[10px] text-gray-400">Booking #{h.booking_id}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-700 font-medium">
                        {h.homeowner_name || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {h.created_at || formatDate(h.inspection_date || h.paid_at)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 text-xs whitespace-nowrap">
                        {h.amount_formatted ?? formatCurrency(h.amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            statusLower === "paid"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : statusLower === "failed"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : "bg-amber-50 text-amber-600 border border-amber-200"
                          }`}
                        >
                          {statusLower === "paid" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {h.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InspectorEarnings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"total" | "paid" | "pending">("total");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [selectedInspector, setSelectedInspector] = useState<InspectorEarning | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 10;

  const { data, isLoading, isError } = useGetInspectorEarningsQuery();
  const rawEarnings = data?.data;
  const earnings: InspectorEarning[] = Array.isArray(rawEarnings)
    ? rawEarnings
    : Array.isArray(rawEarnings?.data)
    ? rawEarnings.data
    : Array.isArray(rawEarnings?.inspectors)
    ? rawEarnings.inspectors
    : [];

  // ── Aggregated totals ──
  const totals = useMemo(
    () =>
      earnings.reduce(
        (acc, e) => ({
          total: acc.total + (e.total_earnings ?? 0),
          paid: acc.paid + (e.paid_amount ?? 0),
          pending: acc.pending + (e.pending_balance ?? 0),
          stripe: acc.stripe + (e.stripe_connected ? 1 : 0),
        }),
        { total: 0, paid: 0, pending: 0, stripe: 0 }
      ),
    [earnings]
  );

  // ── Filter / Sort ──
  const filtered = useMemo(() => {
    let result = [...earnings];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter === "stripe") result = result.filter((e) => e.stripe_connected);
    else if (statusFilter === "no-stripe") result = result.filter((e) => !e.stripe_connected);

    const key =
      sortField === "total"
        ? "total_earnings"
        : sortField === "paid"
        ? "paid_amount"
        : "pending_balance";
    result.sort((a, b) =>
      sortDir === "desc"
        ? (b[key] ?? 0) - (a[key] ?? 0)
        : (a[key] ?? 0) - (b[key] ?? 0)
    );
    return result;
  }, [earnings, searchQuery, statusFilter, sortField, sortDir]);

  // ── Paginate ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  const getPageNumbers = (current: number, total: number, max = 7) => {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
    let start = Math.max(1, current - Math.floor(max / 2));
    let end = start + max - 1;
    if (end > total) { end = total; start = Math.max(1, end - max + 1); }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const toggleSort = (field: "total" | "paid" | "pending") => {
    if (sortField === field) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortField(field); setSortDir("desc"); }
    setCurrentPage(1);
  };

  const handleExportAll = () => {
    const headers = [
      "Name", "Email", "Status", "Stripe",
      "Total Earned", "Paid", "Pending", "Payout Status",
    ];
    const rows = filtered.map((e) => [
      e.name, e.email, e.status,
      e.stripe_connected ? "Connected" : "Not Connected",
      formatCurrency(e.total_earned ?? e.total_earnings),
      formatCurrency(e.total_paid ?? e.paid_amount),
      formatCurrency(e.total_pending ?? e.pending_balance),
      e.latest_payout_status ?? e.payout_status ?? "—",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "inspector-earnings.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full font-roboto">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
          label="Total Inspector Earnings"
          value={formatCurrency(totals.total)}
          color="bg-indigo-50"
          sub={`Across ${earnings.length} inspector${earnings.length !== 1 ? "s" : ""}`}
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          label="Total Paid Out"
          value={formatCurrency(totals.paid)}
          color="bg-emerald-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          label="Total Pending Balance"
          value={formatCurrency(totals.pending)}
          color="bg-amber-50"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-violet-600" />}
          label="Stripe Connected"
          value={`${totals.stripe} / ${earnings.length}`}
          color="bg-violet-50"
          sub="Inspectors with active Stripe"
        />
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between px-5 py-4 border-b border-gray-100">
          {/* Search */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-primaryColor focus:bg-white transition-all text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Filters + Sort + Export */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter pills */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg gap-0.5">
              {[
                { key: "all", label: "All" },
                { key: "stripe", label: "Stripe ✓" },
                { key: "no-stripe", label: "No Stripe" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setStatusFilter(key); setCurrentPage(1); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    statusFilter === key
                      ? "bg-white text-primaryColor shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={`${sortField}-${sortDir}`}
                onChange={(e) => {
                  const parts = e.target.value.split("-");
                  setSortField(parts[0] as "total" | "paid" | "pending");
                  setSortDir(parts[1] as "desc" | "asc");
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-2 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primaryColor cursor-pointer appearance-none"
              >
                <option value="total-desc">Total ↓</option>
                <option value="total-asc">Total ↑</option>
                <option value="paid-desc">Paid ↓</option>
                <option value="paid-asc">Paid ↑</option>
                <option value="pending-desc">Pending ↓</option>
                <option value="pending-asc">Pending ↑</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Export */}
            <button
              onClick={handleExportAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-primaryColor hover:opacity-90 text-white text-xs font-bold rounded-lg cursor-pointer transition-all active:scale-[0.98] shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[820px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                <th className="py-3.5 px-4">Inspector</th>
                <th className="py-3.5 px-4">Stripe</th>
                <th
                  className="py-3.5 px-4 cursor-pointer select-none hover:text-gray-900 transition-colors"
                  onClick={() => toggleSort("total")}
                >
                  <span className="flex items-center gap-1">
                    Total Earned
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        sortField === "total" && sortDir === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer select-none hover:text-gray-900 transition-colors"
                  onClick={() => toggleSort("paid")}
                >
                  <span className="flex items-center gap-1">
                    Paid Out
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        sortField === "paid" && sortDir === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer select-none hover:text-gray-900 transition-colors"
                  onClick={() => toggleSort("pending")}
                >
                  <span className="flex items-center gap-1">
                    Pending Balance
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        sortField === "pending" && sortDir === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </th>
                <th className="py-3.5 px-4">Payout Status</th>
                <th className="py-3.5 px-4 text-right">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(6)].map((_, i) => <RowSkeleton key={i} />)
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <AlertCircle className="w-8 h-8 text-red-300 mx-auto mb-2" />
                    <p className="text-red-400 text-sm font-medium">
                      Failed to load earnings. Please refresh.
                    </p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <DollarSign className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm font-medium">
                      No inspectors match your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((inspector: InspectorEarning) => (
                  <tr
                    key={inspector.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Inspector info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 shrink-0">
                          <div className="w-full h-full rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            {inspector.image ? (
                              <Image
                                src={inspector.image}
                                alt={inspector.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="text-indigo-600 font-bold text-xs">
                                {inspector.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                              inspector.status === "active"
                                ? "bg-emerald-500"
                                : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {inspector.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{inspector.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Stripe */}
                    <td className="py-4 px-4">
                      {inspector.stripe_connected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <BadgeCheck className="w-3 h-3" />
                          Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          <AlertCircle className="w-3 h-3" />
                          Not Connected
                        </span>
                      )}
                    </td>

                    {/* Total Earned */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900 text-sm">
                        {inspector.total_earned_formatted ??
                          inspector.total_earnings_formatted ??
                          formatCurrency(inspector.total_earned ?? inspector.total_earnings ?? 0)}
                      </p>
                    </td>

                    {/* Paid Out */}
                    <td className="py-4 px-4">
                      <p className="font-semibold text-emerald-600 text-sm">
                        {inspector.total_paid_formatted ??
                          inspector.paid_amount_formatted ??
                          formatCurrency(inspector.total_paid ?? inspector.paid_amount ?? 0)}
                      </p>
                    </td>

                    {/* Pending */}
                    <td className="py-4 px-4">
                      <p
                        className={`font-semibold text-sm ${
                          ((inspector.total_pending ?? inspector.pending_balance) ?? 0) > 0
                            ? "text-amber-600"
                            : "text-gray-400"
                        }`}
                      >
                        {inspector.total_pending_formatted ??
                          inspector.pending_balance_formatted ??
                          formatCurrency(inspector.total_pending ?? inspector.pending_balance ?? 0)}
                      </p>
                    </td>

                    {/* Payout Status */}
                    <td className="py-4 px-4">
                      {(() => {
                        const status = inspector.latest_payout_status || inspector.payout_status;
                        if (!status) return <span className="text-gray-400 text-xs">—</span>;
                        const statusLower = status.toLowerCase();
                        const colorClass =
                          statusLower === "paid"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : statusLower === "failed"
                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                            : statusLower === "partial"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-gray-100 text-gray-500 border border-gray-200";
                        return (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colorClass}`}
                          >
                            {status.replace("_", " ")}
                          </span>
                        );
                      })()}
                    </td>

                    {/* View History */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedInspector(inspector)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primaryColor hover:text-white bg-indigo-50 hover:bg-primaryColor rounded-lg cursor-pointer transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded transition text-xs font-semibold ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
              }`}
            >
              Prev
            </button>
            {getPageNumbers(currentPage, totalPages).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 border rounded text-xs font-semibold cursor-pointer transition ${
                  currentPage === p
                    ? "bg-primaryColor text-white border-primaryColor"
                    : "bg-white text-black border-primaryColor hover:bg-indigo-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded transition text-xs font-semibold ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Payout History Slide-Over */}
      {selectedInspector && (
        <PayoutHistoryModal
          inspector={selectedInspector}
          onClose={() => setSelectedInspector(null)}
        />
      )}
    </div>
  );
}
