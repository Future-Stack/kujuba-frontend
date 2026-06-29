"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Search, Download, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import InspectorDetailModal, { InspectorCard, InspectorStatus } from "./InspectorModal";
import {
  useGetInspectorsQuery,
  useApproveInspectorMutation,
  Inspector,
} from "@/app/redux/features/inspectorApi";
import { toast } from "react-toastify";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Normalize API status string → component InspectorStatus */
function toStatus(raw: string): InspectorStatus {
  const map: Record<string, InspectorStatus> = {
    active:         "Active",
    pending:        "Pending",
    pending_review: "Pending",
    suspended:      "Suspended",
    rejected:       "Rejected",
  };
  return map[raw?.toLowerCase()] ?? "Active";
}

/** Map a raw API Inspector → InspectorCard used by the grid / modal */
function toCard(inspector: Inspector): InspectorCard {
  return {
    id:             String(inspector.id),
    name:           inspector.name,
    role:           "Licensed Inspector",
    inspectionType: inspector.inspection_type ?? "N/A",
    email:          inspector.email,
    phone:          inspector.phone,
    status:         toStatus(inspector.status),
    avatarUrl:      inspector.image ?? "",
    createdAt:      new Date(inspector.created_at).getTime(),
  };
}



type TabType = InspectorStatus | "All";

interface TabItem {
  name: TabType;
  count: number | null;
  badge?: string;
}

const paramToTab: Record<string, TabType> = {
  active: "Active", pending: "Pending",
  suspended: "Suspended", rejected: "Rejected",
};
const tabToParam: Record<TabType, string> = {
  All: "", Active: "active", "Pending": "pending",
  Suspended: "suspended", Rejected: "rejected",
};



function CardSkeleton() {
  return (
    <div className="bg-white rounded-sm border border-gray-200 p-5 flex flex-col justify-between animate-pulse">
      <div>
        {/* avatar + name row */}
        <div className="flex bg-[#F5F6FA] p-3 rounded-sm items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        {/* inspection type */}
        <div className="space-y-4 mb-5">
          <div className="space-y-1.5">
            <div className="h-2.5 bg-gray-200 rounded w-1/3" />
            <div className="h-2.5 bg-gray-100 rounded w-2/3" />
          </div>
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="h-2.5 bg-gray-100 rounded w-full" />
            <div className="h-2.5 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      </div>
      {/* button */}
      <div className="h-9 bg-gray-100 rounded-sm w-full mt-2" />
    </div>
  );
}



