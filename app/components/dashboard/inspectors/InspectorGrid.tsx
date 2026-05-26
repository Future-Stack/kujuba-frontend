"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Search, Download, ChevronRight, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import InspectorDetailModal, { InspectorCard, InspectorStatus } from "./InspectorModal";


type TabType = InspectorStatus | "All";

interface TabItem {
  name: TabType;
  count: number | null;
  badge?: string;
}

const INITIAL_INSPECTORS: InspectorCard[] = [
  { id: "1", name: "Shaun Farley",  role: "Licensed Inspector", inspectionType: "Flood Elevation",      email: "shaun@example.com",  phone: "+1 578 209 4965", status: "Active",         avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", createdAt: 1716548400000 },
  { id: "2", name: "Jenny Ellis",   role: "Licensed Inspector", inspectionType: "Wind Mitigation",      email: "jenny@example.com",  phone: "+1 278 301 7284", status: "Pending Review", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", createdAt: 1716462000000 },
  { id: "3", name: "Leon Baxter",   role: "Licensed Inspector", inspectionType: "Roof Inspection",      email: "leon@example.com",   phone: "+1 212 555 0173", status: "Active",         avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", createdAt: 1716375600000 },
  { id: "4", name: "Adrian Travon", role: "Licensed Inspector", inspectionType: "Four Point Inspection",email: "adrian@example.com", phone: "+1 310 555 0148", status: "Suspended",      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", createdAt: 1716289200000 },
  { id: "5", name: "Marcus Vance",  role: "Licensed Inspector", inspectionType: "Four Point Inspection",email: "marcus@example.com", phone: "+1 310 555 0148", status: "Rejected",       avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", createdAt: 1716202800000 },
  { id: "6", name: "Sarah Jenkins", role: "Licensed Inspector", inspectionType: "Combined Inspection",  email: "sarah@example.com",  phone: "+1 578 209 4965", status: "Active",         avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", createdAt: 1716116400000 },
];

const paramToTab: Record<string, TabType> = {
  active: "Active", pending: "Pending Review", suspended: "Suspended", rejected: "Rejected",
};
const tabToParam: Record<TabType, string> = {
  All: "", Active: "active", "Pending Review": "pending", Suspended: "suspended", Rejected: "rejected",
};

export default function InspectorGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ inspectors now in state so status updates re-render the grid
  const [inspectors, setInspectors] = useState<InspectorCard[]>(INITIAL_INSPECTORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [open, setOpen] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState<InspectorCard | null>(null);

  const activeTab = useMemo<TabType>(() => {
    const tab = searchParams.get("tab") ?? "";
    return paramToTab[tab] ?? "All";
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    const param = tabToParam[tab];
    router.push(param ? `?tab=${param}` : "?");
  };

  const handleOpenModal = useCallback((inspector: InspectorCard) => {
    setSelectedInspector(inspector);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedInspector(null);
  }, []);

  // ✅ Updates inspector status in state — grid re-renders with new status instantly
  const handleStatusChange = useCallback((id: string, newStatus: InspectorStatus) => {
    setInspectors((prev) =>
      prev.map((inspector) =>
        inspector.id === id ? { ...inspector, status: newStatus } : inspector
      )
    );
  }, []);

  // ✅ Grid Approve button handler (Pending Review → Active)
  const handleGridApprove = useCallback((e: React.MouseEvent, inspector: InspectorCard) => {
    e.stopPropagation(); // prevent card click
    handleStatusChange(inspector.id, "Active");
  }, [handleStatusChange]);

  const counts = useMemo(() => ({
    All:              inspectors.length,
    Active:           inspectors.filter((i) => i.status === "Active").length,
    "Pending Review": inspectors.filter((i) => i.status === "Pending Review").length,
    Suspended:        inspectors.filter((i) => i.status === "Suspended").length,
    Rejected:         inspectors.filter((i) => i.status === "Rejected").length,
  }), [inspectors]); // ✅ recomputes when inspectors state changes

  const tabs: TabItem[] = [
    { name: "All",            count: null },
    { name: "Active",         count: counts.Active,           badge: "bg-emerald-500 text-white" },
    { name: "Pending Review", count: counts["Pending Review"], badge: "bg-amber-400 text-white" },
    { name: "Suspended",      count: counts.Suspended,         badge: "bg-rose-400 text-white" },
    { name: "Rejected",       count: counts.Rejected,          badge: "bg-red-400 text-white" },
  ];

  const filteredAndSortedInspectors = useMemo(() => {
    let result = [...inspectors];
    if (activeTab !== "All") result = result.filter((i) => i.status === activeTab);
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((i) =>
        i.name.toLowerCase().includes(query) ||
        i.email.toLowerCase().includes(query) ||
        i.inspectionType.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => sortOrder === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
    return result;
  }, [inspectors, activeTab, searchQuery, sortOrder]); // ✅ depends on inspectors state

  return (
    <div className="w-full bg-[#f8fafc]/40 min-h-screen font-roboto my-6 md:my-12 antialiased">
      <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">
            {/* Search */}
            <div className="relative w-full lg:max-w-xs shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inspector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar tracking-tight">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabChange(tab.name)}
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
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-gray-50/60 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-900 font-normal cursor-pointer leading-5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11.667 8.75002L9.91699 10.5L8.16699 8.75002M9.91699 10.5V3.50002M2.91699 3.20835C2.91699 3.131 2.94772 3.05681 3.00242 3.00211C3.05712 2.94742 3.1313 2.91669 3.20866 2.91669H5.54199C5.61935 2.91669 5.69353 2.94742 5.74823 3.00211C5.80293 3.05681 5.83366 3.131 5.83366 3.20835V5.54169C5.83366 5.61904 5.80293 5.69323 5.74823 5.74793C5.69353 5.80263 5.61935 5.83335 5.54199 5.83335H3.20866C3.1313 5.83335 3.05712 5.80263 3.00242 5.74793C2.94772 5.69323 2.91699 5.61904 2.91699 5.54169V3.20835ZM2.91699 8.45835C2.91699 8.381 2.94772 8.30681 3.00242 8.25211C3.05712 8.19742 3.1313 8.16669 3.20866 8.16669H5.54199C5.61935 8.16669 5.69353 8.19742 5.74823 8.25211C5.80293 8.30681 5.83366 8.381 5.83366 8.45835V10.7917C5.83366 10.869 5.80293 10.9432 5.74823 10.9979C5.69353 11.0526 5.61935 11.0834 5.54199 11.0834H3.20866C3.1313 11.0834 3.05712 11.0526 3.00242 10.9979C2.94772 10.9432 2.91699 10.869 2.91699 10.7917V8.45835Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Sort By : {sortOrder === "newest" ? "Newest" : "Oldest"}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white text-gray-600 shadow-lg z-50 overflow-hidden">
                  <button onClick={() => { setSortOrder("newest"); setOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer">Newest</button>
                  <button onClick={() => { setSortOrder("oldest"); setOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer">Oldest</button>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-md shadow-blue-100 transition-all active:scale-[0.98]">
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export User Data</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        {filteredAndSortedInspectors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredAndSortedInspectors.map((inspector) => (
              <div key={inspector.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="flex bg-[#F5F6FA] p-3 rounded-sm items-center gap-3 mb-5">
                    <div className="relative w-11 h-11 shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-100">
                        <Image src={inspector.avatarUrl} alt={inspector.name} fill className="object-cover" unoptimized />
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${inspector.status === "Active" ? "bg-[#09BD3C]" : "bg-gray-200"}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm leading-5 truncate group-hover:text-primaryColor transition-colors">{inspector.name}</h4>
                      <p className="text-[13px] text-gray-600 font-normal leading-4 mt-0.5">{inspector.role}</p>
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
                  {inspector.status === "Pending Review" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenModal(inspector)}
                        className="w-full border border-gray-200 text-gray-900 hover:bg-primaryColor hover:text-white cursor-pointer font-medium text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        View Details
                      </button>
                      {/* ✅ Grid Approve button — works without opening modal */}
                      <button
                        onClick={(e) => handleGridApprove(e, inspector)}
                        className="bg-primaryColor text-white hover:bg-blue-600 font-medium text-xs py-2 rounded-xl transition-colors cursor-pointer text-center shadow-sm"
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(inspector)}
                      className="w-full border border-gray-200 text-gray-900 hover:bg-primaryColor hover:text-white cursor-pointer font-medium text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
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

      {/* Modal */}
      <InspectorDetailModal
        inspector={selectedInspector}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}




// "use client";

// import React, { useState, useMemo } from "react";
// import Image from "next/image";
// import { Search, Download, ChevronRight, ChevronDown } from "lucide-react";
// import { useSearchParams, useRouter } from "next/navigation";

// type InspectorStatus = "Active" | "Pending Review" | "Suspended" | "Rejected";
// type TabType = InspectorStatus | "All";

// interface InspectorCard {
//   id: string;
//   name: string;
//   role: string;
//   inspectionType: string;
//   email: string;
//   phone: string;
//   status: InspectorStatus;
//   avatarUrl: string;
//   createdAt: number;
// }

// interface TabItem {
//   name: TabType;
//   count: number | null;
//   badge?: string;
// }

// const initialInspectors: InspectorCard[] = [
//   { id: "1", name: "Shaun Farley", role: "Licensed Inspector", inspectionType: "Flood Elevation", email: "shaun@example.com", phone: "+1 578 209 4965", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", createdAt: 1716548400000 },
//   { id: "2", name: "Jenny Ellis", role: "Licensed Inspector", inspectionType: "Wind Mitigation", email: "jenny@example.com", phone: "+1 278 301 7284", status: "Pending Review", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", createdAt: 1716462000000 },
//   { id: "3", name: "Leon Baxter", role: "Licensed Inspector", inspectionType: "Roof Inspection", email: "leon@example.com", phone: "+1 212 555 0173", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", createdAt: 1716375600000 },
//   { id: "4", name: "Adrian Travon", role: "Licensed Inspector", inspectionType: "Four Point Inspection", email: "adrian@example.com", phone: "+1 310 555 0148", status: "Suspended", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", createdAt: 1716289200000 },
//   { id: "5", name: "Marcus Vance", role: "Licensed Inspector", inspectionType: "Four Point Inspection", email: "marcus@example.com", phone: "+1 310 555 0148", status: "Rejected", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", createdAt: 1716202800000 },
//   { id: "6", name: "Sarah Jenkins", role: "Licensed Inspector", inspectionType: "Combined Inspection", email: "sarah@example.com", phone: "+1 578 209 4965", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", createdAt: 1716116400000 },
// ];

// // Maps URL param value → TabType
// const paramToTab: Record<string, TabType> = {
//   active:    "Active",
//   pending:   "Pending Review",
//   suspended: "Suspended",
//   rejected:  "Rejected",
// };

// // Maps TabType → URL param value
// const tabToParam: Record<TabType, string> = {
//   All:              "",
//   Active:           "active",
//   "Pending Review": "pending",
//   Suspended:        "suspended",
//   Rejected:         "rejected",
// };

// export default function InspectorGrid() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
//   const [open, setOpen] = useState(false);

//   //  FIX: Read activeTab directly from URL — no useState, no useEffect
//   const activeTab = useMemo<TabType>(() => {
//     const tab = searchParams.get("tab") ?? "";
//     return paramToTab[tab] ?? "All";
//   }, [searchParams]);

//   //  FIX: Change tab by pushing to URL instead of calling setActiveTab
//   const handleTabChange = (tab: TabType) => {
//     const param = tabToParam[tab];
//     router.push(param ? `?tab=${param}` : "?");
//   };

//   const counts = useMemo(() => ({
//     All:              initialInspectors.length,
//     Active:           initialInspectors.filter((i) => i.status === "Active").length,
//     "Pending Review": initialInspectors.filter((i) => i.status === "Pending Review").length,
//     Suspended:        initialInspectors.filter((i) => i.status === "Suspended").length,
//     Rejected:         initialInspectors.filter((i) => i.status === "Rejected").length,
//   }), []);

//   const tabs: TabItem[] = [
//     { name: "All",            count: null },
//     { name: "Active",         count: counts.Active,           badge: "bg-emerald-500 text-white" },
//     { name: "Pending Review", count: counts["Pending Review"], badge: "bg-amber-400 text-white" },
//     { name: "Suspended",      count: counts.Suspended,         badge: "bg-rose-400 text-white" },
//     { name: "Rejected",       count: counts.Rejected,          badge: "bg-red-400 text-white" },
//   ];

//   const filteredAndSortedInspectors = useMemo(() => {
//     let result = [...initialInspectors];

//     if (activeTab !== "All") {
//       result = result.filter((inspector) => inspector.status === activeTab);
//     }

//     if (searchQuery.trim() !== "") {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(
//         (inspector) =>
//           inspector.name.toLowerCase().includes(query) ||
//           inspector.email.toLowerCase().includes(query) ||
//           inspector.inspectionType.toLowerCase().includes(query)
//       );
//     }

//     result.sort((a, b) =>
//       sortOrder === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
//     );

//     return result;
//   }, [activeTab, searchQuery, sortOrder]);

//   return (
//     <div className="w-full bg-[#f8fafc]/40 min-h-screen font-roboto my-6 md:my-12 antialiased">
//       <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6">
//         <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">

//           <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">
//             {/* Search */}
//             <div className="relative w-full lg:max-w-xs shrink-0">
//               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search inspector..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
//               />
//             </div>

//             {/* Tabs */}
//             <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar tracking-tight">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.name}
//                   onClick={() => handleTabChange(tab.name)} // ✅ uses router.push
//                   className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
//                     activeTab === tab.name
//                       ? "bg-black text-white"
//                       : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
//                   }`}
//                 >
//                   <span>{tab.name}</span>
//                   {tab.count !== null && (
//                     <span
//                       className={`min-w-4 h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] ${
//                         activeTab === tab.name ? "bg-white/20 text-white" : tab.badge
//                       }`}
//                     >
//                       {tab.count}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Sort + Export */}
//           <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
//             <div className="relative">
//               <button
//                 onClick={() => setOpen(!open)}
//                 className="flex items-center gap-2 bg-gray-50/60 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-900 font-normal cursor-pointer leading-5"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
//                   <path d="M11.667 8.75002L9.91699 10.5L8.16699 8.75002M9.91699 10.5V3.50002M2.91699 3.20835C2.91699 3.131 2.94772 3.05681 3.00242 3.00211C3.05712 2.94742 3.1313 2.91669 3.20866 2.91669H5.54199C5.61935 2.91669 5.69353 2.94742 5.74823 3.00211C5.80293 3.05681 5.83366 3.131 5.83366 3.20835V5.54169C5.83366 5.61904 5.80293 5.69323 5.74823 5.74793C5.69353 5.80263 5.61935 5.83335 5.54199 5.83335H3.20866C3.1313 5.83335 3.05712 5.80263 3.00242 5.74793C2.94772 5.69323 2.91699 5.61904 2.91699 5.54169V3.20835ZM2.91699 8.45835C2.91699 8.381 2.94772 8.30681 3.00242 8.25211C3.05712 8.19742 3.1313 8.16669 3.20866 8.16669H5.54199C5.61935 8.16669 5.69353 8.19742 5.74823 8.25211C5.80293 8.30681 5.83366 8.381 5.83366 8.45835V10.7917C5.83366 10.869 5.80293 10.9432 5.74823 10.9979C5.69353 11.0526 5.61935 11.0834 5.54199 11.0834H3.20866C3.1313 11.0834 3.05712 11.0526 3.00242 10.9979C2.94772 10.9432 2.91699 10.869 2.91699 10.7917V8.45835Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <span>Sort By : {sortOrder === "newest" ? "Newest" : "Oldest"}</span>
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </button>

//               {open && (
//                 <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white text-gray-600 shadow-lg z-50 overflow-hidden">
//                   <button onClick={() => { setSortOrder("newest"); setOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer">Newest</button>
//                   <button onClick={() => { setSortOrder("oldest"); setOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer">Oldest</button>
//                 </div>
//               )}
//             </div>

//             <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-md shadow-blue-100 transition-all active:scale-[0.98]">
//               <Download className="w-4 h-4 stroke-[2.5]" />
//               <span>Export User Data</span>
//             </button>
//           </div>
//         </div>

//         {/* Grid */}
//         {filteredAndSortedInspectors.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
//             {filteredAndSortedInspectors.map((inspector) => (
//               <div key={inspector.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
//                 <div>
//                   <div className="flex bg-[#F5F6FA] p-3 rounded-sm items-center gap-3 mb-5">
//                     <div className="relative w-11 h-11 shrink-0">
//                       <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-100">
//                         <Image src={inspector.avatarUrl} alt={inspector.name} fill className="object-cover" unoptimized />
//                       </div>
//                       <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${inspector.status === "Active" ? "bg-[#09BD3C]" : "bg-gray-200"}`} />
//                     </div>
//                     <div className="min-w-0">
//                       <h4 className="font-medium text-gray-900 text-sm leading-5 truncate group-hover:text-primaryColor transition-colors">{inspector.name}</h4>
//                       <p className="text-[13px] text-gray-600 font-normal leading-4 mt-0.5">{inspector.role}</p>
//                     </div>
//                   </div>

//                   <div className="space-y-4 mb-5">
//                     <div>
//                       <span className="text-sm text-gray-900 font-normal leading-5 block">Inspection Type</span>
//                       <span className="text-sm text-gray-600 font-normal leading-5 mt-1 block">{inspector.inspectionType}</span>
//                     </div>
//                     <div className="pt-4 border-t border-gray-100 space-y-2">
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//                           <path d="M2 4.66671C2 4.31309 2.14048 3.97395 2.39052 3.7239C2.64057 3.47385 2.97971 3.33337 3.33333 3.33337H12.6667C13.0203 3.33337 13.3594 3.47385 13.6095 3.7239C13.8595 3.97395 14 4.31309 14 4.66671M2 4.66671V11.3334C2 11.687 2.14048 12.0261 2.39052 12.2762C2.64057 12.5262 2.97971 12.6667 3.33333 12.6667H12.6667C13.0203 12.6667 13.3594 12.5262 13.6095 12.2762C13.8595 12.0261 14 11.687 14 11.3334V4.66671M2 4.66671L8 8.66671L14 4.66671" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                         <span className="truncate">{inspector.email}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//                           <path d="M7.33333 2.66667H8.66667M8 11.3333V11.34M4 3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H5.33333C4.97971 14 4.64057 13.8595 4.39052 13.6095C4.14048 13.3594 4 13.0203 4 12.6667V3.33333Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                         <span className="truncate">{inspector.phone}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-2">
//                   {inspector.status === "Pending Review" ? (
//                     <div className="grid grid-cols-2 gap-2">
//                       <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs py-2 rounded-xl transition-colors text-center">View Details</button>
//                       <button className="bg-[#2563eb] text-white hover:bg-blue-600 font-bold text-xs py-2 rounded-xl transition-colors text-center shadow-sm">Approve</button>
//                     </div>
//                   ) : (
//                     <button className="w-full border border-gray-200 text-gray-900 hover:bg-primaryColor hover:text-white cursor-pointer font-medium text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors">
//                       <span>View Details</span>
//                       <ChevronRight className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="w-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
//             <p className="text-gray-400 font-semibold text-sm">No inspectors found matching current criteria.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }