/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { LogOut, Search } from "lucide-react";
import LogoutModal from "../login/LogoutModal";

import { useRouter } from "next/navigation";
import { SettingsIcon } from "../icon/SettingsIcon";
import Link from "next/link";
import NotificationModal from "./NotificationModal";
import { useLogoutMutation } from "@/app/redux/api/authApi";
import { toast } from "react-toastify";
import { useGetUserProfileQuery } from "@/app/redux/features/personalInfo";
import { useGetNotificationsQuery } from "@/app/redux/features/notificationModalApi";
interface HeaderProps {
  onMenuToggle: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data } = useGetUserProfileQuery();
const { data: notificationData } = useGetNotificationsQuery();
  const user = (data as any)?.data; 
  const [logout] = useLogoutMutation();

  const searchItems = [
    {
      label: "Dashboard Overview",
      description: "Main dashboard content, sections, and statistics",
      path: "/dashboard",
      keywords: ["dashboard", "overview", "content", "title", "section", "button text", "settings name"],
    },
    {
      label: "User Management",
      description: "Manage users, statuses, inspections, and payments",
      path: "/dashboard/users",
      keywords: ["users", "user management", "manage users", "profile", "status", "payments", "inspections", "content"],
    },
    {
      label: "Inspector Management",
      description: "Inspectors, approval workflow, and inspector details",
      path: "/dashboard/inspectors",
      keywords: ["inspectors", "inspector", "inspection team", "approval", "pending review", "active", "rejected"],
    },
    {
      label: "Inspection Management",
      description: "Manage inspections, workflow board, and reports",
      path: "/dashboard/inspections",
      keywords: ["inspections", "inspection management", "workflow", "report", "board", "pending inspections", "completed inspections"],
    },
    {
      label: "Payments & Revenue",
      description: "Transaction history, invoices, and refunds",
      path: "/dashboard/payments",
      keywords: ["payments", "revenue", "transactions", "refund", "billing", "invoices"],
    },
    {
      label: "Reports Management",
      description: "View, download, and archive inspection reports",
      path: "/dashboard/reports",
      keywords: ["reports", "report", "archive", "download", "inspection reports"],
    },
    {
      label: "Reviews & Ratings",
      description: "Customer feedback and ratings overview",
      path: "/dashboard/reviews",
      keywords: ["reviews", "ratings", "feedback", "customer reviews"],
    },
    {
      label: "Notifications Center",
      description: "Alerts, messages, and notification settings",
      path: "/dashboard/notifications",
      keywords: ["notifications", "alerts", "messages", "notification"],
    },
    {
      label: "FAQ",
      description: "FAQ management",
      path: "/dashboard/faq",
      keywords: ["faq", "help", "faq management"],
    },
    {
      label: "Support",
      description: "User support requests",
      path: "/dashboard/support",
      keywords: ["support", "help", "support requests"],
    },
    {
      label: "Settings & Pricing",
      description: "Platform settings, pricing, and configuration",
      path: "/dashboard/settings",
      keywords: ["settings", "pricing", "platform settings", "configuration", "settings name", "section name"],
    },
  ];

  const filteredSearchItems = searchItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    return (
      item.label.toLowerCase().includes(query) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const handleLogout = async () => {
  try {
    await logout().unwrap();

   
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setOpenLogout(false);


    window.location.href = "/";
  } catch (error) {
    toast.error("Logout failed");
  }
};



const notifications = notificationData?.data || [];
const notificationCount = notificationData?.total || 0;
  return (
    <>
      <header className="h-20 -white flex items-center justify-between px-4 md:px-8 font-sans w-full sticky top-0 z-30">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg bg-slate-50 text-slate-600 md:hidden hover:bg-slate-100 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div ref={searchRef} className="relative w-full max-w-5xl hidden lg:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search />
            </span>

            <input
              type="text"
             placeholder="Search menu, pages or features..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowSearchSuggestions(true);
              }}
              onFocus={() => setShowSearchSuggestions(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (filteredSearchItems.length > 0) {
                    router.push(filteredSearchItems[0].path);
                    setShowSearchSuggestions(false);
                  }
                }
              }}
              className="w-full bg-[#F8FAFC] border border-slate-100 rounded-full py-3.5 pl-10 pr-4 text-lg md:text-xl text-slate-600 placeholder-slate-400 focus:outline-none focus:border-indigo-200 focus:bg-white transition-all"
            />

            {showSearchSuggestions && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-200 bg-white text-gray-800 shadow-lg z-40">
                {filteredSearchItems.length > 0 ? (
                  filteredSearchItems.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.label);
                        setShowSearchSuggestions(false);
                        router.push(item.path);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="font-semibold">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-slate-500 mt-1">
                          {item.description}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No matching results.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 md:space-x-5">
              {/* Notification Alert Icon */}
         <button onClick={() => setShowNotificationModal(true)}
          className="relative  flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M23.3333 19.8333H23.1187C23.2568 19.4597 23.3295 19.065 23.3333 18.6666V12.8333C23.3294 10.7663 22.6402 8.75902 21.3735 7.12565C20.1068 5.49228 18.3343 4.32508 16.3333 3.80679V3.49996C16.3333 2.88112 16.0875 2.28763 15.6499 1.85004C15.2123 1.41246 14.6188 1.16663 14 1.16663C13.3812 1.16663 12.7877 1.41246 12.3501 1.85004C11.9125 2.28763 11.6667 2.88112 11.6667 3.49996V3.80679C9.66574 4.32508 7.89317 5.49228 6.6265 7.12565C5.35983 8.75902 4.67058 10.7663 4.66667 12.8333V18.6666C4.67053 19.065 4.74316 19.4597 4.88133 19.8333H4.66667C4.35725 19.8333 4.0605 19.9562 3.84171 20.175C3.62292 20.3938 3.5 20.6905 3.5 21C3.5 21.3094 3.62292 21.6061 3.84171 21.8249C4.0605 22.0437 4.35725 22.1666 4.66667 22.1666H23.3333C23.6428 22.1666 23.9395 22.0437 24.1583 21.8249C24.3771 21.6061 24.5 21.3094 24.5 21C24.5 20.6905 24.3771 20.3938 24.1583 20.175C23.9395 19.9562 23.6428 19.8333 23.3333 19.8333Z" fill="#5C6470"/>
   <path d="M9.98242 24.5C10.3868 25.2088 10.9715 25.7981 11.6771 26.2079C12.3828 26.6178 13.1844 26.8337 14.0004 26.8337C14.8165 26.8337 15.618 26.6178 16.3237 26.2079C17.0294 25.7981 17.614 25.2088 18.0184 24.5H9.98242Z" fill="#5C6470"/>
 </svg>
           <span className="absolute -top-2 -right-2 bg-primaryColor text-white font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">           {notificationCount}
          </span>
        </button>

          <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />

          {/* Profile Dropdown */}
          <div
            ref={dropdownRef}
            className="relative flex items-center space-x-3"
          >
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="relative w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100 flex-shrink-0">
                <img  src={user?.profile?.profile_img || "/placeholder.svg"} alt="" />
                
              </div>

              <div className="hidden lg:block text-left leading-tight">
                <h4 className="text-base font-semibold text-[#000000] group-hover:text-indigo-600 transition-colors">
                    {user?.first_name} {user?.last_name}
                </h4>

                <span className="text-xs font-bold text-[#8F8F8F]">
                  {user?.user_types || "Super Admin"}
                </span>
              </div>

              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#D3D6E4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            {showDropdown && (
              <div className="absolute right-0 top-14 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <Link href="/dashboard/settings">
                <button
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-base text-gray-900 cursor-pointer hover:bg-gray-50"
                >
                  <SettingsIcon/>
                  Settings
                </button> 
               </Link>
                <button
                  onClick={() => setOpenLogout(true)}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-500 cursor-pointer hover:bg-red-50"
                >
                  <LogOut size={16}/>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
<NotificationModal
   isOpen={showNotificationModal}
  onClose={() => setShowNotificationModal(false)}
  notifications={notifications}
/>
<LogoutModal
  isOpen={openLogout}
  onCancel={() => setOpenLogout(false)}
  onConfirm={handleLogout}
/>
    </>
  );
};

export default DashboardHeader;

