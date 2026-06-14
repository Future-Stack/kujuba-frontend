"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  Eye,
  Search,
} from "lucide-react";
import InspectionDetailsModal from "./InspectionDetailsModal";

type InspectorStatus =
  | "Active"
  | "Pending Review"
  | "Suspended"
  | "Rejected";

type TabType = InspectorStatus | "All";

interface TabItem {
  name: TabType;
  count: number;
  badge?: string;
}

interface Inspector {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  status: InspectorStatus; // Filter tracking এর জন্য status অ্যাড করা হলো
}

interface CardItem {
  id: string;
  type: string;
  urgent: boolean;
  status: string;
  statusStyle?: string;
  payment: string;
  report: string;
  insPay: string;
  assignedInspector?: Inspector | null;
}

interface ColumnType {
  title: string;
  headerBg: string;
  cards: CardItem[];
}

const initialInspectorsList = [
  { status: "Active" },
  { status: "Active" },
  { status: "Pending Review" },
  { status: "Suspended" },
  { status: "Rejected" },
] as const;

// Mock inspector list for the dropdown
const availableInspectors: Inspector[] = [
  { id: "i1", name: "John Doe",    avatar: "JD", avatarColor: "bg-blue-100 text-blue-700", status: "Active" },
  { id: "i2", name: "Maria Smith", avatar: "MS", avatarColor: "bg-purple-100 text-purple-700", status: "Active" },
  { id: "i3", name: "Kevin Ray",   avatar: "KR", avatarColor: "bg-emerald-100 text-emerald-700", status: "Pending Review" },
  { id: "i4", name: "Sara Lee",    avatar: "SL", avatarColor: "bg-amber-100 text-amber-700", status: "Suspended" },
];

const initialBoardData: Record<string, ColumnType> = {
  pending: {
    title: "Pending Inspections",
    headerBg: "bg-[#FA9F15]",
    cards: [
      {
        id: "p1",
        type: "Roof Inspection",
        urgent: true,
        status: "Select Inspector",
        payment: "Confirmed",
        report: "line",
        insPay: "line",
        assignedInspector: null,
      },
      {
        id: "p2",
        type: "Roof Inspection",
        urgent: false,
        status: "Select Inspector",
        payment: "Confirmed",
        report: "line",
        insPay: "line",
        assignedInspector: null,
      },
    ],
  },

  assigned: {
    title: "Inspector Assigned",
    headerBg: "bg-[#4353FF]",
    cards: [
      {
        id: "a1",
        type: "Four Point Inspection",
        urgent: false,
        status: "Inspector Assigned",
        statusStyle: "border-[#4353FF] text-[#4353FF]",
        payment: "Paid",
        report: "line",
        insPay: "line",
        assignedInspector: availableInspectors[0],
      },
      {
        id: "a2",
        type: "Four Point Inspection",
        urgent: false,
        status: "Inspector Assigned",
        statusStyle: "border-[#4353FF] text-[#4353FF]",
        payment: "Paid",
        report: "line",
        insPay: "line",
        assignedInspector: availableInspectors[1],
      },
    ],
  },

  completed: {
    title: "Completed Inspections",
    headerBg: "bg-[#72C816]",
    cards: [
      {
        id: "c1",
        type: "Four Point Inspection",
        urgent: false,
        status: "Completed",
        statusStyle: "border-[#72C816] text-[#72C816] bg-[#72C816]/5",
        payment: "Confirmed",
        report: "Submitted",
        insPay: "Released",
        assignedInspector: availableInspectors[2],
      },
      {
        id: "c2",
        type: "Four Point Inspection",
        urgent: false,
        status: "Completed",
        statusStyle: "border-[#72C816] text-[#72C816] bg-[#72C816]/5",
        payment: "Confirmed",
        report: "Submitted",
        insPay: "Released",
        assignedInspector: availableInspectors[3],
      },
    ],
  },

  canceled: {
    title: "Canceled Inspections",
    headerBg: "bg-[#FA6161]",
    cards: [
      {
        id: "x1",
        type: "Wind Mitigation Inspection",
        urgent: false,
        status: "Canceled",
        statusStyle: "border-[#FA6161]/30 text-[#FA6161] bg-[#FA6161]/5",
        payment: "Refunded",
        report: "line",
        insPay: "line",
        assignedInspector: null,
      },
    ],
  },
};

