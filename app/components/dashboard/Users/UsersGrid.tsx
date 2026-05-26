/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ArrowUpDown, Download, Mail, ChevronRight, ChevronDown } from "lucide-react";
import UserDetailsModal, { UserCard } from "./UserDetailsModal";


const initialUsers: UserCard[] = [
  { id: "1", name: "Brain Thompson", role: "User", location: "Florida", email: "brian@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, cancelledInspections: 1, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", createdAt: 1716462000000, status: "Active", joiningDate: "10 Apr, 2025" },
  { id: "2", name: "Florence Haith", role: "User", location: "Florida", email: "florence@example.com", phone: "+1 310 555 0190", inspectionsCount: 3, cancelledInspections: 2, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", createdAt: 1716375600000, status: "Active", joiningDate: "08 Apr, 2025" },
  { id: "3", name: "Jerry Palmer", role: "User", location: "Florida", email: "jerry@example.com", phone: "+1 415 555 0122", inspectionsCount: 3, cancelledInspections: 0, avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", createdAt: 1716289200000, status: "Active", joiningDate: "06 Apr, 2025" },
  { id: "4", name: "Mark Brainerd", role: "User", location: "Florida", email: "mark@example.com", phone: "+1 646 555 0167", inspectionsCount: 3, cancelledInspections: 1, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", createdAt: 1716202800000, status: "Suspended", joiningDate: "04 Apr, 2025" },
  { id: "5", name: "Roy Thomas", role: "User", location: "Florida", email: "roy@example.com", phone: "+1 702 555 0181", inspectionsCount: 3, cancelledInspections: 3, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", createdAt: 1716116400000, status: "Active", joiningDate: "02 Apr, 2025" },
  { id: "6", name: "Alisia Chen", role: "User", location: "Florida", email: "alisia@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, cancelledInspections: 2, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", createdAt: 1716030000000, status: "Active", joiningDate: "01 Apr, 2025" },
  { id: "7", name: "Kelly Myers", role: "User", location: "Florida", email: "kelly@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, cancelledInspections: 1, createdAt: 1715943600000, status: "Active", joiningDate: "30 Mar, 2025" },
  { id: "8", name: "James Walton", role: "User", location: "Florida", email: "james@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, cancelledInspections: 0, avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80", createdAt: 1715857200000, status: "Active", joiningDate: "28 Mar, 2025" },
  { id: "9", name: "Dennis Smith", role: "User", location: "Florida", email: "dennis@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, cancelledInspections: 2, avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80", createdAt: 1715770800000, status: "Suspended", joiningDate: "26 Mar, 2025" },
  { id: "10", name: "David Spiegel", role: "User", location: "Florida", email: "david@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, cancelledInspections: 1, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80", createdAt: 1715684400000, status: "Active", joiningDate: "24 Mar, 2025" },
  { id: "11", name: "Melissa Davis", role: "User", location: "Florida", email: "melissa@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, cancelledInspections: 0, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80", createdAt: 1715598000000, status: "Active", joiningDate: "22 Mar, 2025" },
  { id: "12", name: "Roberto Theisen", role: "Italy", location: "Florida", email: "roberto@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, cancelledInspections: 2, avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=100&q=80", createdAt: 1715511600000, status: "Active", joiningDate: "20 Mar, 2025" },
];

export default function UserGridDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserCard | null>(null); 

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...initialUsers];
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.location.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) =>
      sortOrder === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );
    return result;
  }, [searchQuery, sortOrder]);

  return (
    <div className="w-full min-h-screen font-roboto mt-4 antialiased selection:bg-blue-500 selection:text-white">
      <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-8 bg-white p-4 rounded-2xl">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-gray-50/60 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-900 font-normal cursor-pointer leading-5"
              >
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
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
        {filteredAndSortedUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredAndSortedUsers.map((user) => {
              const initials = user.name.split(" ").map((n:any) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="relative w-11 h-11 shrink-0">
                        {user.avatarUrl ? (
                          <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-50">
                            <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold text-xs tracking-wide border border-purple-100">
                            {initials}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#09BD3C] border-2 border-white shadow-sm" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-5 truncate group-hover:text-blue-600 transition-colors">{user.name}</h4>
                        <p className="text-[13px] text-gray-600 font-normal leading-4 mt-0.5">{user.role}</p>
                      </div>
                    </div>

                    <div className="bg-[#F5F6FA] rounded-xl p-3 space-y-2.5 mb-5 border border-gray-50/50">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 14H14M3.33333 14V4.66667L8.66667 2V14M12.6667 14V7.33333L8.66667 4.66667M6 6V6.00667M6 8V8.00667M6 10V10.0067M6 12V12.0067" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="truncate">{user.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.33333 2.66667H8.66667M8 11.3333V11.34M4 3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H5.33333C4.97971 14 4.64057 13.8595 4.39052 13.6095C4.14048 13.3594 4 13.0203 4 12.6667V3.33333Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="truncate">{user.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[13px] text-gray-900 font-semibold leading-5 mb-3 px-0.5">
                      <span>Inspection</span>
                      <span className="text-gray-900 text-sm leading-5 font-normal px-1.5 py-0.5 rounded">
                        {String(user.inspectionsCount).padStart(2, "0")}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedUser(user)} // ✅
                      className="w-full border border-gray-200 text-gray-900 hover:bg-blue-600 hover:text-white cursor-pointer font-medium text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
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

    
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}



// "use client";

// import React, { useState, useMemo } from "react";
// import Image from "next/image";
// import { Search, ArrowUpDown, Download, MapPin, Mail, Phone, ChevronRight, ChevronDown } from "lucide-react";


// interface UserCard {
//   id: string;
//   name: string;
//   role: string;
//   location: string;
//   email: string;
//   phone: string;
//   inspectionsCount: number;
//   avatarUrl?: string;
//   createdAt: number; 
// }

// const initialUsers: UserCard[] = [
//   { id: "1", name: "Brain Thompson", role: "User", location: "Florida", email: "brian@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", createdAt: 1716462000000 },
//   { id: "2", name: "Florence Haith", role: "User", location: "Florida", email: "florence@example.com", phone: "+1 310 555 0190", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", createdAt: 1716375600000 },
//   { id: "3", name: "Jerry Palmer", role: "User", location: "Florida", email: "jerry@example.com", phone: "+1 415 555 0122", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", createdAt: 1716289200000 },
//   { id: "4", name: "Mark Brainerd", role: "User", location: "Florida", email: "mark@example.com", phone: "+1 646 555 0167", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", createdAt: 1716202800000 },
//   { id: "5", name: "Roy Thomas", role: "User", location: "Florida", email: "roy@example.com", phone: "+1 702 555 0181", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", createdAt: 1716116400000 },
//   { id: "6", name: "Alisia Chen", role: "User", location: "Florida", email: "alisia@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", createdAt: 1716030000000 },
//   { id: "7", name: "Kelly Myers", role: "User", location: "Florida", email: "brian@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, createdAt: 1715943600000 }, // No avatar fallback
//   { id: "8", name: "James Walton", role: "User", location: "Florida", email: "brian@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80", createdAt: 1715857200000 },
//   { id: "9", name: "Dennis Smith", role: "User", location: "Florida", email: "brian@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80", createdAt: 1715770800000 },
//   { id: "10", name: "David Spiegel", role: "User", location: "Florida", email: "brian@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80", createdAt: 1715684400000 },
//   { id: "11", name: "Melissa Davis", role: "User", location: "Florida", email: "brian@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80", createdAt: 1715598000000 },
//   { id: "12", name: "Roberto Theisen", role: "Italy", location:"Florida", email: "brian@example.com", phone: "+1 578 209 4965", inspectionsCount: 3, avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=100&q=80", createdAt: 1715511600000 },
// ];

// export default function UserGridDashboard() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
//   const [open, setOpen] = useState(false);

//   const filteredAndSortedUsers = useMemo(() => {
//     let result = [...initialUsers];

//     if (searchQuery.trim() !== "") {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(
//         (user) =>
//           user.name.toLowerCase().includes(query) ||
//           user.email.toLowerCase().includes(query) ||
//           user.location.toLowerCase().includes(query)
//       );
//     }


//     result.sort((a, b) => {
//       if (sortOrder === "newest") {
//         return b.createdAt - a.createdAt;
//       } else {
//         return a.createdAt - b.createdAt;
//       }
//     });

//     return result;
//   }, [searchQuery, sortOrder]);

//   return (
//     <div className="w-full    min-h-screen font-roboto mt-4 antialiased selection:bg-blue-500 selection:text-white">
//        <div className="border rounded-2xl border-gray-100 shadow-sm px-4 py-6">
       
//       <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-8 bg-white p-4 rounded-2xl ">
        
    
//         <div className="relative w-full sm:max-w-xs">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/60 border border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 font-medium"
//           />
//         </div>

   
//         <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
         
//      <div className="relative">
      
//       {/* Trigger */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-2 bg-gray-50/60 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-900 font-normal cursor-pointer leading-5"
//       >
//         <ArrowUpDown className="w-4 h-4 text-gray-400" />

//         <span>
//           Sort By : {sortOrder === "newest" ? "Newest" : "Oldest"}
//         </span>

//         <ChevronDown className="w-4 h-4 text-gray-400" />
//       </button>

//       {/* Dropdown */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white text-gray-600 shadow-lg z-50 overflow-hidden">
          
//           <button
//             onClick={() => {
//               setSortOrder("newest");
//               setOpen(false);
//             }}
//             className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer "
//           >
//             Newest
//           </button>

//           <button
//             onClick={() => {
//               setSortOrder("oldest");
//               setOpen(false);
//             }}
//             className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer "
//           >
//             Oldest
//           </button>

//         </div>
//       )}
//     </div>


       
//           <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-md shadow-blue-100 transition-all active:scale-[0.98]">
//             <Download className="w-4 h-4 stroke-[2.5]" />
//             <span className=" ">Export User Data</span>
//           </button>
//         </div>
//       </div>


//       {filteredAndSortedUsers.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-5">
//           {filteredAndSortedUsers.map((user, index) => (
//             <div
//               key={user.id}
//               className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
//             >
//               <div>
               
//                 <div className="flex items-center gap-3 mb-5">
//                   <div className="relative w-11 h-11 shrink-0">
//                     {user.avatarUrl ? (
//                       <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-50">
//                         <Image
//                           src={user.avatarUrl}
//                           alt={user.name}
//                           fill
//                           className="object-cover"
//                           unoptimized
//                         />
//                       </div>
//                     ) : (
                    
//                       <div className="w-full h-full bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold text-xs tracking-wide border border-purple-100">
//                         KM
//                       </div>
//                     )}
                   
//                     <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#09BD3C] border-2 border-white shadow-sm" />
//                   </div>

//                   <div className="min-w-0">
//                     <h4 className="font-medium text-gray-900 text-sm leading-5 truncate group-hover:text-primaryColor transition-colors">
//                       {user.name}
//                     </h4>
//                     <p className="text-[13px] text-gray-600 font-normal leading-4 mt-0.5">{user.role}</p>
//                   </div>
//                 </div>

              
//                 <div className="bg-[#F5F6FA] rounded-xl p-3 space-y-2.5 mb-5 border border-gray-50/50">
//                   <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//   <path d="M2 14H14M3.33333 14V4.66667L8.66667 2V14M12.6667 14V7.33333L8.66667 4.66667M6 6V6.00667M6 8V8.00667M6 10V10.0067M6 12V12.0067" stroke="#1A1A1A" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//                     <span className="truncate ">{user.location}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
//                     <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
//                     <span className="truncate">{user.email}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600 font-normal leading-5">
//                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//   <path d="M7.33333 2.66667H8.66667M8 11.3333V11.34M4 3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H5.33333C4.97971 14 4.64057 13.8595 4.39052 13.6095C4.14048 13.3594 4 13.0203 4 12.6667V3.33333Z" stroke="#1A1A1A" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//                     <span className="truncate">{user.phone}</span>
//                   </div>
//                 </div>
//               </div>

              
//               <div>
//                 <div className="flex items-center justify-between text-[13px] text-gray-900 font-semibold leading-5 mb-3 px-0.5">
//                   <span>Inspection</span>
//                   <span className="text-gray-900 text-sm leading-5 font-normal  px-1.5 py-0.5 rounded">
//                     {String(user.inspectionsCount).padStart(2, "0")}
//                   </span>
//                 </div>

           
//                <button className="w-full border border-gray-200 text-gray-900 hover:bg-primaryColor hover:text-white cursor-pointer font-medium text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors">
//                     <span>View Details</span>
//                     <ChevronRight className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
//                   </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
   
//         <div className="w-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
//           <p className="text-gray-400 font-medium text-sm">No users found matching your search query.</p>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// }