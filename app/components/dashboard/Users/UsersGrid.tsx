/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ArrowUpDown, Download, Mail, ChevronRight, ChevronDown } from "lucide-react";
import UserDetailsModal, { UserCard } from "./UserDetailsModal";
import { useGetUserByIdQuery, useGetUsersQuery } from "@/app/redux/features/usersApi";


export default function UserGridDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedUser, setSelectedUser] = useState<UserCard | null>(null); 
 const [selectedId, setSelectedId] = useState<number | null>(null);
const { data: usersData, isLoading } = useGetUsersQuery("homeowner");
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

 const { data: singleUserData } = useGetUserByIdQuery(
  { id: selectedId as number, user_type: "homeowner" },
  { skip: !selectedId }
);
  
const users = usersData?.data?.data || [];

const filteredAndSortedUsers = useMemo(() => {
  let result = [...users];

  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();

    result = result.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.address?.toLowerCase().includes(query)
    );
  }

  result.sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return result;
}, [users, searchQuery, sortOrder]);
const paginatedUsers = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return filteredAndSortedUsers.slice(startIndex, endIndex);
}, [filteredAndSortedUsers, currentPage]);

const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  const handleExport = () => {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Location",
    "Role",
    "Status",
    "Inspections",
    "Joining Date",
  ];

  const rows = paginatedUsers.map((user) => [
    user.name,
    user.email,
    user.phone,
    user.location,
    user.role,
    user.status,
    user.inspectionsCount,
    user.joiningDate,
  ]);

  const csvContent =
    [headers, ...rows]
      .map((e) => e.map((v) => `"${v ?? ""}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "users-data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="w-full min-h-screen font-roboto mt-4 antialiased selection:bg-blue-500 selection:text-white">
      <div className="border rounded-sm border-[#E8E8E8]  p-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-8 bg-white p-4 rounded-2xl">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
      
            <button onClick={handleExport} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 curosr-pointer rounded-sm shadow-md shadow-blue-100 transition-all active:scale-[0.98]">
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export User Data</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        {filteredAndSortedUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredAndSortedUsers.map((user) => {
              const fullName = `${user.first_name || ""} ${user.last_name || ""}`;

const initials = fullName
  .trim()
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()
  .slice(0, 2);
             
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-[5px] border border-gray-200 p-5  hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="relative w-11 h-11 shrink-0">
                    {user.image ? (
  <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-50">
    <Image
      src={user.image}
      alt={`${user.first_name} ${user.last_name}`}
      fill
      className="object-cover"
      unoptimized
    />
  </div>
) : (
  <div className="w-full h-full bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold text-xs">
    {initials}
  </div>
)}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#09BD3C] border-2 border-white shadow-sm" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-5 truncate group-hover:text-blue-600 transition-colors">  {user.first_name} {user.last_name}</h4>
                        <p className="text-[13px] text-gray-600 font-normal leading-4 mt-0.5">{user.user_type}</p>
                      </div>
                    </div>

                    <div className="bg-[#F5F6FA] rounded-xl p-3 space-y-2.5 mb-5 border border-gray-50/50">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 14H14M3.33333 14V4.66667L8.66667 2V14M12.6667 14V7.33333L8.66667 4.66667M6 6V6.00667M6 8V8.00667M6 10V10.0067M6 12V12.0067" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="truncate">{user.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M2 4.66671C2 4.31309 2.14048 3.97395 2.39052 3.7239C2.64057 3.47385 2.97971 3.33337 3.33333 3.33337H12.6667C13.0203 3.33337 13.3594 3.47385 13.6095 3.7239C13.8595 3.97395 14 4.31309 14 4.66671M2 4.66671V11.3334C2 11.687 2.14048 12.0261 2.39052 12.2762C2.64057 12.5262 2.97971 12.6667 3.33333 12.6667H12.6667C13.0203 12.6667 13.3594 12.5262 13.6095 12.2762C13.8595 12.0261 14 11.687 14 11.3334V4.66671M2 4.66671L8 8.66671L14 4.66671" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.33333 2.66667H8.66667M8 11.3333V11.34M4 3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H5.33333C4.97971 14 4.64057 13.8595 4.39052 13.6095C4.14048 13.3594 4 13.0203 4 12.6667V3.33333Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="truncate">{user.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[13px] text-gray-900 font-semibold leading-5 mb-3 px-0.5">
                      <span>Inspection</span>
                      <span className="text-gray-900 text-sm leading-5 font-normal px-1.5 py-0.5 rounded">
                       {String(user.total_inspections).padStart(2, "0")}
                      </span>
                    </div>

                    <button
                      onClick={() => {
  setSelectedId(user.id);
  setSelectedUser(user);
}}
                      className="w-full border border-gray-200 text-gray-900 hover:bg-blue-600 hover:text-white cursor-pointer font-medium text-sm py-2.5 px-4 rounded-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>View Details</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M5.19727 11.62L9.0006 7.81667C9.44977 7.3675 9.44977 6.6325 9.0006 6.18334L5.19727 2.38" stroke="white" stroke-width="1.5" stroke-miterlimit="10" strokeLinecap="round" stroke-linejoin="round"/>
</svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-sm">No users found matching your search query.</p>
          </div>
        )}
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
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
    
{selectedUser && (
  <UserDetailsModal
    user={selectedUser}
    onClose={() => setSelectedUser(null)}
  />
)}
    </div>
  );
}