export default function InspectionBoardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Board state
  const [boardData, setBoardData] = useState<Record<string, ColumnType>>(initialBoardData);
   // ── Modal state ──
  const [selectedCard, setSelectedCard]       = useState<CardItem | null>(null);
  const [selectedColumnTitle, setSelectedColumnTitle] = useState<string>("");
 
  const handleOpenModal = (card: CardItem, columnTitle: string) => {
    setSelectedCard(card);
    setSelectedColumnTitle(columnTitle);
  };
 
  const handleCloseModal = () => {
    setSelectedCard(null);
    setSelectedColumnTitle("");
  };

  // Assign inspector logic
  const handleAssignInspector = (columnKey: string, cardId: string, inspectorId: string) => {
    const inspector = availableInspectors.find((i) => i.id === inspectorId) ?? null;
    setBoardData((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        cards: prev[columnKey].cards.map((card) =>
          card.id === cardId
            ? { 
                ...card, 
                assignedInspector: inspector,
                status: "Inspector Assigned",
                statusStyle: "border-[#4353FF] text-[#4353FF]"
              }
            : card
        ),
      },
    }));
    setOpenDropdownId(null);
  };

  // CSV Export Function
  const handleExportData = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Column,Inspection Type,Urgent,Status,User Payment,Report,Ins Payment,Assigned Inspector\n";

    Object.entries(boardData).forEach(([_, column]) => {
      column.cards.forEach((card) => {
        const inspectorName = card.assignedInspector ? card.assignedInspector.name : "Not assigned";
        const row = [
          `"${column.title}"`,
          `"${card.type}"`,
          `"${card.urgent ? "Yes" : "No"}"`,
          `"${card.status}"`,
          `"${card.payment}"`,
          `"${card.report === "line" ? "N/A" : card.report}"`,
          `"${card.insPay === "line" ? "N/A" : card.insPay}"`,
          `"${inspectorName}"`
        ].join(",");
        csvContent += row + "\n";
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inspection_report_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Board Data calculation
  const filteredBoardData = useMemo(() => {
    const freshData: Record<string, ColumnType> = {};

    Object.entries(boardData).forEach(([key, column]) => {
      const filteredCards = column.cards.filter((card) => {
        // Search Filter (Matches Inspector Name or Inspection Type)
        const matchesSearch =
          card.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (card.assignedInspector &&
            card.assignedInspector.name.toLowerCase().includes(searchQuery.toLowerCase()));

        // Tab Status Filter
        const matchesTab =
          activeTab === "All" ||
          (card.assignedInspector && card.assignedInspector.status === activeTab);

        return matchesSearch && matchesTab;
      });

      freshData[key] = {
        ...column,
        cards: filteredCards,
      };
    });

    return freshData;
  }, [boardData, searchQuery, activeTab]);

  const counts = useMemo(() => ({
    All: initialInspectorsList.length,
    Active: initialInspectorsList.filter((i) => i.status === "Active").length,
    "Pending Review": initialInspectorsList.filter((i) => i.status === "Pending Review").length,
    Suspended: initialInspectorsList.filter((i) => i.status === "Suspended").length,
    Rejected: initialInspectorsList.filter((i) => i.status === "Rejected").length,
  }), []);

  const tabs: TabItem[] = [
    { name: "All",            count: counts.All,              badge: "bg-gray-900 text-white" },
    { name: "Active",         count: counts.Active,           badge: "bg-emerald-500 text-white" },
    { name: "Pending Review", count: counts["Pending Review"], badge: "bg-amber-400 text-white" },
    { name: "Suspended",      count: counts.Suspended,         badge: "bg-rose-400 text-white" },
    { name: "Rejected",       count: counts.Rejected,          badge: "bg-red-400 text-white" },
  ];

  return (
    <div className="w-full bg-slate-50/40 min-h-screen my-6 md:my-12 font-roboto">
      <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6 bg-white">

        {/* TOP HEADER */}
        <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">
          
          {/* LEFT */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">
            {/* SEARCH */}
            <div className="relative w-full lg:max-w-xs shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inspector or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
              />
            </div>

            {/* FILTER TABS */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.name
                      ? "bg-black text-white"
                      : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                  }`}
                >
                  <span>{tab.name}</span>
                  <span
                    className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] ${
                      activeTab === tab.name ? "bg-white/20 text-white" : tab.badge
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* EXPORT */}
            <button 
              onClick={handleExportData}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm cursor-pointer shadow-md shadow-blue-100 transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export User Data</span>
            </button>
          </div>
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {Object.entries(filteredBoardData).map(([key, column]) => (
            <div key={key} className="flex flex-col gap-4">

              {/* COLUMN HEADER */}
              <div className={`w-full ${column.headerBg} text-white py-3 px-4 rounded-sm text-center text-xl font-semibold font-sora shadow-sm`}>
                {column.title}
              </div>

              {/* CARDS */}
              <div className="flex flex-col gap-3.5">
                {column.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`bg-white rounded-xl border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-md ${
                      card.urgent ? "border-red-300 ring-1 ring-red-400/5" : "border-gray-200"
                    }`}
                  >
                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base leading-5">
                          {card.type}
                        </h4>
                        {card.urgent && (
                          <span className="bg-red-300 text-white text-[9px] font-normal px-1.5 py-0.5 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <button onClick={() => handleOpenModal(card, column.title)}  className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer">
                        <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>

                    {/* ASSIGNED INSPECTOR ROW */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-6 mb-4">
                      <span>Assigned Inspector:</span>
                      {card.assignedInspector ? (
                        <div className="flex items-center gap-1.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${card.assignedInspector.avatarColor}`}>
                            {card.assignedInspector.avatar}
                          </div>
                          <span className="text-gray-800 font-medium text-sm">
                            {card.assignedInspector.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#B5BCC8] ml-1">Not assigned yet</span>
                      )}
                    </div>

                    {/* STATUS / DROPDOWN */}
                    {card.status === "Select Inspector" ? (
                      <div className="relative flex items-center gap-3 mb-5 z-20">
                        <p className="text-[#090909] text-sm font-medium leading-5 whitespace-nowrap">
                          Assign Inspector
                        </p>

                        <div className="relative w-full">
                          <button
                            type="button"
                            onClick={() => setOpenDropdownId(openDropdownId === card.id ? null : card.id)}
                            className="w-full flex items-center justify-between bg-white border border-[#B5BCC8] text-[#B5BCC8] rounded-sm py-2 px-3 text-[11px] font-bold cursor-pointer"
                          >
                            <span>Select Inspector</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          </button>

                          {openDropdownId === card.id && (
                            <div className="absolute left-0 mt-1 w-full rounded-sm border border-gray-100 bg-white shadow-lg z-30 max-h-40 overflow-y-auto">
                              {availableInspectors.map((insp) => (
                                <button
                                  key={insp.id}
                                  type="button"
                                  onClick={() => handleAssignInspector(key, card.id, insp.id)}
                                  className="w-full text-left px-3 py-2 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  {insp.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={`w-full text-center py-2 rounded-sm border text-sm font-medium leading-5 mb-5 ${card.statusStyle}`}>
                        {card.status}
                      </div>
                    )}

                    {/* FOOTER STEPS WITH CONDITIONAL STYLES */}
                  {/* FOOTER STEPS — FIXED SAME WIDTH BORDER AND ALIGNMENT */}
<div className="grid grid-cols-3 gap-3 text-center pt-2">
  {/* USER PAYMENT */}
  <div className="flex flex-col items-center justify-between min-h-[52px]">
    <span className={`text-xs mb-1 block w-full truncate ${card.payment === "line" ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
      User Payment
    </span>
    <div className="w-full flex flex-col justify-end flex-1">
      <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
        {card.payment === "line" ? "" : card.payment}
      </span>
      <div className={`w-full h-[2px] mt-2 ${card.payment === "line" ? "bg-[#B5BCC8]" : "bg-[#A3E635]"}`} />
    </div>
  </div>

  {/* INSPECTION REPORT */}
  <div className="flex flex-col items-center justify-between min-h-[52px]">
    <span className={`text-xs mb-1 block w-full truncate ${card.report === "line" ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
      Inspection Report
    </span>
    <div className="w-full flex flex-col justify-end flex-1">
      <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
        {card.report === "line" ? "" : card.report}
      </span>
      <div className={`w-full h-[2px] mt-2 ${card.report === "line" ? "bg-[#B5BCC8]" : "bg-[#A3E635]"}`} />
    </div>
  </div>

  {/* INS. PAYMENT */}
  <div className="flex flex-col items-center justify-between min-h-[52px]">
    <span className={`text-xs mb-1 block w-full truncate ${card.insPay === "line" ? "text-[#B5BCC8] font-normal" : "text-gray-600 font-medium"}`}>
      Ins. Payment
    </span>
    <div className="w-full flex flex-col justify-end flex-1">
      <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
        {card.insPay === "line" ? "" : card.insPay}
      </span>
      <div className={`w-full h-[2px] mt-2 ${card.insPay === "line" ? "bg-[#B5BCC8]" : "bg-[#A3E635]"}`} />
    </div>
  </div>
</div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
            {selectedCard && (
        <InspectionDetailsModal
          card={selectedCard}
          columnTitle={selectedColumnTitle}
          onClose={handleCloseModal}
        />
      )}
      </div>
    </div>
  );
}






// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   ChevronDown,
//   Download,
//   Eye,
//   Search,
// } from "lucide-react";

// type InspectorStatus =
//   | "Active"
//   | "Pending Review"
//   | "Suspended"
//   | "Rejected";

// type TabType = InspectorStatus | "All";

// interface TabItem {
//   name: TabType;
//   count: number;
//   badge?: string;
// }

// interface Inspector {
//   id: string;
//   name: string;
//   avatar: string; // initials fallback
//   avatarColor: string;
// }

// interface CardItem {
//   id: string;
//   type: string;
//   urgent: boolean;
//   status: string;
//   statusStyle?: string;
//   payment: string;
//   report: string;
//   insPay: string;
//   assignedInspector?: Inspector | null;
// }

// interface ColumnType {
//   title: string;
//   headerBg: string;
//   cards: CardItem[];
// }

// const initialInspectors = [
//   { status: "Active" },
//   { status: "Active" },
//   { status: "Pending Review" },
//   { status: "Suspended" },
//   { status: "Rejected" },
// ] as const;

// // Mock inspector list for the dropdown
// const availableInspectors: Inspector[] = [
//   { id: "i1", name: "John Doe",    avatar: "JD", avatarColor: "bg-blue-100 text-blue-700" },
//   { id: "i2", name: "Maria Smith", avatar: "MS", avatarColor: "bg-purple-100 text-purple-700" },
//   { id: "i3", name: "Kevin Ray",   avatar: "KR", avatarColor: "bg-emerald-100 text-emerald-700" },
//   { id: "i4", name: "Sara Lee",    avatar: "SL", avatarColor: "bg-amber-100 text-amber-700" },
// ];

// const initialBoardData: Record<string, ColumnType> = {
//   pending: {
//     title: "Pending Inspections",
//     headerBg: "bg-[#FA9F15]",
//     cards: [
//       {
//         id: "p1",
//         type: "Roof Inspection",
//         urgent: true,
//         status: "Select Inspector",
//         payment: "Confirmed",
//         report: "line",
//         insPay: "line",
//         assignedInspector: null,
//       },
//       {
//         id: "p2",
//         type: "Roof Inspection",
//         urgent: false,
//         status: "Select Inspector",
//         payment: "Confirmed",
//         report: "line",
//         insPay: "line",
//         assignedInspector: null,
//       },
//     ],
//   },

//   assigned: {
//     title: "Inspector Assigned",
//     headerBg: "bg-[#4353FF]",
//     cards: [
//       {
//         id: "a1",
//         type: "Four Point Inspection",
//         urgent: false,
//         status: "Inspector Assigned",
//         statusStyle: "border-[#4353FF] text-[#4353FF]",
//         payment: "Paid",
//         report: "line",
//         insPay: "line",
//         assignedInspector: availableInspectors[0],
//       },
//       {
//         id: "a2",
//         type: "Four Point Inspection",
//         urgent: false,
//         status: "Inspector Assigned",
//         statusStyle: "border-[#4353FF] text-[#4353FF]",
//         payment: "Paid",
//         report: "line",
//         insPay: "line",
//         assignedInspector: availableInspectors[1],
//       },
//     ],
//   },

//   completed: {
//     title: "Completed Inspections",
//     headerBg: "bg-[#72C816]",
//     cards: [
//       {
//         id: "c1",
//         type: "Four Point Inspection",
//         urgent: false,
//         status: "Completed",
//         statusStyle: "border-[#72C816] text-[#72C816] bg-[#72C816]/5",
//         payment: "Confirmed",
//         report: "Submitted",
//         insPay: "Released",
//         assignedInspector: availableInspectors[2],
//       },
//       {
//         id: "c2",
//         type: "Four Point Inspection",
//         urgent: false,
//         status: "Completed",
//         statusStyle: "border-[#72C816] text-[#72C816] bg-[#72C816]/5",
//         payment: "Confirmed",
//         report: "Submitted",
//         insPay: "Released",
//         assignedInspector: availableInspectors[3],
//       },
//     ],
//   },

//   canceled: {
//     title: "Canceled Inspections",
//     headerBg: "bg-[#FA6161]",
//     cards: [
//       {
//         id: "x1",
//         type: "Wind Mitigation Inspection",
//         urgent: false,
//         status: "Canceled",
//         statusStyle: "border-[#FA6161]/30 text-[#FA6161] bg-[#FA6161]/5",
//         payment: "Refunded",
//         report: "line",
//         insPay: "line",
//         assignedInspector: null,
//       },
//     ],
//   },
// };

// export default function InspectionBoardLayout() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState<TabType>("All");
//   const [sortOrder, setSortOrder] = useState<
//     "All" | "Four Point Inspection" | "Wind Mitigation" | "Flood Elevation" | "HVAC Inspection" | "Plumbing"
//   >("All");


//   // Board state — mutable so we can assign inspectors
//   const [boardData, setBoardData] = useState<Record<string, ColumnType>>(initialBoardData);

//   // Assign inspector to a specific card
//   const handleAssignInspector = (columnKey: string, cardId: string, inspectorId: string) => {
//     const inspector = availableInspectors.find((i) => i.id === inspectorId) ?? null;
//     setBoardData((prev) => ({
//       ...prev,
//       [columnKey]: {
//         ...prev[columnKey],
//         cards: prev[columnKey].cards.map((card) =>
//           card.id === cardId
//             ? { ...card, assignedInspector: inspector }
//             : card
//         ),
//       },
//     }));
//   };

//   const counts = useMemo(() => ({
//     All: initialInspectors.length,
//     Active: initialInspectors.filter((i) => i.status === "Active").length,
//     "Pending Review": initialInspectors.filter((i) => i.status === "Pending Review").length,
//     Suspended: initialInspectors.filter((i) => i.status === "Suspended").length,
//     Rejected: initialInspectors.filter((i) => i.status === "Rejected").length,
//   }), []);

//   const tabs: TabItem[] = [
//     { name: "All",            count: counts.All,              badge: "bg-gray-900 text-white" },
//     { name: "Active",         count: counts.Active,           badge: "bg-emerald-500 text-white" },
//     { name: "Pending Review", count: counts["Pending Review"], badge: "bg-amber-400 text-white" },
//     { name: "Suspended",      count: counts.Suspended,         badge: "bg-rose-400 text-white" },
//     { name: "Rejected",       count: counts.Rejected,          badge: "bg-red-400 text-white" },
//   ];

//   return (
//     <div className="w-full bg-slate-50/40 min-h-screen my-6 md:my-12 font-roboto">
//       <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6">

//         {/* TOP HEADER */}
//         <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">

//           {/* LEFT */}
//           <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">

//             {/* SEARCH */}
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

//             {/* FILTER TABS */}
//             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.name}
//                   onClick={() => setActiveTab(tab.name)}
//                   className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
//                     activeTab === tab.name
//                       ? "bg-black text-white"
//                       : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
//                   }`}
//                 >
//                   <span>{tab.name}</span>
//                   <span
//                     className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] ${
//                       activeTab === tab.name ? "bg-white/20 text-white" : tab.badge
//                     }`}
//                   >
//                     {tab.count}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="flex items-center gap-3 w-full sm:w-auto justify-end">

//             {/* SORT */}
//             {/* <div className="relative">
//               <button
//                 onClick={() => setOpen(!open)}
//                 className="flex items-center gap-2 bg-gray-50/60 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-900 font-normal cursor-pointer"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
//                   <path d="M11.666 8.75002L9.91602 10.5L8.16602 8.75002M9.91602 10.5V3.50002M2.91602 3.20835C2.91602 3.131 2.94674 3.05681 3.00144 3.00211C3.05614 2.94742 3.13033 2.91669 3.20768 2.91669H5.54102C5.61837 2.91669 5.69256 2.94742 5.74726 3.00211C5.80195 3.05681 5.83268 3.131 5.83268 3.20835V5.54169C5.83268 5.61904 5.80195 5.69323 5.74726 5.74793C5.69256 5.80263 5.61837 5.83335 5.54102 5.83335H3.20768C3.13033 5.83335 3.05614 5.80263 3.00144 5.74793C2.94674 5.69323 2.91602 5.61904 2.91602 5.54169V3.20835ZM2.91602 8.45835C2.91602 8.381 2.94674 8.30681 3.00144 8.25211C3.05614 8.19742 3.13033 8.16669 3.20768 8.16669H5.54102C5.61837 8.16669 5.69256 8.19742 5.74726 8.25211C5.80195 8.30681 5.83268 8.381 5.83268 8.45835V10.7917C5.83268 10.869 5.80195 10.9432 5.74726 10.9979C5.69256 11.0526 5.61837 11.0834 5.54102 11.0834H3.20768C3.13033 11.0834 3.05614 11.0526 3.00144 10.9979C2.94674 10.9432 2.91602 10.869 2.91602 10.7917V8.45835Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <span>Sort By : {sortOrder}</span>
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </button>

//               {open && (
//                 <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg z-50 overflow-hidden">
//                   {["All", "Four Point Inspection", "Wind Mitigation", "Flood Elevation", "HVAC Inspection", "Plumbing"].map((item) => (
//                     <button
//                       key={item}
//                       onClick={() => {
//                         setSortOrder(item as typeof sortOrder);
//                         setOpen(false);
//                       }}
//                       className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
//                         sortOrder === item ? "bg-gray-50 font-medium text-black" : "text-gray-600"
//                       }`}
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div> */}

//             {/* EXPORT */}
//             <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm cursor-pointer shadow-md shadow-blue-100 transition-all">
//               <Download className="w-4 h-4 stroke-[2.5]" />
//               <span>Export User Data</span>
//             </button>
//           </div>
//         </div>

//         {/* BOARD */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
//           {Object.entries(boardData).map(([key, column]) => (
//             <div key={key} className="flex flex-col gap-4">

//               {/* COLUMN HEADER */}
//               <div className={`w-full ${column.headerBg} text-white py-3 px-4 rounded-sm text-center text-xl font-semibold font-sora shadow-sm`}>
//                 {column.title}
//               </div>

//               {/* CARDS */}
//               <div className="flex flex-col gap-3.5">
//                 {column.cards.map((card) => (
//                   <div
//                     key={card.id}
//                     className={`bg-white rounded-xl border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-md ${
//                       card.urgent ? "border-red-300 ring-1 ring-red-400/5" : "border-gray-100"
//                     }`}
//                   >
//                     {/* CARD HEADER */}
//                     <div className="flex items-center justify-between gap-2 mb-3">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h4 className="font-bold text-gray-900 text-sm md:text-base leading-5">
//                           {card.type}
//                         </h4>
//                         {card.urgent && (
//                           <span className="bg-red-300 text-white text-[9px] font-normal px-1.5 py-0.5 rounded-full">
//                             Urgent
//                           </span>
//                         )}
//                       </div>
//                       <button className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer">
//                         <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
//                       </button>
//                     </div>

//                     {/* ── ASSIGNED INSPECTOR ROW ── */}
//                     <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-6 mb-4">
//                       <span>Assigned Inspector:</span>

//                       {card.assignedInspector ? (
//                         /* Inspector is assigned → show avatar + name */
//                         <div className="flex items-center gap-1.5">
//                           <div
//                             className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${card.assignedInspector.avatarColor}`}
//                           >
//                             {card.assignedInspector.avatar}
//                           </div>
//                           <span className="text-gray-800 font-medium text-sm">
//                             {card.assignedInspector.name}
//                           </span>
//                         </div>
//                       ) : (
//                         /* No inspector yet */
//                         <span className="text-[#B5BCC8] ml-1">Not assigned yet</span>
//                       )}
//                     </div>

//                     {/* ── STATUS / SELECT ── */}
//                     {card.status === "Select Inspector" ? (
//                       <div className="relative flex items-center gap-3 mb-5 flex-nowrap">
//                         <p className="text-[#090909] text-sm font-medium leading-5 whitespace-nowrap">
//                           Assign Inspector
//                         </p>

//                         <div className="relative w-full">
//                           <select
//                             className="w-full bg-white border border-[#B5BCC8] text-[#B5BCC8] rounded-xl py-2 pl-3 pr-8 text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
//                             value=""
//                             onChange={(e) => {
//                               if (e.target.value) {
//                                 handleAssignInspector(key, card.id, e.target.value);
//                               }
//                             }}
//                           >
//                             <option value="">Select Inspector</option>
//                             {availableInspectors.map((insp) => (
//                               <option key={insp.id} value={insp.id}>
//                                 {insp.name}
//                               </option>
//                             ))}
//                           </select>

//                           <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
//                             <ChevronDown className="w-3 h-3" />
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div
//                         className={`w-full text-center py-2 rounded-xl border text-[11px] font-bold tracking-wide mb-5 ${card.statusStyle}`}
//                       >
//                         {card.status}
//                       </div>
//                     )}

//                     {/* ── FOOTER STEPS ── */}
//                     <div className="grid grid-cols-3 gap-1   border-gray-100/70 text-center">

//                       {/* USER PAYMENT */}
//                       <div className="flex flex-col items-center">
//                         <span className="text-sm text-gray-600 leading-5 font-normal mb-1">
//                           User Payment
//                         </span>
//                         <span className="text-[11px] font-extrabold text-gray-800 border-b-2 border-emerald-500 pb-0.5 w-full">
//                           {card.payment}
//                         </span>
//                       </div>

//                       {/* INSPECTION REPORT */}
//                       <div className="flex flex-col items-center">
//                         <span className="text-sm text-[#B5BCC8] font-normal leading-5 mb-1">
//                           Inspection Report
//                         </span>
//                         {card.report === "line" ? (
//                           <div className="w-7 h-[2px] bg-gray-200 my-2 rounded-full" />
//                         ) : (
//                           <span className="text-[11px] font-extrabold text-gray-800 border-b-2 border-emerald-500 pb-0.5 w-full">
//                             {card.report}
//                           </span>
//                         )}
//                       </div>

//                       {/* INS. PAYMENT */}
//                       <div className="flex flex-col items-center">
//                         <span className="text-sm text-[#B5BCC8] font-normal leading-5 mb-1">
//                           Ins. Payment
//                         </span>
//                         {card.insPay === "line" ? (
//                           <div className="w-7 h-[2px] bg-gray-200 my-2 rounded-full" />
//                         ) : (
//                           <span className="text-[11px] font-extrabold text-gray-800 border-b-2 border-emerald-500 pb-0.5 w-full">
//                             {card.insPay}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }








// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   ChevronDown,
//   Download,
//   Eye,
//   Search,
// } from "lucide-react";

// type InspectorStatus =
//   | "Active"
//   | "Pending Review"
//   | "Suspended"
//   | "Rejected";

// type TabType = InspectorStatus | "All";

// interface TabItem {
//   name: TabType;
//   count: number;
//   badge?: string;
// }

// interface CardItem {
//   id: string;
//   type: string;
//   urgent: boolean;
//   status: string;
//   statusStyle?: string;
//   payment: string;
//   report: string;
//   insPay: string;
// }

// interface ColumnType {
//   title: string;
//   headerBg: string;
//   cards: CardItem[];
// }

// const initialInspectors = [
//   { status: "Active" },
//   { status: "Active" },
//   { status: "Pending Review" },
//   { status: "Suspended" },
//   { status: "Rejected" },
// ] as const;

// const boardData: Record<string, ColumnType> = {
//   pending: {
//     title: "Pending Inspections",
//     headerBg: "bg-[#FA9F15]",
//     cards: [
//       {
//         id: "p1",
//         type: "Roof Inspection",
//         urgent: true,
//         status: "Select Inspector",
//         payment: "Confirmed",
//         report: "line",
//         insPay: "line",
//       },
//       {
//         id: "p2",
//         type: "Roof Inspection",
//         urgent: false,
//         status: "Select Inspector",
//         payment: "Confirmed",
//         report: "line",
//         insPay: "line",
//       },
//     ],
//   },

//   assigned: {
//     title: "Inspector Assigned",
//     headerBg: "bg-[#4353FF]",
//     cards: [
//       {
//         id: "a1",
//         type: "Four Point Inspection",
//         urgent: false,
//         status: "Inspector Assigned",
//         statusStyle:
//           "border-[#4353FF] text-[#4353FF]",
//         payment: "Paid",
//         report: "line",
//         insPay: "line",
//       },
//       {
//         id: "a2",
//         type: "Four Point Inspection",
//         urgent: false,
//         status: "Inspector Assigned",
//         statusStyle:
//           "border-[#4353FF] text-[#4353FF]",
//         payment: "Paid",
//         report: "line",
//         insPay: "line",
//       },
//     ],
//   },

//   completed: {
//     title: "Completed Inspections",
//     headerBg: "bg-[#72C816]",
//     cards: [
//       {
//         id: "c1",
//         type: "Four Point Inspection",
//         urgent: false,
//         status: "Completed",
//         statusStyle:
//           "border-[#72C816] text-[#72C816] bg-[#72C816]/5",
//         payment: "Confirmed",
//         report: "Submitted",
//         insPay: "Released",
//       },
//       {
//         id: "c2",
//         type: "Four Point Inspection",
//         urgent: false,
//         status: "Completed",
//         statusStyle:
//           "border-[#72C816] text-[#72C816] bg-[#72C816]/5",
//         payment: "Confirmed",
//         report: "Submitted",
//         insPay: "Released",
//       },
//     ],
//   },

//   canceled: {
//     title: "Canceled Inspections",
//     headerBg: "bg-[#FA6161]",
//     cards: [
//       {
//         id: "x1",
//         type: "Wind Mitigation Inspection",
//         urgent: false,
//         status: "Canceled",
//         statusStyle:
//           "border-[#FA6161]/30 text-[#FA6161] bg-[#FA6161]/5",
//         payment: "Refunded",
//         report: "line",
//         insPay: "line",
//       },
//     ],
//   },
// };

// export default function InspectionBoardLayout() {
//   const [searchQuery, setSearchQuery] =
//     useState("");

//   const [activeTab, setActiveTab] =
//     useState<TabType>("All");

//   const [sortOrder, setSortOrder] = useState<
//     "All" | "Four Point Inspection" | "Wind Mitigation" | "Flood Elevation" | "HVAC Inspection" | "Plumbing"
//   >("All");

//   const [open, setOpen] = useState(false);

//   const counts = useMemo(() => {
//     return {
//       All: initialInspectors.length,

//       Active: initialInspectors.filter(
//         (i) => i.status === "Active"
//       ).length,

//       "Pending Review": initialInspectors.filter(
//         (i) => i.status === "Pending Review"
//       ).length,

//       Suspended: initialInspectors.filter(
//         (i) => i.status === "Suspended"
//       ).length,

//       Rejected: initialInspectors.filter(
//         (i) => i.status === "Rejected"
//       ).length,
//     };
//   }, []);

//   const tabs: TabItem[] = [
//     {
//       name: "All",
//       count: counts.All,
//       badge: "bg-gray-900 text-white",
//     },

//     {
//       name: "Active",
//       count: counts.Active,
//       badge: "bg-emerald-500 text-white",
//     },

//     {
//       name: "Pending Review",
//       count: counts["Pending Review"],
//       badge: "bg-amber-400 text-white",
//     },

//     {
//       name: "Suspended",
//       count: counts.Suspended,
//       badge: "bg-rose-400 text-white",
//     },

//     {
//       name: "Rejected",
//       count: counts.Rejected,
//       badge: "bg-red-400 text-white",
//     },
//   ];

//   return (
//     <div className="w-full bg-slate-50/40 min-h-screen my-6 md:my-12 font-roboto">
//       <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6">

//         {/* TOP HEADER */}
//         <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between mb-8 bg-white">

//           {/* LEFT */}
//           <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">

//             {/* SEARCH */}
//             <div className="relative w-full lg:max-w-xs shrink-0">
//               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

//               <input
//                 type="text"
//                 placeholder="Search inspector..."
//                 value={searchQuery}
//                 onChange={(e) =>
//                   setSearchQuery(e.target.value)
//                 }
//                 className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 leading-5 font-medium"
//               />
//             </div>

//             {/* FILTER TABS */}
//             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">

//               {tabs.map((tab) => (
//                 <button
//                   key={tab.name}
//                   onClick={() =>
//                     setActiveTab(tab.name)
//                   }
//                   className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
//                     activeTab === tab.name
//                       ? "bg-black text-white"
//                       : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
//                   }`}
//                 >
//                   <span>{tab.name}</span>

//                   <span
//                     className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] ${
//                       activeTab === tab.name
//                         ? "bg-white/20 text-white"
//                         : tab.badge
//                     }`}
//                   >
//                     {tab.count}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="flex items-center gap-3 w-full sm:w-auto justify-end">

//             {/* SORT */}
//            <div className="relative">

//   <button
//     onClick={() => setOpen(!open)}
//     className="flex items-center gap-2 bg-gray-50/60 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-900 font-normal cursor-pointer"
//   >
//     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
//   <path d="M11.666 8.75002L9.91602 10.5L8.16602 8.75002M9.91602 10.5V3.50002M2.91602 3.20835C2.91602 3.131 2.94674 3.05681 3.00144 3.00211C3.05614 2.94742 3.13033 2.91669 3.20768 2.91669H5.54102C5.61837 2.91669 5.69256 2.94742 5.74726 3.00211C5.80195 3.05681 5.83268 3.131 5.83268 3.20835V5.54169C5.83268 5.61904 5.80195 5.69323 5.74726 5.74793C5.69256 5.80263 5.61837 5.83335 5.54102 5.83335H3.20768C3.13033 5.83335 3.05614 5.80263 3.00144 5.74793C2.94674 5.69323 2.91602 5.61904 2.91602 5.54169V3.20835ZM2.91602 8.45835C2.91602 8.381 2.94674 8.30681 3.00144 8.25211C3.05614 8.19742 3.13033 8.16669 3.20768 8.16669H5.54102C5.61837 8.16669 5.69256 8.19742 5.74726 8.25211C5.80195 8.30681 5.83268 8.381 5.83268 8.45835V10.7917C5.83268 10.869 5.80195 10.9432 5.74726 10.9979C5.69256 11.0526 5.61837 11.0834 5.54102 11.0834H3.20768C3.13033 11.0834 3.05614 11.0526 3.00144 10.9979C2.94674 10.9432 2.91602 10.869 2.91602 10.7917V8.45835Z" stroke="#1A1A1A" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//     <span>
//       Sort By : {sortOrder}
//     </span>

//     <ChevronDown className="w-4 h-4 text-gray-400" />
//   </button>

//   {open && (
//     <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg z-50 overflow-hidden">

//       {[
//         "All",
//         "Four Point Inspection",
//         "Wind Mitigation",
//         "Flood Elevation",
//         "HVAC Inspection",
//         "Plumbing",
//       ].map((item) => (
//         <button
//           key={item}
//           onClick={() => {
//             setSortOrder(
//               item as
//                 | "All"
//                 | "Four Point Inspection"
//                 | "Wind Mitigation"
//                 | "Flood Elevation"
//                 | "HVAC Inspection"
//                 | "Plumbing"
//             );

//             setOpen(false);
//           }}
//           className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
//             sortOrder === item
//               ? "bg-gray-50 font-medium text-black"
//               : "text-gray-600"
//           }`}
//         >
//           {item}
//         </button>
//       ))}
//     </div>
//   )}
// </div>

//             {/* EXPORT */}
//             <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-md shadow-blue-100 transition-all">
//               <Download className="w-4 h-4 stroke-[2.5]" />

//               <span>Export User Data</span>
//             </button>
//           </div>
//         </div>

//         {/* BOARD */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">

//           {Object.entries(boardData).map(
//             ([key, column]) => (
//               <div
//                 key={key}
//                 className="flex flex-col gap-4"
//               >
//                 {/* HEADER */}
//                 <div
//                   className={`w-full ${column.headerBg} text-white py-3 px-4 rounded-xl text-center text-xl font-semibold font-sora shadow-sm `}
//                 >
//                   {column.title}
//                 </div>

//                 {/* CARDS */}
//                 <div className="flex flex-col gap-3.5">

//                   {column.cards.map((card) => (
//                     <div
//                       key={card.id}
//                       className={`bg-white rounded-xl border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-md ${
//                         card.urgent
//                           ? "border-red-300 ring-1 ring-red-400/5"
//                           : "border-gray-100"
//                       }`}
//                     >
//                       {/* CARD HEADER */}
//                       <div className="flex items-center justify-between gap-2 mb-3">

//                         <div className="flex items-center gap-2 flex-wrap">
//                           <h4 className="font-bold text-gray-900 text-sm md:text-base leading-5">
//                             {card.type}
//                           </h4>

//                           {card.urgent && (
//                             <span className="bg-red-300 text-white text-[9px] font-normal px-1.5 py-0.5 rounded-full">
//                               Urgent
//                             </span>
//                           )}
//                         </div>

//                         <button className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer">
//                           <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
//                         </button>
//                       </div>

//                       {/* INSPECTOR */}
//                       <p className="text-sm md:text-base text-gray-600 font-normal leading-6 mb-4">
//                         Assigned Inspector:
//                         <span className="text-[#B5BCC8]  ml-1">
//                           Not assigned yet
//                         </span>
//                       </p>

//                       {/* STATUS */}
//                       {card.status ===
//                       "Select Inspector" ? (
//                     <div className="relative flex items-center gap-3 mb-5 flex-nowrap">
  
//   <p className="text-[#090909] text-sm font-medium leading-5 whitespace-nowrap">
//     Assign Inspector
//   </p>

//   <div className="relative w-full">
//     <select className="w-full bg-white border border-[#B5BCC8] text-[#B5BCC8] rounded-xl py-2 pl-3 pr-8 text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer appearance-none">
//       <option>Select Inspector</option>
//     </select>

//     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
//       <ChevronDown />
//     </div>
//   </div>
// </div>
//                       ) : (
//                         <div
//                           className={`w-full text-center py-2 rounded-xl border text-[11px] font-bold tracking-wide mb-5 ${card.statusStyle}`}
//                         >
//                           {card.status}
//                         </div>
//                       )}

//                       {/* FOOTER */}
//                       <div className="grid grid-cols-3 gap-1 pt-3 border-t border-gray-100/70 text-center">

//                         {/* PAYMENT */}
//                         <div className="flex flex-col items-center">
//                           <span className="text-sm text-gray-600 leading-5 font-normal mb-1">
//                             User Payment
//                           </span>

//                           <span className="text-[11px] font-extrabold text-gray-800 border-b-2 border-emerald-500 pb-0.5 w-full">
//                             {card.payment}
//                           </span>
//                         </div>

//                         {/* REPORT */}
//                         <div className="flex flex-col items-center">

//                           <span className="text-sm text-[#B5BCC8] font-normal leading-5 mb-1">
//                             Inspection Report
//                           </span>

//                           {card.report ===
//                           "line" ? (
//                             <div className="w-7 h-[2px] bg-gray-200 my-2 rounded-full" />
//                           ) : (
//                             <span className="text-[11px] font-extrabold text-gray-800 border-b-2 border-emerald-500 pb-0.5 w-full">
//                               {card.report}
//                             </span>
//                           )}
//                         </div>

//                         {/* INS PAYMENT */}
//                         <div className="flex flex-col items-center">

//                           <span className="text-[9px] text-gray-400 font-bold mb-1">
//                             Ins. Payment
//                           </span>

//                           {card.insPay ===
//                           "line" ? (
//                             <div className="w-7 h-[2px] bg-gray-200 my-2 rounded-full" />
//                           ) : (
//                             <span className="text-[11px] font-extrabold text-gray-800 border-b-2 border-emerald-500 pb-0.5 w-full">
//                               {card.insPay}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }