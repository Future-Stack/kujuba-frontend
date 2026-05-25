"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ArrowUpDown, Download, MoreVertical } from "lucide-react";

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

export default function PaymentsTable() {
  const [activeFilter, setActiveFilter] = useState<"All" | TransactionStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");


  const counts = useMemo(() => {
    return {
      All: initialTransactions.length,
      Complete: initialTransactions.filter((t) => t.status === "Complete").length,
      Pending: initialTransactions.filter((t) => t.status === "Pending").length,
      Canceled: initialTransactions.filter((t) => t.status === "Canceled").length,
    };
  }, []);

 
  const filteredTransactions = useMemo(() => {
    let result = [...initialTransactions];


    if (activeFilter !== "All") {
      result = result.filter((t) => t.status === activeFilter);
    }

   
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

  const handleExportData = () => {
    if (filteredTransactions.length === 0) return;


    const headers = ["User Name", "Location", "Transaction ID", "Payment Type", "Inspector Email", "Phone", "Amount", "Created Date", "Status"];
    

    const rows = filteredTransactions.map((t) => [
      t.user.name,
      t.user.location,
      t.transactionId,
      t.paymentType,
      t.inspectorEmail,
      t.phone,
      t.amount,
      t.createdDate,
      t.status
    ]);

  
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Transactions_${activeFilter}_View.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <button
              onClick={() => setActiveFilter("All")}
              className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "All" ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("Complete")}
              className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "Complete" ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
              }`}
            >
              Complete <span className="min-w-4 h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] bg-emerald-500 text-white">{counts.Complete}</span>
            </button>
            <button
              onClick={() => setActiveFilter("Pending")}
              className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "Pending" ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
              }`}
            >
              Pending <span className="bg-amber-400 text-white min-w-4 h-4 px-1.5 rounded-full text-[10px]">{counts.Pending}</span>
            </button>
            <button
              onClick={() => setActiveFilter("Canceled")}
              className={`px-3 py-2 rounded-sm text-sm font-normal leading-5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "Canceled" ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-slate-100 border border-gray-100"
              }`}
            >
              Canceled <span className="bg-red-400 text-white min-w-4 h-4 px-1.5 rounded-full text-[10px]">{counts.Canceled}</span>
            </button>
          </div>
        </div>

    
        <div className="flex items-center gap-2.5 self-end lg:self-auto">
          <button className="flex items-center gap-1.5 bg-slate-50 border border-gray-100 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            Sort By
          </button>
          
          <button 
            onClick={handleExportData}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-2 bg-primaryColor hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-sm shadow-md shadow-blue-100 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>


      {filteredTransactions.length > 0 ? (
        <>
             <div className="w-full overflow-x-auto no-scrollbar">

         <div className="min-w-[1200px] border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
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
              <tbody className="divide-y divide-gray-100 ">
                {filteredTransactions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
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
                        <span className="font-medium text-sm leading-5 text-gray-900 block ">{row.user.name}</span>
                        <span className="text-gray-600 text-[13px] mt-1 block font-normal leading-4">{row.user.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5 ">{row.transactionId}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.paymentType}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.inspectorEmail}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.phone}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.amount}</td>
                    <td className="py-3.5 px-4 text-gray-900 text-sm font-normal leading-5">{row.createdDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-3 py-1.5 rounded text-[10px] font-bold   ${
                        row.status === "Complete" ? "bg-[#E9F9F2] text-[#01B664]" : 
                        row.status === "Pending" ? "bg-[#FAE7E7] text-[#DC3545]" : "bg-[#FFF1F1] text-[#FA6161]"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4 mx-auto" />
                      </button>
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
          <p className="text-gray-400 font-bold text-sm">No transactions matches your current filters or search text.</p>
        </div>
      )}
    </div>
  );
}