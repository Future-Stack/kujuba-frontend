/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Download, Eye, Search, Loader2 } from "lucide-react";
import InspectionDetailsModal from "./InspectionDetailsModal";
import {
  useGetInspectionManagementQuery,
  useAssignInspectionMutation,
  useGetAvailableInspectorsQuery,
  useAcceptInspectorCancelRequestMutation,
  useDeclineInspectorCancelRequestMutation,
} from "@/app/redux/features/inspectionApi";
import { toast } from "react-toastify";
import CancelRequestModal from "./CancelRequestModal";
import AssignInspectorModal from "./RequestAssignModal";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type TabType = "All" | "Pending" | "Assigned" | "Completed" | "Cancelled";

interface HasCancelRequest {
  id: number;
  inspection_assign_id: number;
  inspection_booking_id: number | null;
  title: string;
  problem: string;
  created_at: string;
  updated_at: string;
}

interface ApiCard {
  id: number;
  inspection_assign_id: number;
  inspection_types: string[];
  property_address: string;
  property_type: string;
  property_size: string;
  property_img: string | null;
  urgent_status: number;
  status: string;
  assigned_inspector: string;
  assign_status: string;
  user_payment: string | null;
  inspection_report: string | null;
  ins_payment: string | null;
  has_cancel_request: HasCancelRequest | null;
}

