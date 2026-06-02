"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Download, Eye, Star, Trash2, ArrowUpDown } from "lucide-react";

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

const initialReports: InspectionReport[] = [
  { id: "1", user: { name: "Brian Thompson", location: "Florida", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "brian@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "24 Dec 2025", status: "Complete" },
  { id: "2", user: { name: "Florence Haith", location: "Florida", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "florence@example.com", reportDetails: { text: "Not Submitted Yet", isSubmitted: false }, createdDate: "10 Dec 2025", status: "Pending" },
  { id: "3", user: { name: "Jerry Palmer", location: "Florida", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "jerry@example.com", reportDetails: { text: "Not Submitted Yet", isSubmitted: false }, createdDate: "27 Nov 2025", status: "Pending" },
  { id: "4", user: { name: "Mark Brainerd", location: "Florida", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "mark@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "27 Nov 2025", status: "Complete" },
  { id: "5", user: { name: "Roy Thomas", location: "Florida", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "roy@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "06 Nov 2025", status: "Complete" },
  { id: "6", user: { name: "Alisia Chen", location: "Florida", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "alisia@example.com", reportDetails: { text: "Not Submitted Yet", isSubmitted: false }, createdDate: "25 Oct 2025", status: "Started" },
  { id: "7", user: { name: "Kelly Myers", location: "Florida", initials: "KM" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "kelly@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "14 Oct 2025", status: "Complete" },
  { id: "8", user: { name: "James Walton", location: "Florida", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80" }, inspectionId: "INS-0125454556", reportId: "RPT-1821", inspectorEmail: "james@example.com", reportDetails: { text: "1 PDF", subText: "38 images - 8.2 MB", isSubmitted: true }, createdDate: "03 Oct 2025", status: "Archived" },
];

export default function ReportsTable() {
  const [activeFilter, setActiveFilter] = useState<"All" | ReportStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");


  const counts = useMemo(() => {
    return {
      All: initialReports.length,
      Complete: initialReports.filter((r) => r.status === "Complete").length,
      Pending: initialReports.filter((r) => r.status === "Pending").length,
      Started: initialReports.filter((r) => r.status === "Started").length,
      Archived: initialReports.filter((r) => r.status === "Archived").length,
    };
  }, []);


  const filteredReports = useMemo(() => {
    let result = [...initialReports];

    if (activeFilter !== "All") {
      result = result.filter((r) => r.status === activeFilter);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.user.name.toLowerCase().includes(query) ||
          r.inspectionId.toLowerCase().includes(query) ||
          r.inspectorEmail.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);


  const handleExportCSV = () => {
    if (filteredReports.length === 0) return;

    const headers = ["User Name", "Location", "Inspection ID", "Report ID", "Inspector Email", "Report Status", "Created Date", "Status"];
    const rows = filteredReports.map((r) => [
      r.user.name,
      r.user.location,
      r.inspectionId,
      r.reportId,
      r.inspectorEmail,
      r.reportDetails.text,
      r.createdDate,
      r.status
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Inspection_Reports_${activeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full  bg-white min-h-screen my-6 md:my-12 font-roboto antialiased select-none">
      
    
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
                className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5  ${
                  activeFilter === filter
                    ? "bg-black text-white"
                    : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
                }`}
              >
                {filter}
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    filter === "Complete" ? "bg-emerald-50 text-emerald-600" :
                    filter === "Pending" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {counts[filter]}
                </span>
              </button>
            ))}
          </div>
        </div>

        
        <button
          onClick={handleExportCSV}
          disabled={filteredReports.length === 0}
          className="flex items-center gap-2 bg-primaryColor hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm shadow-md shadow-blue-100 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

    
      {filteredReports.length > 0 ? (
        <>
        <div className="w-full overflow-x-auto no-scrollbar">

         <div className="min-w-[1200px] border border-gray-100 rounded-2xl overflow-hidden ">
    
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
              <tbody className="divide-y divide-gray-100 ">
                {filteredReports.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* User Profile */}
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

                    {/* ID Fields */}
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5 ">{row.inspectionId}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5 ">{row.reportId}</td>

                    {/* Inspector Email */}
                    <td className="py-3.5 px-4 flex items-center gap-2 text-gray-900 text-[13px] leading-5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0 overflow-hidden relative">
                        {row.user.avatar && <Image src={row.user.avatar} alt="inspector" fill className="object-cover" unoptimized />}
                      </div>
                      <span className="font-normal">{row.inspectorEmail}</span>
                    </td>

                    {/* Report Details Status */}
                    <td className="py-3.5 px-4">
                      {row.reportDetails.isSubmitted ? (
                        <div>
                          <span className="font-medium text-sm text-gray-900 block leading-5">{row.reportDetails.text}</span>
                          <span className="text-[#5C6470] text-xs mt-0.5 block font-normal leading-5">{row.reportDetails.subText}</span>
                        </div>
                      ) : (
                        <span className="text-red-500 font-medium texm-sm leading-5">{row.reportDetails.text}</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.createdDate}</td>

                    {/* Custom Styled Status Badges */}
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        row.status === "Complete" ? "bg-[#E6F9F0] text-[#10B981]" : 
                        row.status === "Pending" ? "bg-red-50 text-red-400" : "bg-amber-50 text-amber-500"
                      }`}>
                        {row.status === "Pending" ? "Not Submitted" : row.status}
                      </span>
                    </td>

                    {/* Action Panel Buttons */}
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer transition-colors border border-gray-100">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer  transition-colors border border-gray-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer  transition-colors border border-gray-100">
                          <Star className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#5C6470] hover:text-primaryColor bg-[#EFEFFF] hover:bg-blue-50 rounded-sm cursor-pointer  transition-colors border border-gray-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
      
        </>
      ) : (
       
        <div className="w-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-sm">No inspection reports matches your current query or filters.</p>
        </div>
      )}
    </div>
  );
}