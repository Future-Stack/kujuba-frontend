"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";


// Helper function to extract user name initials dynamically when an avatar doesn't exist
const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

function UserTableSkeleton() {
  return (
    <div className="w-full h-full p-4 md:p-6 bg-white rounded-[16px] border border-gray-100 animate-pulse">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-gray-200 rounded" />
        <div className="h-10 w-24 bg-gray-200 rounded" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full min-w-[600px]">
          
          <thead>
            <tr>
              <th className="py-4 px-6">
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </th>

              <th className="py-4 px-6">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </th>

              <th className="py-4 px-6">
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-t border-gray-100">
                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-200" />

                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="h-4 w-52 bg-gray-200 rounded" />
                </td>

                <td className="py-4 px-6">
                  <div className="h-6 w-20 bg-gray-200 rounded-md" />
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default function UserTable() {
  // 1. Fetch data from your dashboard endpoint hook
  const { data: response, isLoading, isError } = useGetOverviewQuery();


  if (isLoading) {
  return <UserTableSkeleton />;
}
  if (isError || !response?.success) return <div className="w-full bg-white p-6 rounded-[16px] border text-center text-red-500">Failed to load users.</div>;

  const users = response.data.recent_users;

  return (
    <div className="w-full h-full p-4 md:p-6 bg-white rounded-[16px] border border-gray-100 hover:shadow-sm font-roboto">
      
      {/* Table Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Recent Users</h2>
        <Link href="/dashboard/users">
          <button className="bg-black hover:bg-gray-800 text-white text-sm font-semibold py-2 px-5 rounded-sm transition-all cursor-pointer duration-200">
            View All
          </button>
        </Link>
      </div>

      {/* Responsive Wrapper for handling small viewport horizontal overflow */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-[#F5F6FA]">
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
            {users.map((user) => {
              const hasAvatar = user.profile && user.profile.avatar;
              const isActive = user.status.toLowerCase() === "active";

              return (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  
                  {/* Column: Name with Profile Badge */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 shrink-0">
                        {hasAvatar ? (
                          <div className="w-full h-full rounded-full overflow-hidden relative">
                            <Image
                              src={user.profile.avatar!}
                              alt={user.name}
                              fill
                              className="object-cover"
                              unoptimized // Keeps external profile layout simple for prototyping
                            />
                          </div>
                        ) : (
                          /* Initial fallback badge styling using computed dynamic values */
                          <div className="w-full h-full bg-[#e0e7ff] text-[#6366f1] rounded-full flex items-center justify-center font-bold text-sm tracking-wide">
                            {getInitials(user.name)}
                          </div>
                        )}
                        
                        {/* Live Status Circular Badge indicator on user profile edge */}
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          isActive ? "bg-[#09BD3C]" : "bg-[#ef4444]"
                        }`} />
                      </div>
                      <span className="font-medium text-gray-900 text-sm leading-5">{user.name}</span>
                    </div>
                  </td>

                  {/* Column: Email Address */}
                  <td className="py-4 px-6 text-sm text-gray-600 font-normal leading-5">
                    {user.email}
                  </td>

                  {/* Column: Status Label Pill */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider ${
                      isActive 
                        ? "bg-[#e8fbf0] text-[#09BD3C]" 
                        : "bg-[#fde8e8] text-[#dc2626]"
                    }`}>
                      {user.status}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}





// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";

// // Defining the user structure for strict typing
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   status: "Active" | "Inactive";
//   avatarUrl?: string; // Optional, defaults to initials placeholder
// }

// // Sample mock data mapped exactly from your UI image
// const users: User[] = [
//   { id: "1", name: "Shaun Farley", email: "shaunfarley@example.com", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
//   { id: "2", name: "Jenny Ellis", email: "jenel@example.com", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" },
//   { id: "3", name: "Aliza Duncan", email: "alizadu@example.com", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" },
//   { id: "4", name: "Karen Galvan", email: "karen@example.com", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
//   { id: "5", name: "Leslie Hensley", email: "leslie@example.com", status: "Inactive" },
// ];

// export default function UserTable() {
//   return (
//     <div className="w-full  p-4 md:p-6 bg-white rounded-[16px] border border-gray-100 hover:shadow-sm font-roboto">
      
//       {/* Table Header Section */}
//       <div className="flex items-center justify-between mb-6 ">
//         <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">User</h2>
//         <Link href="/dashboard/users">
//         <button className="bg-black hover:bg-gray-800 text-white text-sm font-semibold py-2 px-5 rounded-sm transition-all cursor-pointer duration-200">
//           View All
//         </button>
//         </Link>
//       </div>

//       {/* Responsive Wrapper for handling small viewport horizontal overflow */}
//       <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-[#F5F6FA]">
//         <table className="w-full text-left border-collapse min-w-[600px]">
          
//           {/* Column Names */}
//           <thead>
//             <tr className="border-b border-gray-100">
//               <th className="py-4 px-6 text-sm font-semibold text-gray-800 w-[35%]">Name</th>
//               <th className="py-4 px-6 text-sm font-semibold text-gray-800 w-[45%]">Email Address</th>
//               <th className="py-4 px-6 text-sm font-semibold text-gray-800 w-[20%]">Status</th>
//             </tr>
//           </thead>

//           {/* Table Content Data Rows */}
//           <tbody className="bg-white">
//             {users.map((user) => (
//               <tr key={user.id} className="border-b border-gray-100  hover:bg-gray-50/50 transition-colors">
                
//                 {/* Column: Name with Profile Badge */}
//                 <td className="py-4 px-6">
//                   <div className="flex items-center gap-3">
//                     <div className="relative w-11 h-11 shrink-0">
//                       {user.avatarUrl ? (
//                         <div className="w-full h-full rounded-full overflow-hidden relative">
//                           <Image
//                             src={user.avatarUrl}
//                             alt={user.name}
//                             fill
//                             className="object-cover"
//                             unoptimized // Used here for external image prototyping convenience
//                           />
//                         </div>
//                       ) : (
//                         /* Initial fallback badge styling for Leslie Hensley */
//                         <div className="w-full h-full bg-[#e0e7ff] text-[#6366f1] rounded-full flex items-center justify-center font-bold text-sm tracking-wide">
//                           LH
//                         </div>
//                       )}
                      
//                       {/* Live Online/Offline Status Circular Badge */}
//                       <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         user.status === "Active" ? "bg-[#09BD3C]" : "bg-[#ef4444]"
//                       }`} />
//                     </div>
//                     <span className="font-medium text-gray-900 text-sm  leading-5">{user.name}</span>
//                   </div>
//                 </td>

//                 {/* Column: Email Address */}
//                 <td className="py-4 px-6 text-sm  text-gray-600 font-normal leading-5">
//                   {user.email}
//                 </td>

//                 {/* Column: Status Label Pill */}
//                 <td className="py-4 px-6">
//                   <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-medium  ${
//                     user.status === "Active" 
//                       ? "bg-[#e8fbf0] text-[#09BD3C]" 
//                       : "bg-[#fde8e8] text-[#dc2626]"
//                   }`}>
//                     {user.status}
//                   </span>
//                 </td>

//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>

//     </div>
//   );
// }