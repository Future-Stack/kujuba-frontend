"use client";

import React from "react";
import Image from "next/image";

// Defining the user structure for strict typing
interface User {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  avatarUrl?: string; // Optional, defaults to initials placeholder
}

// Sample mock data mapped exactly from your UI image
const users: User[] = [
  { id: "1", name: "Shaun Farley", email: "shaunfarley@example.com", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
  { id: "2", name: "Jenny Ellis", email: "jenel@example.com", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" },
  { id: "3", name: "Aliza Duncan", email: "alizadu@example.com", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" },
  { id: "4", name: "Karen Galvan", email: "karen@example.com", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
  { id: "5", name: "Leslie Hensley", email: "leslie@example.com", status: "Inactive" },
];

export default function UserTable() {
  return (
    <div className="w-full  p-4 md:p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm font-roboto">
      
      {/* Table Header Section */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">User</h2>
        <button className="bg-black hover:bg-gray-800 text-white text-sm font-semibold py-2 px-5 rounded-xl transition-all duration-200">
          View All
        </button>
      </div>

      {/* Responsive Wrapper for handling small viewport horizontal overflow */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100/80 bg-[#F5F6FA]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          
          {/* Column Names */}
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-6 text-sm font-semibold text-gray-800 w-[35%]">Name</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-800 w-[45%]">Email Address</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-800 w-[20%]">Status</th>
            </tr>
          </thead>

          {/* Table Content Data Rows */}
          <tbody className="bg-white">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                
                {/* Column: Name with Profile Badge */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 shrink-0">
                      {user.avatarUrl ? (
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            fill
                            className="object-cover"
                            unoptimized // Used here for external image prototyping convenience
                          />
                        </div>
                      ) : (
                        /* Initial fallback badge styling for Leslie Hensley */
                        <div className="w-full h-full bg-[#e0e7ff] text-[#6366f1] rounded-full flex items-center justify-center font-bold text-sm tracking-wide">
                          LH
                        </div>
                      )}
                      
                      {/* Live Online/Offline Status Circular Badge */}
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.status === "Active" ? "bg-[#09BD3C]" : "bg-[#ef4444]"
                      }`} />
                    </div>
                    <span className="font-medium text-gray-900 text-sm  leading-5">{user.name}</span>
                  </div>
                </td>

                {/* Column: Email Address */}
                <td className="py-4 px-6 text-sm  text-gray-600 font-normal leading-5">
                  {user.email}
                </td>

                {/* Column: Status Label Pill */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-medium  ${
                    user.status === "Active" 
                      ? "bg-[#e8fbf0] text-[#09BD3C]" 
                      : "bg-[#fde8e8] text-[#dc2626]"
                  }`}>
                    {user.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}