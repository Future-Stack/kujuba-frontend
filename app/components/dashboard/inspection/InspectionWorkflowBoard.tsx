/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, Download, Eye, Search, Loader2 } from "lucide-react";
import InspectionDetailsModal from "./InspectionDetailsModal";
import {
  useGetInspectionManagementQuery,
  useAssignInspectionMutation,
  useGetAvailableInspectorsQuery,
} from "@/app/redux/features/inspectionApi";
import { toast } from "react-toastify";



type TabType = "All" | "Pending" | "Assigned" | "Completed" | "Cancelled";


interface ApiCard {
  id: number;
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

function colorFor(idx: number) {
  return avatarColors[idx % avatarColors.length];
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}


function assignStatusToColumnKey(assignStatus: string, status: string, assignedInspector?: string): string {
  const s = status.toLowerCase();
  const a = assignStatus.toLowerCase();
  
  if (a === "completed" || s === "completed") return "completed";
  if (s === "cancelled" || s === "canceled" || a === "cancelled" || a === "canceled") return "canceled";
  if (a === "assigned") return "assigned";
  
  if (assignedInspector && assignedInspector.toLowerCase() !== "not assigned yet" && assignedInspector.trim() !== "") {
    return "assigned";
  }
  
  return "pending";
}

const COLUMN_META: Record<string, { title: string; headerBg: string }> = {
  pending:   { title: "Pending Inspections",   headerBg: "bg-[#FA9F15]" },
  assigned:  { title: "Inspector Assigned",    headerBg: "bg-[#4353FF]" },
  completed: { title: "Completed Inspections", headerBg: "bg-[#72C816]" },
  canceled:  { title: "Canceled Inspections",  headerBg: "bg-[#FA6161]" },
};

const COLUMN_ORDER = ["pending", "assigned", "completed", "canceled"];

const STATUS_TABS: { name: TabType; badge: string }[] = [
  { name: "All",       badge: "bg-gray-900 text-white" },
  { name: "Pending",   badge: "bg-[#FA9F15] text-white" },
  { name: "Assigned",  badge: "bg-[#4353FF] text-white" },
  { name: "Completed", badge: "bg-[#72C816] text-white" },
  { name: "Cancelled", badge: "bg-[#FA6161] text-white" },
];

const TAB_TO_STATUS_PARAM: Record<Exclude<TabType, "All">, string> = {
  Pending:   "pending",
  Assigned:  "assigned",
  Completed: "completed",
  Cancelled: "canceled",
};

const CARDS_PER_PAGE = 4;

// ── CSV helper ────────────────────────────────────────────────────────────────
function downloadCSV(rows: ApiCard[]) {
  if (rows.length === 0) {
    toast.error("No data to export!");
    return;
  }

  const headers = [
    "ID",
    "Inspection Types",
    "Property Address",
    "Property Type",
    "Property Size",
    "Urgent",
    "Status",
    "Assign Status",
    "Assigned Inspector",
    "User Payment",
    "Inspection Report",
    "Ins. Payment",
  ];

  const escape = (val: string | null | undefined) =>
    `"${String(val ?? "N/A").replace(/"/g, '""')}"`;

  const csvRows = rows.map((card) =>
    [
      escape(String(card.id)),
      escape(card.inspection_types?.join(", ")),
      escape(card.property_address),
      escape(card.property_type),
      escape(card.property_size),
      escape(card.urgent_status === 1 ? "Yes" : "No"),
      escape(card.status),
      escape(card.assign_status),
      escape(card.assigned_inspector),
      escape(card.user_payment),
      escape(card.inspection_report),
      escape(card.ins_payment),
    ].join(",")
  );

  const csv = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href     = url;
  link.download = `inspection_report_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success("Export successful!");
}



export default function InspectionBoardLayout() {
  const [searchQuery, setSearchQuery]                   = useState("");
  const [activeTab, setActiveTab]                       = useState<TabType>("All");
  const [openDropdownId, setOpenDropdownId]             = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId]             = useState<number | null>(null);
  const [selectedColumnTitle, setSelectedColumnTitle]   = useState("");
  const [selectedInspectorId, setSelectedInspectorId]   = useState<number | null>(null);
  const [selectedAssignStatus, setSelectedAssignStatus] = useState("");
  const [currentPage, setCurrentPage]                   = useState(1);

  const statusParam = activeTab === "All" ? "" : TAB_TO_STATUS_PARAM[activeTab];


  const { data: boardApiData, isLoading: boardLoading, isFetching: boardFetching } =
    useGetInspectionManagementQuery(statusParam);

  const { data: inspectorsApiData } = useGetAvailableInspectorsQuery();

  const [assignInspection, { isLoading: assigning }] = useAssignInspectionMutation();

  // ── Derived data ─────────────────────────────────────────────────────────
  const availableInspectors: ApiInspector[] = useMemo(
    () => inspectorsApiData?.data ?? inspectorsApiData ?? [],
    [inspectorsApiData]
  );

  const allCards: ApiCard[] = useMemo(
    () => boardApiData?.data ?? boardApiData ?? [],
    [boardApiData]
  );

const boardColumns = useMemo(() => {
  const buckets: Record<string, ApiCard[]> = {
    pending: [], assigned: [], completed: [], canceled: [],
  };
  allCards.forEach((card) => {
    const key = assignStatusToColumnKey(card.assign_status, card.status, card.assigned_inspector); // ← add করো
    buckets[key].push(card);
  });
  return COLUMN_ORDER.map((key) => ({
    key,
    ...COLUMN_META[key],
    cards: buckets[key],
  }));
}, [allCards]);

const tabCounts = useMemo(() => {
  const counts: Record<TabType, number> = {
    All: allCards.length,
    Pending: 0, Assigned: 0, Completed: 0, Cancelled: 0,
  };
  allCards.forEach((c) => {
    const key = assignStatusToColumnKey(c.assign_status, c.status, c.assigned_inspector); // ← assigned_inspector add করো
    if (key === "pending")   counts.Pending++;
    if (key === "assigned")  counts.Assigned++;
    if (key === "completed") counts.Completed++;
    if (key === "canceled")  counts.Cancelled++;
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


  const pagedColumns = filteredColumns
    .filter((col) => {
      if (activeTab === "All") return true;
      const tabToKey: Record<string, string> = {
        Pending: "pending", Assigned: "assigned",
        Completed: "completed", Cancelled: "canceled",
      };
      return col.key === tabToKey[activeTab];
    })
    .map((col) => ({
      ...col,
      cards: col.cards.slice(
        (currentPage - 1) * CARDS_PER_PAGE,
        currentPage * CARDS_PER_PAGE
      ),
    }));

  const relevantCardCount = (() => {
    if (activeTab === "All") {
      return Math.max(...filteredColumns.map((col) => col.cards.length), 0);
    }
    const tabToKey: Record<string, string> = {
      Pending: "pending", Assigned: "assigned",
      Completed: "completed", Cancelled: "canceled",
    };
    const key = tabToKey[activeTab];
    const col = filteredColumns.find((c) => c.key === key);
    return col?.cards.length ?? 0;
  })();

  const totalPages = Math.max(1, Math.ceil(relevantCardCount / CARDS_PER_PAGE));

 
  const handleExportData = () => {
   
    let exportRows = allCards;

    if (activeTab !== "All") {
      const tabToKey: Record<string, string> = {
        Pending: "pending", Assigned: "assigned",
        Completed: "completed", Cancelled: "canceled",
      };
      const key = tabToKey[activeTab];
      exportRows = allCards.filter(
        (c) => assignStatusToColumnKey(c.assign_status, c.status) === key
      );
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
      await assignInspection({
        inspection_booking_id: bookingId,
        inspector_id: inspectorId,
      }).unwrap();
      toast.success("Inspector assigned successfully!");
    } catch (err: any) {
      console.error("Assign failed:", err);
      toast.error(err?.data?.message || "Failed to assign inspector. Try again!");
    } finally {
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="w-full bg-slate-50/40 min-h-screen my-6 md:my-12 font-roboto">
      <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6 bg-white">

        {/* ── Header bar ── */}
        <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">

            {/* Search */}
            <div className="relative w-full lg:max-w-xs shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inspector, type or address..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
              />
            </div>

            {/* Status tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.name
                      ? "bg-black text-white"
                      : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                  }`}
                >
                  <span>{tab.name}</span>
                  <span className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] ${
                    activeTab === tab.name ? "bg-white/20 text-white" : tab.badge
                  }`}>
                    {tabCounts[tab.name] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Export button */}
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
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start transition-opacity ${boardFetching ? "opacity-60 pointer-events-none" : ""}`}>
            {pagedColumns.map((column) => (
              <div key={column.key} className="flex flex-col gap-4">

                {/* Column header */}
                <div className={`w-full ${column.headerBg} text-white py-3 px-4 rounded-sm text-center text-xl font-semibold font-sora shadow-sm`}>
                  {column.title}
                </div>

                <div className="flex flex-col gap-3.5">
                  {column.cards.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-6">No inspections</p>
                  )}

                  {column.cards.map((card, idx) => {
                   const colKey = assignStatusToColumnKey(card.assign_status, card.status, card.assigned_inspector);
                    const isPending       = colKey === "pending";
                    const isCardCompleted = colKey === "completed";
                    const isCardCanceled  = colKey === "canceled";
                    const dropdownKey     = String(card.id);
                    const displayTitle    = card.inspection_types?.join(", ") || "Inspection";
                    const hasInspector    =
                      card.assigned_inspector &&
                      card.assigned_inspector.toLowerCase() !== "not assigned yet";

                    return (
                      <div
                        key={card.id}
                        className={`bg-white rounded-xl border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-md ${
                          card.urgent_status === 1 ? "border-red-300 ring-1 ring-red-400/5" : "border-gray-200"
                        }`}
                      >
                        {/* Card header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-gray-900 text-sm md:text-base leading-5">
                              {displayTitle}
                            </h4>
                            {card.urgent_status === 1 && (
                              <span className="bg-red-300 text-white text-[9px] font-normal px-1.5 py-0.5 rounded-full">
                                Urgent
                              </span>
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
                                setSelectedColumnTitle(column.title);
                                const inspector = availableInspectors.find(
                                  (i) => i.name === card.assigned_inspector
                                );
                                setSelectedInspectorId(inspector?.id ?? null);
                              }, 0);
                            }}
                            className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
                          </button>
                        </div>

                        {/* Assigned inspector */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-6 mb-4">
                          <span>Assigned Inspector:</span>
                          {hasInspector ? (
                            <div className="flex items-center gap-1.5">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorFor(idx)}`}>
                                {initials(card.assigned_inspector)}
                              </div>
                              <span className="text-gray-800 font-medium text-sm">
                                {card.assigned_inspector}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#B5BCC8] ml-1">Not assigned yet</span>
                          )}
                        </div>

                        {/* Status / assign dropdown */}
                        {isPending ? (
                          <div className="relative flex items-center gap-3 mb-5 z-20">
                            <p className="text-[#090909] text-sm font-medium leading-5 whitespace-nowrap">
                              Assign Inspector
                            </p>
                            <div className="relative w-full">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenDropdownId(openDropdownId === dropdownKey ? null : dropdownKey)
                                }
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
                                      key={insp.id}
                                      type="button"
                                      disabled={assigning}
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
                          <div className={`w-full text-center py-2 rounded-sm border text-sm font-medium leading-5 mb-5 ${
                            isCardCompleted ? "border-[#72C816] text-[#72C816] bg-[#72C816]/5" :
                            isCardCanceled  ? "border-[#FA6161]/30 text-[#FA6161] bg-[#FA6161]/5" :
                            "border-[#4353FF] text-[#4353FF]"
                          }`}>
                            {isCardCompleted ? "Completed" : isCardCanceled ? "Cancelled" : "Inspector Assigned"}
                          </div>
                        )}

                        {/* Payment / report info */}
                        <div className="grid grid-cols-3 gap-3 text-center pt-2">

                          <div className="flex flex-col items-center justify-between min-h-[52px]">
                            <span className={`text-xs mb-1 block w-full truncate ${!card.user_payment ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
                              User Payment
                            </span>
                            <div className="w-full flex flex-col justify-end flex-1">
                              <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
                                {card.user_payment ?? ""}
                              </span>
                              <div className={`w-full h-[2px] mt-2 ${card.user_payment ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-between min-h-[52px]">
                            <span className={`text-xs mb-1 block w-full truncate ${!card.inspection_report ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
                              Inspection Report
                            </span>
                            <div className="w-full flex flex-col justify-end flex-1">
                              <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
                                {card.inspection_report ?? ""}
                              </span>
                              <div className={`w-full h-[2px] mt-2 ${card.inspection_report ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-between min-h-[52px]">
                            <span className={`text-xs mb-1 block w-full truncate ${!card.ins_payment ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
                              Ins. Payment
                            </span>
                            <div className="w-full flex flex-col justify-end flex-1">
                              <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
                                {card.ins_payment ?? ""}
                              </span>
                              <div className={`w-full h-[2px] mt-2 ${card.ins_payment ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Details modal ── */}
        {selectedCardId !== null && (
          <InspectionDetailsModal
            bookingId={selectedCardId}
            assignStatus={selectedAssignStatus}
            columnTitle={selectedColumnTitle}
            inspectorId={selectedInspectorId}
            onClose={() => {
              setSelectedCardId(null);
              setSelectedColumnTitle("");
            }}
          />
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage <= 1}
                    className={`px-3 py-1 border rounded transition ${
    currentPage === 1
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
                className={`w-8 h-8 flex items-center justify-center rounded text-sm cursor-pointer font-medium transition-colors ${
                  page === currentPage
                    ? "bg-[#2563eb] text-white border border-[#2563eb]"
                    : "border border-gray-200 text-gray-600 border border-primaryColor hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages}
              className={`px-3 py-1 border rounded transition ${
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
    </div>
  );
}