interface ApiInspector {
  id: number;
  name: string;
  avatar?: string;
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

// map URL param -> TabType (note: your param values are lowercase, e.g. "completed", "pending")
const PARAM_TO_TAB: Record<string, TabType> = {
  pending: "Pending",
  assigned: "Assigned",
  completed: "Completed",
  canceled: "Cancelled", // careful: your param uses "canceled", your TabType uses "Cancelled"
};

function colorFor(idx: number) {
  return avatarColors[idx % avatarColors.length];
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

/**
 * FIXED: previously this function defaulted to "pending" for ANY card
 * that didn't match completed/cancelled/assigned — which silently pulled
 * in cards that shouldn't be pending (e.g. ones missing assign_status,
 * or with a status the backend wouldn't classify as pending).
 *
 * Now:
 * 1. We explicitly check for assign_status === "unassigned" (this is what
 *    the backend actually returns for pending cards per the API response).
 * 2. We only fall back to "pending" based on the `status` field, not blindly.
 */
function assignStatusToColumnKey(assignStatus: string, status: string, assignedInspector?: string): string {
  const s = (status || "").toLowerCase();
  const a = (assignStatus || "").toLowerCase();

  if (a === "completed" || s === "completed") return "completed";
  if (s === "cancelled" || s === "canceled" || a === "cancelled" || a === "canceled") return "canceled";

  // Pending is decided strictly by the `status` field (backend's source of truth),
  // NOT by assign_status ("unassigned") and NOT by whether an inspector is assigned.
  if (s === "pending") return "pending";

  if (a === "assigned") return "assigned";

  if (assignedInspector && assignedInspector.toLowerCase() !== "not assigned yet" && assignedInspector.trim() !== "") {
    return "assigned";
  }

  // Anything else (no inspector, status not "pending") still needs a bucket —
  // default to "assigned" so it doesn't inflate the pending count.
  return "assigned";
}

const COLUMN_META: Record<string, { title: string; headerBg: string }> = {
  pending: { title: "Pending Inspections", headerBg: "bg-[#FA9F15]" },
  assigned: { title: "Inspector Assigned", headerBg: "bg-[#4353FF]" },
  completed: { title: "Completed Inspections", headerBg: "bg-[#72C816]" },
  canceled: { title: "Canceled Inspections", headerBg: "bg-[#FA6161]" },
};

const COLUMN_ORDER = ["pending", "assigned", "completed", "canceled"];

const STATUS_TABS: { name: TabType; badge: string }[] = [
  { name: "All", badge: "bg-gray-900 text-white" },
  { name: "Pending", badge: "bg-[#FA9F15] text-white" },
  { name: "Assigned", badge: "bg-[#4353FF] text-white" },
  { name: "Completed", badge: "bg-[#72C816] text-white" },
  { name: "Cancelled", badge: "bg-[#FA6161] text-white" },
];

const TAB_TO_STATUS_PARAM: Record<Exclude<TabType, "All">, string> = {
  Pending: "pending",
  Assigned: "assigned",
  Completed: "completed",
  Cancelled: "canceled",
};

const CARDS_PER_PAGE = 12;

function downloadCSV(rows: ApiCard[]) {
  if (rows.length === 0) { toast.error("No data to export!"); return; }
  const headers = ["ID", "Inspection Types", "Property Address", "Property Type", "Property Size", "Urgent", "Status", "Assign Status", "Assigned Inspector", "User Payment", "Inspection Report", "Ins. Payment"];
  const escape = (val: string | null | undefined) => `"${String(val ?? "N/A").replace(/"/g, '""')}"`;
  const csvRows = rows.map((card) => [
    escape(String(card.id)), escape(card.inspection_types?.join(", ")),
    escape(card.property_address), escape(card.property_type), escape(card.property_size),
    escape(card.urgent_status === 1 ? "Yes" : "No"), escape(card.status),
    escape(card.assign_status), escape(card.assigned_inspector),
    escape(card.user_payment), escape(card.inspection_report), escape(card.ins_payment),
  ].join(","));
  const csv = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inspection_report_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success("Export successful!");
}

function InspectorDisplay({ name, idx }: { name: string; idx: number }) {
  const hasInspector = name && name.toLowerCase() !== "not assigned yet";
  if (!hasInspector) return <span className="text-[#B5BCC8] ml-1">Not assigned yet</span>;
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorFor(idx)}`}>
        {initials(name)}
      </div>
      <span className="text-gray-800 font-medium text-sm">{name}</span>
    </div>
  );
}

export default function InspectionBoardLayout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab");
  const initialTab = (tabParam && PARAM_TO_TAB[tabParam]) || "All";

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedColumnTitle, setSelectedColumnTitle] = useState("");
  const [selectedInspectorId, setSelectedInspectorId] = useState<number | null>(null);
  const [selectedAssignStatus, setSelectedAssignStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelViewCard, setCancelViewCard] = useState<ApiCard | null>(null);
  const [assignAfterAcceptCard, setAssignAfterAcceptCard] = useState<ApiCard | null>(null);
  const [acceptInspectorId, setAcceptInspectorId] = useState<number | null>(null);
  const [acceptDropdownOpen, setAcceptDropdownOpen] = useState(false);

  const statusParam = activeTab === "All" ? "" : TAB_TO_STATUS_PARAM[activeTab];

  const { data: boardApiData, isLoading: boardLoading, isFetching: boardFetching } =
    useGetInspectionManagementQuery(statusParam);
  const { data: inspectorsApiData } = useGetAvailableInspectorsQuery();
  const [assignInspection, { isLoading: assigning }] = useAssignInspectionMutation();
  const [acceptCancelRequest, { isLoading: accepting }] = useAcceptInspectorCancelRequestMutation();
  const [declineCancelRequest, { isLoading: declining }] = useDeclineInspectorCancelRequestMutation();

  const availableInspectors: ApiInspector[] = useMemo(
    () => inspectorsApiData?.data ?? inspectorsApiData ?? [],
    [inspectorsApiData]
  );

  const allCards: ApiCard[] = useMemo(
    () => boardApiData?.data ?? boardApiData ?? [],
    [boardApiData]
  );

  const boardColumns = useMemo(() => {
    const buckets: Record<string, ApiCard[]> = { pending: [], assigned: [], completed: [], canceled: [] };
    allCards.forEach((card) => {
      const key = assignStatusToColumnKey(card.assign_status, card.status, card.assigned_inspector);
      buckets[key].push(card);
    });
    return COLUMN_ORDER.map((key) => ({ key, ...COLUMN_META[key], cards: buckets[key] }));
  }, [allCards]);

  const tabCounts = useMemo(() => {
    const counts: Record<TabType, number> = { All: allCards.length, Pending: 0, Assigned: 0, Completed: 0, Cancelled: 0 };
    allCards.forEach((c) => {
      const key = assignStatusToColumnKey(c.assign_status, c.status, c.assigned_inspector);
      if (key === "pending") counts.Pending++;
      if (key === "assigned") counts.Assigned++;
      if (key === "completed") counts.Completed++;
      if (key === "canceled") counts.Cancelled++;
    });
    return counts;
  }, [allCards]);

  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return boardColumns;
    const q = searchQuery.toLowerCase();
    return boardColumns.map((col) => ({
      ...col,
      cards: col.cards.filter(
        (c) =>
          c.inspection_types.some((t) => t.toLowerCase().includes(q)) ||
          c.assigned_inspector.toLowerCase().includes(q) ||
          c.property_address.toLowerCase().includes(q)
      ),
    }));
  }, [boardColumns, searchQuery]);


  useEffect(() => {
    const t = searchParams.get("tab");
    setActiveTab((t && PARAM_TO_TAB[t]) || "All");
    setCurrentPage(1);
  }, [searchParams]);

  const allTabColumns = filteredColumns.map((col) => ({
    ...col,
    cards: col.cards.slice((currentPage - 1) * 4, currentPage * 4),
  }));

  // Single tab: flat card list, per page 12 cards
  const singleTabCards = useMemo(() => {
    if (activeTab === "All") return [];
    const tabToKey: Record<string, string> = {
      Pending: "pending", Assigned: "assigned", Completed: "completed", Cancelled: "canceled",
    };
    const key = tabToKey[activeTab];
    return filteredColumns.find((c) => c.key === key)?.cards ?? [];
  }, [activeTab, filteredColumns]);

  const pagedSingleCards = singleTabCards.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const totalPages = activeTab === "All"
    ? Math.max(1, Math.ceil(Math.max(...filteredColumns.map((c) => c.cards.length), 0) / 4))
    : Math.max(1, Math.ceil(singleTabCards.length / CARDS_PER_PAGE));

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleExportData = () => {
    let exportRows = allCards;
    if (activeTab !== "All") {
      const tabToKey: Record<string, string> = { Pending: "pending", Assigned: "assigned", Completed: "completed", Cancelled: "canceled" };
      const key = tabToKey[activeTab];
      exportRows = allCards.filter((c) => assignStatusToColumnKey(c.assign_status, c.status, c.assigned_inspector) === key);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      exportRows = exportRows.filter(
        (c) =>
          c.inspection_types.some((t) => t.toLowerCase().includes(q)) ||
          c.assigned_inspector.toLowerCase().includes(q) ||
          c.property_address.toLowerCase().includes(q)
      );
    }
    downloadCSV(exportRows);
  };

  const handleAssignInspector = async (bookingId: number, inspectorId: number) => {
    try {
      await assignInspection({ inspection_booking_id: bookingId, inspector_id: inspectorId }).unwrap();
      toast.success("Inspector assigned successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign inspector. Try again!");
    } finally {
      setOpenDropdownId(null);
    }
  };

  const handleDeclineCancelRequest = async (inspection_assign_id: number) => {
    try {
      await declineCancelRequest({ inspection_assign_id }).unwrap();
      toast.success("Cancel request declined!");
      setCancelViewCard(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to decline!");
    }
  };

  const handleAcceptCancelRequest = async () => {
    if (!assignAfterAcceptCard || !acceptInspectorId) { toast.error("Please select an inspector!"); return; }
    try {
      await acceptCancelRequest({
        inspection_assign_id: assignAfterAcceptCard.inspection_assign_id,
        inspector_id: acceptInspectorId,
      }).unwrap();
      toast.success("Inspector assigned & cancel accepted!");
      setAssignAfterAcceptCard(null);
      setAcceptInspectorId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to accept!");
    }
  };

  // ── renderCard function ───────────────────────────────────────────────────
  const renderCard = (card: ApiCard, idx: number, colKey: string) => {
    const isPending = colKey === "pending";
    const isCardCompleted = colKey === "completed";
    const isCardCanceled = colKey === "canceled";
    const dropdownKey = String(card.id);
    const displayTitle = card.inspection_types?.join(", ") || "Inspection";
    const hasInspector = card.assigned_inspector && card.assigned_inspector.toLowerCase() !== "not assigned yet";

    // ── Cancellation Request Card ─────────────────────────────────────────
    if (isCardCanceled && card.has_cancel_request) {
      return (
        <div key={card.id} className="bg-[#FEE2E24D] rounded-xl border border-red-500 px-2 py-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-red-500 font-bold font-roboto text-xl leading-6 mb-3">
                  Cancellation Request Received
                </p>
                <button
                  onClick={() => setCancelViewCard(card)}
                  className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>
              <p className="text-gray-600 text-xs font-normal font-roboto mt-0.5 leading-5">
                A cancellation request has been submitted by the assigned inspector and requires admin review.
              </p>
            </div>
          </div>

          <h4 className="font-bold text-gray-900 text-base font-roboto leading-5 mb-3">{displayTitle}</h4>

          <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-6 mb-4">
            <span>Assigned Inspector:</span>
            <InspectorDisplay name={card.assigned_inspector} idx={card.id} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleDeclineCancelRequest(card.inspection_assign_id)}
              disabled={declining}
              className="flex-1 py-2 rounded-sm bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
            >
              {declining ? "..." : "Decline"}
            </button>
            <button
              onClick={() => setCancelViewCard(card)}
              className="flex-1 py-2 rounded-sm bg-gray-900 hover:bg-black text-white text-sm font-medium transition-colors cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>
      );
    }

    // ── Normal Card ───────────────────────────────────────────────────────
    return (
      <div
        key={card.id}
        className={`bg-white rounded-xl border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-md ${card.urgent_status === 1 ? "border-red-300 ring-1 ring-red-400/5" : "border-gray-200"
          }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-gray-900 text-sm md:text-base leading-5">{displayTitle}</h4>
            {card.urgent_status === 1 && (
              <span className="bg-red-300 text-white text-[9px] font-normal px-1.5 py-0.5 rounded-full">Urgent</span>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedCardId(null);
              setSelectedAssignStatus("");
              setSelectedInspectorId(null);
              setTimeout(() => {
                setSelectedCardId(card.id);
                setSelectedAssignStatus(card.assign_status);
                setSelectedColumnTitle(COLUMN_META[colKey]?.title ?? "");
                const inspector = availableInspectors.find((i) => i.name === card.assigned_inspector);
                setSelectedInspectorId(inspector?.id ?? null);
              }, 0);
            }}
            className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-6 mb-4">
          <span>Assigned Inspector:</span>
          {hasInspector ? (
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorFor(idx)}`}>
                {initials(card.assigned_inspector)}
              </div>
              <span className="text-gray-800 font-medium text-sm">{card.assigned_inspector}</span>
            </div>
          ) : (
            <span className="text-[#B5BCC8] ml-1">Not assigned yet</span>
          )}
        </div>

        {isPending ? (
          <div className="relative flex items-center gap-3 mb-5 z-20">
            <p className="text-[#090909] text-sm font-medium leading-5 whitespace-nowrap">Assign Inspector</p>
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setOpenDropdownId(openDropdownId === dropdownKey ? null : dropdownKey)}
                className="w-full flex items-center justify-between bg-white border border-[#B5BCC8] text-[#B5BCC8] rounded-sm py-2 px-3 text-[11px] font-bold cursor-pointer"
              >
                <span>Select Inspector</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {openDropdownId === dropdownKey && (
                <div className="absolute left-0 mt-1 w-full rounded-sm border border-gray-100 bg-white shadow-lg z-30 max-h-40 overflow-y-auto">
                  {availableInspectors.length === 0 && (
                    <p className="px-3 py-2 text-[11px] text-gray-400">No inspectors available</p>
                  )}
                  {availableInspectors.map((insp) => (
                    <button
                      key={insp.id} type="button" disabled={assigning}
                      onClick={() => handleAssignInspector(card.id, insp.id)}
                      className="w-full text-left px-3 py-2 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {insp.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`w-full text-center py-2 rounded-sm border text-sm font-medium leading-5 mb-5 ${isCardCompleted ? "border-[#72C816] text-[#72C816] bg-[#72C816]/5" :
            isCardCanceled ? "border-[#FA6161]/30 text-[#FA6161] bg-[#FA6161]/5" :
              "border-[#4353FF] text-[#4353FF]"
            }`}>
            {isCardCompleted ? "Completed" : isCardCanceled ? "Cancelled" : "Inspector Assigned"}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 text-center pt-2">
          {[
            { label: "User Payment", value: card.user_payment },
            { label: "Inspection Report", value: card.inspection_report },
            { label: "Ins. Payment", value: card.ins_payment },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center justify-between min-h-[52px]">
              <span className={`text-xs mb-1 block w-full truncate ${!value ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
                {label}
              </span>
              <div className="w-full flex flex-col justify-end flex-1">
                <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">{value ?? ""}</span>
                <div className={`w-full h-[2px] mt-2 ${value ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-slate-50/40 min-h-screen my-6 md:my-12 font-roboto">
      <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6 bg-white">

        {/* ── Header bar ── */}
        <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">
            <div className="relative w-full lg:max-w-xs shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inspector, type or address..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.name}
                  // onClick={() => { setActiveTab(tab.name); setCurrentPage(1); }}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setCurrentPage(1);
                    const param = tab.name === "All" ? null : TAB_TO_STATUS_PARAM[tab.name];
                    router.replace(param ? `${pathname}?tab=${param}` : pathname);
                  }}
                  className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === tab.name ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                    }`}
                >
                  <span>{tab.name}</span>
                  <span className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] ${activeTab === tab.name ? "bg-white/20 text-white" : tab.badge
                    }`}>
                    {tabCounts[tab.name] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportData}
              disabled={boardLoading || allCards.length === 0}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm px-4 py-2 rounded-sm cursor-pointer shadow-md shadow-blue-100 transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export User Data</span>
            </button>
          </div>
        </div>

        {/* ── Board ── */}
        {boardLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading inspections…</span>
          </div>
        ) : activeTab === "All" ? (
          /* ── ALL TAB: 4 column board ── */
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start transition-opacity ${boardFetching ? "opacity-60 pointer-events-none" : ""}`}>
            {allTabColumns.map((column) => (
              <div key={column.key} className="flex flex-col gap-4">
                <div className={`w-full ${column.headerBg} text-white py-3 px-4 rounded-sm text-center text-xl font-semibold font-sora shadow-sm`}>
                  {column.title}
                </div>
                <div className="flex flex-col gap-3.5">
                  {column.cards.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-6">No inspections</p>
                  )}
                  {column.cards.map((card, idx) => renderCard(card, idx, column.key))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── SINGLE TAB: full screen grid ── */
          <div className={`transition-opacity ${boardFetching ? "opacity-60 pointer-events-none" : ""}`}>
            {pagedSingleCards.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6">No inspections</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {pagedSingleCards.map((card, idx) => {
                  const colKey = assignStatusToColumnKey(card.assign_status, card.status, card.assigned_inspector);
                  return renderCard(card, idx, colKey);
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Existing Details Modal ── */}
        {selectedCardId !== null && (
          <InspectionDetailsModal
            bookingId={selectedCardId}
            assignStatus={selectedAssignStatus}
            columnTitle={selectedColumnTitle}
            inspectorId={selectedInspectorId}
            onClose={() => { setSelectedCardId(null); setSelectedColumnTitle(""); }}
          />
        )}

        {cancelViewCard && (
          <CancelRequestModal
            cancelViewCard={cancelViewCard}
            setCancelViewCard={setCancelViewCard}
            setAssignAfterAcceptCard={setAssignAfterAcceptCard}
            setAcceptInspectorId={setAcceptInspectorId}
            setAcceptDropdownOpen={setAcceptDropdownOpen}
            handleDeclineCancelRequest={handleDeclineCancelRequest}
            declining={declining}
          />
        )}

        {assignAfterAcceptCard && (
          <AssignInspectorModal
            assignAfterAcceptCard={assignAfterAcceptCard}
            setAssignAfterAcceptCard={setAssignAfterAcceptCard}
            acceptInspectorId={acceptInspectorId}
            setAcceptInspectorId={setAcceptInspectorId}
            acceptDropdownOpen={acceptDropdownOpen}
            setAcceptDropdownOpen={setAcceptDropdownOpen}
            availableInspectors={availableInspectors}
            handleAcceptCancelRequest={handleAcceptCancelRequest}
            accepting={accepting}
          />
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage <= 1}
              className={`px-3 py-1 border rounded transition ${currentPage === 1
                ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
                }`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm cursor-pointer font-medium transition-colors ${page === currentPage
                  ? "bg-[#2563eb] text-white border border-[#2563eb]"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages}
              className={`px-3 py-1 border rounded transition ${currentPage === totalPages
                ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
                }`}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}






// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useMemo, useState } from "react";
// import { ChevronDown, Download, Eye, Search, Loader2, X } from "lucide-react";
// import InspectionDetailsModal from "./InspectionDetailsModal";
// import {
//   useGetInspectionManagementQuery,
//   useAssignInspectionMutation,
//   useGetAvailableInspectorsQuery,
//   useAcceptInspectorCancelRequestMutation,
//   useDeclineInspectorCancelRequestMutation,
// } from "@/app/redux/features/inspectionApi";
// import { toast } from "react-toastify";
// import CancelRequestModal from "./CancelRequestModal";
// import AssignInspectorModal from "./RequestAssignModal";



// type TabType = "All" | "Pending" | "Assigned" | "Completed" | "Cancelled";


// interface HasCancelRequest {
//   id: number;
//   inspection_assign_id: number;
//   inspection_booking_id: number | null;
//   title: string;
//   problem: string;
//   created_at: string;
//   updated_at: string;
// }

// interface ApiCard {
//   id: number;
//   inspection_assign_id: number;
//   inspection_types: string[];
//   property_address: string;
//   property_type: string;
//   property_size: string;
//   property_img: string | null;
//   urgent_status: number;
//   status: string;
//   assigned_inspector: string;
//   assign_status: string;
//   user_payment: string | null;
//   inspection_report: string | null;
//   ins_payment: string | null;
//   has_cancel_request: HasCancelRequest | null;
// }

// interface ApiInspector {
//   id: number;
//   name: string;
//   avatar?: string;
// }


// const avatarColors = [
//   "bg-blue-100 text-blue-700",
//   "bg-purple-100 text-purple-700",
//   "bg-emerald-100 text-emerald-700",
//   "bg-amber-100 text-amber-700",
//   "bg-rose-100 text-rose-700",
// ];

// function colorFor(idx: number) {
//   return avatarColors[idx % avatarColors.length];
// }

// function initials(name: string) {
//   return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
// }


// function assignStatusToColumnKey(assignStatus: string, status: string, assignedInspector?: string): string {
//   const s = status.toLowerCase();
//   const a = assignStatus.toLowerCase();

//   if (a === "completed" || s === "completed") return "completed";
//   if (s === "cancelled" || s === "canceled" || a === "cancelled" || a === "canceled") return "canceled";
//   if (a === "assigned") return "assigned";
//   if (a === "unassigned" || a === "pending") return "pending"; 


//   if (assignedInspector && assignedInspector.toLowerCase() !== "not assigned yet" && assignedInspector.trim() !== "") {
//     return "assigned";
//   }

//   return "pending";
// }

// const COLUMN_META: Record<string, { title: string; headerBg: string }> = {
//   pending: { title: "Pending Inspections", headerBg: "bg-[#FA9F15]" },
//   assigned: { title: "Inspector Assigned", headerBg: "bg-[#4353FF]" },
//   completed: { title: "Completed Inspections", headerBg: "bg-[#72C816]" },
//   canceled: { title: "Canceled Inspections", headerBg: "bg-[#FA6161]" },
// };

// const COLUMN_ORDER = ["pending", "assigned", "completed", "canceled"];

// const STATUS_TABS: { name: TabType; badge: string }[] = [
//   { name: "All", badge: "bg-gray-900 text-white" },
//   { name: "Pending", badge: "bg-[#FA9F15] text-white" },
//   { name: "Assigned", badge: "bg-[#4353FF] text-white" },
//   { name: "Completed", badge: "bg-[#72C816] text-white" },
//   { name: "Cancelled", badge: "bg-[#FA6161] text-white" },
// ];

// const TAB_TO_STATUS_PARAM: Record<Exclude<TabType, "All">, string> = {
//   Pending: "pending",
//   Assigned: "assigned",
//   Completed: "completed",
//   Cancelled: "canceled",
// };

// const CARDS_PER_PAGE = 4;

// // ── CSV helper ────────────────────────────────────────────────────────────────
// function downloadCSV(rows: ApiCard[]) {
//   if (rows.length === 0) {
//     toast.error("No data to export!");
//     return;
//   }

//   const headers = [
//     "ID",
//     "Inspection Types",
//     "Property Address",
//     "Property Type",
//     "Property Size",
//     "Urgent",
//     "Status",
//     "Assign Status",
//     "Assigned Inspector",
//     "User Payment",
//     "Inspection Report",
//     "Ins. Payment",
//   ];

//   const escape = (val: string | null | undefined) =>
//     `"${String(val ?? "N/A").replace(/"/g, '""')}"`;

//   const csvRows = rows.map((card) =>
//     [
//       escape(String(card.id)),
//       escape(card.inspection_types?.join(", ")),
//       escape(card.property_address),
//       escape(card.property_type),
//       escape(card.property_size),
//       escape(card.urgent_status === 1 ? "Yes" : "No"),
//       escape(card.status),
//       escape(card.assign_status),
//       escape(card.assigned_inspector),
//       escape(card.user_payment),
//       escape(card.inspection_report),
//       escape(card.ins_payment),
//     ].join(",")
//   );

//   const csv = [headers.join(","), ...csvRows].join("\n");
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `inspection_report_${new Date().toISOString().slice(0, 10)}.csv`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);

//   toast.success("Export successful!");
// }


// // ── Inspector Avatar Row ──────────────────────────────────────────────────────
// function InspectorDisplay({
//   name,
//   idx,
// }: {
//   name: string;
//   idx: number;
// }) {
//   const hasInspector = name && name.toLowerCase() !== "not assigned yet";
//   if (!hasInspector) {
//     return <span className="text-[#B5BCC8] ml-1">Not assigned yet</span>;
//   }
//   return (
//     <div className="flex items-center gap-1.5">
//       <div
//         className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorFor(idx)}`}
//       >
//         {initials(name)}
//       </div>
//       <span className="text-gray-800 font-medium text-sm">{name}</span>
//     </div>
//   );
// }


// export default function InspectionBoardLayout() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState<TabType>("All");
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
//   const [selectedColumnTitle, setSelectedColumnTitle] = useState("");
//   const [selectedInspectorId, setSelectedInspectorId] = useState<number | null>(null);
//   const [selectedAssignStatus, setSelectedAssignStatus] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   // ── Cancel request modal states ───────────────────────────────────────────
//   const [cancelViewCard, setCancelViewCard] = useState<ApiCard | null>(null);
//   const [assignAfterAcceptCard, setAssignAfterAcceptCard] = useState<ApiCard | null>(null);
//   const [acceptInspectorId, setAcceptInspectorId] = useState<number | null>(null);
//   const [acceptDropdownOpen, setAcceptDropdownOpen] = useState(false);

//   const statusParam = activeTab === "All" ? "" : TAB_TO_STATUS_PARAM[activeTab];

//   const { data: boardApiData, isLoading: boardLoading, isFetching: boardFetching } =
//     useGetInspectionManagementQuery(statusParam);

//   const { data: inspectorsApiData } = useGetAvailableInspectorsQuery();

//   const [assignInspection, { isLoading: assigning }] = useAssignInspectionMutation();
//   const [acceptCancelRequest, { isLoading: accepting }] = useAcceptInspectorCancelRequestMutation();
//   const [declineCancelRequest, { isLoading: declining }] = useDeclineInspectorCancelRequestMutation();

//   // ── Derived data ──────────────────────────────────────────────────────────
//   const availableInspectors: ApiInspector[] = useMemo(
//     () => inspectorsApiData?.data ?? inspectorsApiData ?? [],
//     [inspectorsApiData]
//   );

//   const allCards: ApiCard[] = useMemo(
//     () => boardApiData?.data ?? boardApiData ?? [],
//     [boardApiData]
//   );

//   const boardColumns = useMemo(() => {
//     const buckets: Record<string, ApiCard[]> = {
//       pending: [], assigned: [], completed: [], canceled: [],
//     };
//     allCards.forEach((card) => {
//       const key = assignStatusToColumnKey(card.assign_status, card.status, card.assigned_inspector);
//       buckets[key].push(card);
//     });
//     return COLUMN_ORDER.map((key) => ({
//       key,
//       ...COLUMN_META[key],
//       cards: buckets[key],
//     }));
//   }, [allCards]);

//   const tabCounts = useMemo(() => {
//     const counts: Record<TabType, number> = {
//       All: allCards.length,
//       Pending: 0, Assigned: 0, Completed: 0, Cancelled: 0,
//     };
//     allCards.forEach((c) => {
//       const key = assignStatusToColumnKey(c.assign_status, c.status, c.assigned_inspector);
//       if (key === "pending") counts.Pending++;
//       if (key === "assigned") counts.Assigned++;
//       if (key === "completed") counts.Completed++;
//       if (key === "canceled") counts.Cancelled++;
//     });
//     return counts;
//   }, [allCards]);

//   const filteredColumns = useMemo(() => {
//     if (!searchQuery.trim()) return boardColumns;
//     const q = searchQuery.toLowerCase();
//     return boardColumns.map((col) => ({
//       ...col,
//       cards: col.cards.filter(
//         (c) =>
//           c.inspection_types.some((t) => t.toLowerCase().includes(q)) ||
//           c.assigned_inspector.toLowerCase().includes(q) ||
//           c.property_address.toLowerCase().includes(q)
//       ),
//     }));
//   }, [boardColumns, searchQuery]);

//   const pagedColumns = filteredColumns
//     .filter((col) => {
//       if (activeTab === "All") return true;
//       const tabToKey: Record<string, string> = {
//         Pending: "pending", Assigned: "assigned",
//         Completed: "completed", Cancelled: "canceled",
//       };
//       return col.key === tabToKey[activeTab];
//     })
//     .map((col) => ({
//       ...col,
//       cards: col.cards.slice(
//         (currentPage - 1) * CARDS_PER_PAGE,
//         currentPage * CARDS_PER_PAGE
//       ),
//     }));

//   const relevantCardCount = (() => {
//     if (activeTab === "All") {
//       return Math.max(...filteredColumns.map((col) => col.cards.length), 0);
//     }
//     const tabToKey: Record<string, string> = {
//       Pending: "pending", Assigned: "assigned",
//       Completed: "completed", Cancelled: "canceled",
//     };
//     const key = tabToKey[activeTab];
//     const col = filteredColumns.find((c) => c.key === key);
//     return col?.cards.length ?? 0;
//   })();

//   const totalPages = Math.max(1, Math.ceil(relevantCardCount / CARDS_PER_PAGE));

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const handleExportData = () => {
//     let exportRows = allCards;
//     if (activeTab !== "All") {
//       const tabToKey: Record<string, string> = {
//         Pending: "pending", Assigned: "assigned",
//         Completed: "completed", Cancelled: "canceled",
//       };
//       const key = tabToKey[activeTab];
//       exportRows = allCards.filter(
//         (c) => assignStatusToColumnKey(c.assign_status, c.status) === key
//       );
//     }
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       exportRows = exportRows.filter(
//         (c) =>
//           c.inspection_types.some((t) => t.toLowerCase().includes(q)) ||
//           c.assigned_inspector.toLowerCase().includes(q) ||
//           c.property_address.toLowerCase().includes(q)
//       );
//     }
//     downloadCSV(exportRows);
//   };

//   const handleAssignInspector = async (bookingId: number, inspectorId: number) => {
//     try {
//       await assignInspection({
//         inspection_booking_id: bookingId,
//         inspector_id: inspectorId,
//       }).unwrap();
//       toast.success("Inspector assigned successfully!");
//     } catch (err: any) {
//       console.error("Assign failed:", err);
//       toast.error(err?.data?.message || "Failed to assign inspector. Try again!");
//     } finally {
//       setOpenDropdownId(null);
//     }
//   };

//   const handleDeclineCancelRequest = async (inspection_assign_id: number) => {
//     try {
//       await declineCancelRequest({ inspection_assign_id }).unwrap();
//       toast.success("Cancel request declined!");
//       setCancelViewCard(null);
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to decline!");
//     }
//   };

//   const handleAcceptCancelRequest = async () => {
//     if (!assignAfterAcceptCard || !acceptInspectorId) {
//       toast.error("Please select an inspector!");
//       return;
//     }
//     try {
//       await acceptCancelRequest({
//         inspection_assign_id: assignAfterAcceptCard.inspection_assign_id,
//         inspector_id: acceptInspectorId,
//       }).unwrap();
//       toast.success("Inspector assigned & cancel accepted!");
//       setAssignAfterAcceptCard(null);
//       setAcceptInspectorId(null);
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to accept!");
//     }
//   };

//   return (
//     <div className="w-full bg-slate-50/40 min-h-screen my-6 md:my-12 font-roboto">
//       <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6 bg-white">

//         {/* ── Header bar ── */}
//         <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">
//           <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">

//             {/* Search */}
//             <div className="relative w-full lg:max-w-xs shrink-0">
//               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search inspector, type or address..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
//               />
//             </div>

//             {/* Status tabs */}
//             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
//               {STATUS_TABS.map((tab) => (
//                 <button
//                   key={tab.name}
//                   onClick={() => {
//                     setActiveTab(tab.name);
//                     setCurrentPage(1);
//                   }}
//                   className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === tab.name
//                       ? "bg-black text-white"
//                       : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
//                     }`}
//                 >
//                   <span>{tab.name}</span>
//                   <span className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] ${activeTab === tab.name ? "bg-white/20 text-white" : tab.badge
//                     }`}>
//                     {tabCounts[tab.name] ?? 0}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Export button */}
//           <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
//             <button
//               onClick={handleExportData}
//               disabled={boardLoading || allCards.length === 0}
//               className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm px-4 py-2 rounded-sm cursor-pointer shadow-md shadow-blue-100 transition-all"
//             >
//               <Download className="w-4 h-4 stroke-[2.5]" />
//               <span>Export User Data</span>
//             </button>
//           </div>
//         </div>

//         {/* ── Board ── */}
//         {boardLoading ? (
//           <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
//             <Loader2 className="w-5 h-5 animate-spin" />
//             <span className="text-sm">Loading inspections…</span>
//           </div>
//         ) : (
//             <div className={`grid gap-5 items-start transition-opacity ${activeTab === "All"
//                 ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
//                 : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
//               } ${boardFetching ? "opacity-60 pointer-events-none" : ""}`}>
//             {pagedColumns.map((column) => (
//               <div key={column.key} className="flex flex-col gap-4">

//                 {/* Column header */}
//                 <div className={`w-full ${column.headerBg} text-white py-3 px-4 rounded-sm text-center text-xl font-semibold font-sora shadow-sm`}>
//                   {column.title}
//                 </div>

//                 <div className="flex flex-col gap-3.5">
//                   {column.cards.length === 0 && (
//                     <p className="text-center text-xs text-gray-400 py-6">No inspections</p>
//                   )}

//                   {column.cards.map((card, idx) => {
//                     const colKey = assignStatusToColumnKey(card.assign_status, card.status, card.assigned_inspector);
//                     const isPending = colKey === "pending";
//                     const isCardCompleted = colKey === "completed";
//                     const isCardCanceled = colKey === "canceled";
//                     const dropdownKey = String(card.id);
//                     const displayTitle = card.inspection_types?.join(", ") || "Inspection";
//                     const hasInspector =
//                       card.assigned_inspector &&
//                       card.assigned_inspector.toLowerCase() !== "not assigned yet";

//                     // ── Cancellation Request Card ─────────────────────────
//                     if (isCardCanceled && card.has_cancel_request) {
//                       return (
//                         <div
//                           key={card.id}
//                           className="bg-[#FEE2E24D] rounded-xl border border-red-500  px-2 py-3 "
//                         >
//                           {/* Cancel card header */}
//                           <div className="flex items-start justify-between  mb-3">
//                             <div className="flex-1">
//                               <div className="flex lex items-start justify-between gap-2">
//                                 <p className="text-red-500 font-bold font-roboto text-xl leading-6 mb-3">
//                                   Cancellation Request Received
//                                 </p>
//                                 <button
//                                   onClick={() => setCancelViewCard(card)}
//                                   className="w-7 h-7 rounded-lg bg-slate-50 -mt-2 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors shrink-0 mt-0.5"
//                                 >
//                                   <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
//                                 </button>
//                           </div>
//                               <p className="text-gray-600 text-xs font-normal font-roboto mt-0.5 leading-5">
//                                 A cancellation request has been submitted by the assigned inspector and requires admin review.
//                               </p>
//                             </div>
                           
//                           </div>

//                           {/* Inspection type */}
//                           <h4 className="font-bold text-gray-900 text-base font-roboto leading-5 mb-3">
//                             {displayTitle}
//                           </h4>

//                           {/* Inspector */}
//                           <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-6 mb-4">
//                             <span>Assigned Inspector:</span>
//                             <InspectorDisplay name={card.assigned_inspector} idx={idx} />
//                           </div>

//                           {/* Action buttons */}
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleDeclineCancelRequest(card.inspection_assign_id)}
//                               disabled={declining}
//                               className="flex-1 py-2 rounded-sm bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
//                             >
//                               {declining ? "..." : "Decline"}
//                             </button>
//                             <button
//                               onClick={() => setCancelViewCard(card)}
//                               className="flex-1 py-2 rounded-sm bg-gray-900 hover:bg-black text-white text-sm font-medium transition-colors cursor-pointer"
//                             >
//                               View Details
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     }

//                     // ── Normal Card ───────────────────────────────────────
//                     return (
//                       <div
//                         key={card.id}
//                         className={`bg-white rounded-xl border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-md ${card.urgent_status === 1 ? "border-red-300 ring-1 ring-red-400/5" : "border-gray-200"
//                           }`}
//                       >
//                         {/* Card header */}
//                         <div className="flex items-center justify-between gap-2 mb-3">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <h4 className="font-bold text-gray-900 text-sm md:text-base leading-5">
//                               {displayTitle}
//                             </h4>
//                             {card.urgent_status === 1 && (
//                               <span className="bg-red-300 text-white text-[9px] font-normal px-1.5 py-0.5 rounded-full">
//                                 Urgent
//                               </span>
//                             )}
//                           </div>
//                           <button
//                             onClick={() => {
//                               setSelectedCardId(null);
//                               setSelectedAssignStatus("");
//                               setSelectedInspectorId(null);
//                               setTimeout(() => {
//                                 setSelectedCardId(card.id);
//                                 setSelectedAssignStatus(card.assign_status);
//                                 setSelectedColumnTitle(column.title);
//                                 const inspector = availableInspectors.find(
//                                   (i) => i.name === card.assigned_inspector
//                                 );
//                                 setSelectedInspectorId(inspector?.id ?? null);
//                               }, 0);
//                             }}
//                             className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
//                           >
//                             <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
//                           </button>
//                         </div>

//                         {/* Assigned inspector */}
//                         <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-6 mb-4">
//                           <span>Assigned Inspector:</span>
//                           {hasInspector ? (
//                             <div className="flex items-center gap-1.5">
//                               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorFor(idx)}`}>
//                                 {initials(card.assigned_inspector)}
//                               </div>
//                               <span className="text-gray-800 font-medium text-sm">
//                                 {card.assigned_inspector}
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="text-[#B5BCC8] ml-1">Not assigned yet</span>
//                           )}
//                         </div>

//                         {/* Status / assign dropdown */}
//                         {isPending ? (
//                           <div className="relative flex items-center gap-3 mb-5 z-20">
//                             <p className="text-[#090909] text-sm font-medium leading-5 whitespace-nowrap">
//                               Assign Inspector
//                             </p>
//                             <div className="relative w-full">
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   setOpenDropdownId(openDropdownId === dropdownKey ? null : dropdownKey)
//                                 }
//                                 className="w-full flex items-center justify-between bg-white border border-[#B5BCC8] text-[#B5BCC8] rounded-sm py-2 px-3 text-[11px] font-bold cursor-pointer"
//                               >
//                                 <span>Select Inspector</span>
//                                 <ChevronDown className="w-3 h-3 text-gray-400" />
//                               </button>
//                               {openDropdownId === dropdownKey && (
//                                 <div className="absolute left-0 mt-1 w-full rounded-sm border border-gray-100 bg-white shadow-lg z-30 max-h-40 overflow-y-auto">
//                                   {availableInspectors.length === 0 && (
//                                     <p className="px-3 py-2 text-[11px] text-gray-400">No inspectors available</p>
//                                   )}
//                                   {availableInspectors.map((insp) => (
//                                     <button
//                                       key={insp.id}
//                                       type="button"
//                                       disabled={assigning}
//                                       onClick={() => handleAssignInspector(card.id, insp.id)}
//                                       className="w-full text-left px-3 py-2 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
//                                     >
//                                       {insp.name}
//                                     </button>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ) : (
//                           <div className={`w-full text-center py-2 rounded-sm border text-sm font-medium leading-5 mb-5 ${isCardCompleted ? "border-[#72C816] text-[#72C816] bg-[#72C816]/5" :
//                               isCardCanceled ? "border-[#FA6161]/30 text-[#FA6161] bg-[#FA6161]/5" :
//                                 "border-[#4353FF] text-[#4353FF]"
//                             }`}>
//                             {isCardCompleted ? "Completed" : isCardCanceled ? "Cancelled" : "Inspector Assigned"}
//                           </div>
//                         )}

//                         {/* Payment / report info */}
//                         <div className="grid grid-cols-3 gap-3 text-center pt-2">

//                           <div className="flex flex-col items-center justify-between min-h-[52px]">
//                             <span className={`text-xs mb-1 block w-full truncate ${!card.user_payment ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
//                               User Payment
//                             </span>
//                             <div className="w-full flex flex-col justify-end flex-1">
//                               <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
//                                 {card.user_payment ?? ""}
//                               </span>
//                               <div className={`w-full h-[2px] mt-2 ${card.user_payment ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
//                             </div>
//                           </div>

//                           <div className="flex flex-col items-center justify-between min-h-[52px]">
//                             <span className={`text-xs mb-1 block w-full truncate ${!card.inspection_report ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
//                               Inspection Report
//                             </span>
//                             <div className="w-full flex flex-col justify-end flex-1">
//                               <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
//                                 {card.inspection_report ?? ""}
//                               </span>
//                               <div className={`w-full h-[2px] mt-2 ${card.inspection_report ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
//                             </div>
//                           </div>

//                           <div className="flex flex-col items-center justify-between min-h-[52px]">
//                             <span className={`text-xs mb-1 block w-full truncate ${!card.ins_payment ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
//                               Ins. Payment
//                             </span>
//                             <div className="w-full flex flex-col justify-end flex-1">
//                               <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
//                                 {card.ins_payment ?? ""}
//                               </span>
//                               <div className={`w-full h-[2px] mt-2 ${card.ins_payment ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
//                             </div>
//                           </div>

//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── Existing Details Modal ── */}
//         {selectedCardId !== null && (
//           <InspectionDetailsModal
//             bookingId={selectedCardId}
//             assignStatus={selectedAssignStatus}
//             columnTitle={selectedColumnTitle}
//             inspectorId={selectedInspectorId}
//             onClose={() => {
//               setSelectedCardId(null);
//               setSelectedColumnTitle("");
//             }}
//           />
//         )}

//         {/* ── Cancel Request: View Details Modal ── */}
//         {cancelViewCard && (
//           <CancelRequestModal
//             cancelViewCard={cancelViewCard}
//             setCancelViewCard={setCancelViewCard}
//             setAssignAfterAcceptCard={setAssignAfterAcceptCard}
//             setAcceptInspectorId={setAcceptInspectorId}
//             setAcceptDropdownOpen={setAcceptDropdownOpen}
//             handleDeclineCancelRequest={handleDeclineCancelRequest}
//             declining={declining}
//           />
//         )}

//         {/* ── Cancel Accept: Assign Inspector Modal ── */}
//         {assignAfterAcceptCard && (
//           <AssignInspectorModal
//             assignAfterAcceptCard={assignAfterAcceptCard}
//             setAssignAfterAcceptCard={setAssignAfterAcceptCard}
//             acceptInspectorId={acceptInspectorId}
//             setAcceptInspectorId={setAcceptInspectorId}
//             acceptDropdownOpen={acceptDropdownOpen}
//             setAcceptDropdownOpen={setAcceptDropdownOpen}
//             availableInspectors={availableInspectors}
//             handleAcceptCancelRequest={handleAcceptCancelRequest}
//             accepting={accepting}
//           />
//         )}

//         {/* ── Pagination ── */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
//             <button
//               onClick={() => setCurrentPage((p) => p - 1)}
//               disabled={currentPage <= 1}
//               className={`px-3 py-1 border rounded transition ${currentPage === 1
//                   ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
//                   : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
//                 }`}
//             >
//               Prev
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`w-8 h-8 flex items-center justify-center rounded text-sm cursor-pointer font-medium transition-colors ${page === currentPage
//                     ? "bg-[#2563eb] text-white border border-[#2563eb]"
//                     : "border border-gray-200 text-gray-600 hover:bg-gray-50"
//                   }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button
//               onClick={() => setCurrentPage((p) => p + 1)}
//               disabled={currentPage >= totalPages}
//               className={`px-3 py-1 border rounded transition ${currentPage === totalPages
//                   ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
//                   : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
//                 }`}
//             >
//               Next
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