export default function InspectorGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery]       = useState("");
  const [sortOrder, setSortOrder]           = useState<"newest" | "oldest">("newest");
 
  const [selectedInspector, setSelectedInspector] = useState<InspectorCard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetInspectorsQuery({ page: currentPage });
  const [approveInspector, { isLoading: approvingId }] = useApproveInspectorMutation();




  // Map raw API data → InspectorCard[]
  const inspectors: InspectorCard[] = useMemo(
    () => (data?.data?.inspectors ?? []).map(toCard),
    [data]
  );


  const activeTab = useMemo<TabType>(() => {
    const tab = searchParams.get("tab") ?? "";
    return paramToTab[tab] ?? "All";
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    const param = tabToParam[tab];
    router.push(param ? `?tab=${param}` : "?");
  };

  // ── counts (derived from fetched data) ────────────────────────────────────
  const counts = useMemo(() => ({
    All:              inspectors.length,
    Active:           inspectors.filter((i) => i.status === "Active").length,
    "Pending Review": inspectors.filter((i) => i.status === "Pending").length,
    Suspended:        inspectors.filter((i) => i.status === "Suspended").length,
    Rejected:         inspectors.filter((i) => i.status === "Rejected").length,
  }), [inspectors]);

  const tabs: TabItem[] = [
    {
      name: "All",
      count: data?.data?.pagination?.total ?? 0,
    },
    { name: "Active", count: inspectors.filter(i => i.status === "Active").length,           badge: "bg-emerald-500 text-white" },
    { name: "Pending", count: counts["Pending Review"], badge: "bg-amber-400 text-white" },
    { name: "Suspended",      count: counts.Suspended,         badge: "bg-rose-400 text-white" },
    { name: "Rejected",       count: counts.Rejected,          badge: "bg-red-400 text-white" },
  ];


  const filteredAndSortedInspectors = useMemo(() => {
    let result = [...inspectors];
    if (activeTab !== "All") result = result.filter((i) => i.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.inspectionType.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) =>
      sortOrder === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );
    return result;
  }, [inspectors, activeTab, searchQuery, sortOrder]);

  const paginatedInspectors = filteredAndSortedInspectors;
  const totalPages = data?.data?.pagination?.next_page
    ? currentPage + 1  
    : currentPage;


  const handleOpenModal  = useCallback((inspector: InspectorCard) => setSelectedInspector(inspector), []);
  const handleCloseModal = useCallback(() => setSelectedInspector(null), []);

  // Called by modal after a successful API action — just close (RTK invalidates cache)
  const handleStatusChange = useCallback((_id: string, _newStatus: InspectorStatus) => {
    setSelectedInspector(null);
  }, []);


  const handleGridApprove = useCallback(async (e: React.MouseEvent, inspector: InspectorCard) => {
    e.stopPropagation();
    try {
      await approveInspector(Number(inspector.id)).unwrap();
      toast.success(`${inspector.name} has been approved.`);
    } catch {
      toast.error("Failed to approve inspector. Please try again.");
    }
  }, [approveInspector]);


  const handleExport = () => {
    const headers = ["Name", "Role", "Inspection Type", "Email", "Phone", "Status", "Created At"];
    const rows = filteredAndSortedInspectors.map((i) => [
      i.name, i.role, i.inspectionType, i.email, i.phone, i.status,
      new Date(i.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ""}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url; a.setAttribute("download", "inspectors-data.csv");
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };


  return (
    <div className="w-full bg-[#f8fafc]/40 min-h-screen font-roboto my-6 md:my-12 antialiased">
      <div className="min-h-screen">
      <div className="border rounded-sm border-gray-100 px-4 py-6 ">
        
        
  
        {/* ── Toolbar ── */}
        <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">
            {/* Search */}
            <div className="relative w-full lg:max-w-xs shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search inspector..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar tracking-tight">
              {tabs.map((tab) => (
                <button
                  key={tab.name} onClick={() => handleTabChange(tab.name)}
                  className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.name ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                  }`}
                >
                  <span>{tab.name}</span>
                  {tab.count !== null && (
                    <span className={`min-w-4 h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] ${activeTab === tab.name ? "bg-white/20 text-white" : tab.badge}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sort + Export */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        
            <button onClick={handleExport} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm shadow-md shadow-blue-100 transition-all cursor-pointer active:scale-[0.98]">
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export Inspector Data</span>
            </button>
          </div>
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5   gap-5">
            {Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="w-full text-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
            <p className="text-red-400 font-medium text-sm">Failed to load inspectors. Please refresh.</p>
          </div>
        ) : filteredAndSortedInspectors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5">
            {paginatedInspectors.map((inspector) => (
              <div key={inspector.id} className="bg-white rounded-sm border border-gray-200  p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                <div className="">
                  <div className="flex bg-[#F5F6FA] p-3 rounded-sm items-center gap-3 mb-5">
                    <div className="relative w-11 h-11 shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden relative border border-purple-100 bg-purple-50 flex items-center justify-center">
                        {inspector.avatarUrl ? (
                          <Image src={inspector.avatarUrl} alt={inspector.name} fill className="object-cover" unoptimized />
                        ) : (
                          <span className="text-purple-600 font-bold text-xs ">
                            {inspector.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${inspector.status === "Active" ? "bg-[#09BD3C]" : "bg-gray-300"}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm leading-5 truncate group-hover:text-primaryColor transition-colors">{inspector.name}</h4>
                      {/* <p className="text-[13px] text-gray-600 font-normal leading-4 mt-0.5">{inspector.role}</p> */}
                    </div>
                  </div>

                  <div className="space-y-4 mb-5">
                    <div>
                      <span className="text-sm text-gray-900 font-normal leading-5 block">Inspection Type</span>
                      <span className="text-sm text-gray-600 font-normal leading-5 mt-1 block">{inspector.inspectionType}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4.66671C2 4.31309 2.14048 3.97395 2.39052 3.7239C2.64057 3.47385 2.97971 3.33337 3.33333 3.33337H12.6667C13.0203 3.33337 13.3594 3.47385 13.6095 3.7239C13.8595 3.97395 14 4.31309 14 4.66671M2 4.66671V11.3334C2 11.687 2.14048 12.0261 2.39052 12.2762C2.64057 12.5262 2.97971 12.6667 3.33333 12.6667H12.6667C13.0203 12.6667 13.3594 12.5262 13.6095 12.2762C13.8595 12.0261 14 11.687 14 11.3334V4.66671M2 4.66671L8 8.66671L14 4.66671" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="truncate">{inspector.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.33333 2.66667H8.66667M8 11.3333V11.34M4 3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H5.33333C4.97971 14 4.64057 13.8595 4.39052 13.6095C4.14048 13.3594 4 13.0203 4 12.6667V3.33333Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="truncate">{inspector.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {inspector.status === "Pending" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenModal(inspector)}
                        className="group w-full border border-gray-200 text-gray-900 hover:bg-primaryColor hover:text-white cursor-pointer font-medium text-sm py-2.5 px-1 rounded-sm flex items-center justify-center gap-1 transition-all duration-300 ease-in-out hover:shadow-md active:scale-[0.98]"
                      >
                        <span className="transition-all duration-300 group-hover:translate-x-[-2px]">View Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-900 group-hover:text-white transition-all duration-300 group-hover:translate-x-[3px]">
                          <path d="M5.19727 11.62L9.0006 7.81667C9.44977 7.3675 9.44977 6.6325 9.0006 6.18334L5.19727 2.38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleGridApprove(e, inspector)}
                        disabled={approvingId}
                        className="bg-primaryColor text-white hover:bg-blue-600 font-medium text-xs py-2 rounded-sm transition-colors cursor-pointer text-center shadow-sm disabled:opacity-60"
                      >
                        {approvingId ? "..." : "Approve"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(inspector)}
                      className="group w-full border border-gray-200 text-gray-900 hover:bg-primaryColor hover:text-white cursor-pointer font-medium text-sm py-2.5 px-4 rounded-sm flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:shadow-md active:scale-[0.98]"
                    >
                      <span className="transition-all duration-300 group-hover:translate-x-[-2px]">View Details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-900 group-hover:text-white transition-all duration-300 group-hover:translate-x-[3px]">
                        <path d="M5.19727 11.62L9.0006 7.81667C9.44977 7.3675 9.44977 6.6325 9.0006 6.18334L5.19727 2.38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-semibold text-sm">No inspectors found matching current criteria.</p>
          </div>
        )}
      </div>
      </div>

{totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-6">
    
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
             className={`px-3 py-1 border rounded transition ${
    currentPage === 1
      ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
      : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
  }`}
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 border rounded ${
          currentPage === i + 1
            ? "bg-primaryColor text-white"
            : "bg-white text-black border border-primaryColor"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() =>
        setCurrentPage((p) => Math.min(p + 1, totalPages))
      }
      disabled={currentPage === totalPages}
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
      {/* Modal */}
      <InspectorDetailModal
        inspector={selectedInspector}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
