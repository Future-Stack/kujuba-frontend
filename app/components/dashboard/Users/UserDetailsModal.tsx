"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useSuspendUserMutation, useUnsuspendUserMutation } from "@/app/redux/features/usersApi";
import { toast } from "react-toastify";

export interface UserCard {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  user_type: string;
  image?: string | null;
  total_inspections: number;
  cancelled_inspections?: number;
  status: "active" | "suspended";
  created_at: string;
}

interface UserDetailsModalProps {
  user: UserCard;
  onClose: () => void;
}

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const [suspendUser, { isLoading: suspending }] = useSuspendUserMutation();
  const [unsuspendUser, { isLoading: unsuspending }] = useUnsuspendUserMutation();

  const isSuspended = user.status === "suspended";
  const isLoading = suspending || unsuspending;

  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joiningDate = new Date(user.created_at).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const handleToggleSuspend = async () => {
  try {
    if (isSuspended) {
      await unsuspendUser(user.id).unwrap();

      toast.success("User Active successfully");
    } else {
      await suspendUser(user.id).unwrap();

      toast.success("User suspended successfully");
    }

    onClose();
  } catch (err) {
    console.error("Failed to update user status:", err);

    toast.error("Failed to update user status");
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Avatar + name */}
        <div className="flex flex-col bg-[#F5F6FA] rounded-sm p-3 mt-3 items-center mb-5">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3">
            {user.image ? (
              <Image
                src={user.image}
                alt={fullName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm border-2 border-purple-100">
                {initials}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                isSuspended ? "bg-red-400" : "bg-[#09BD3C]"
              }`}
            />
          </div>
          <h3 className="font-normal text-gray-900 text-sm font-roboto mb-1 leading-5">
            {fullName}
          </h3>
          <p className="text-gray-600 font-normal text-sm font-roboto leading-5 capitalize">
            {user.user_type}
          </p>
        </div>

        {/* Info rows */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-900 font-roboto leading-5 text-sm font-normal">Status</span>
            <span className={`font-roboto leading-5 text-sm font-normal capitalize ${isSuspended ? "text-red-500" : "text-[#65A30D]"}`}>
              {user.status}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-900 font-roboto leading-5 text-sm font-normal">Joining Date</span>
            <span className="text-gray-600 font-roboto leading-5 text-sm font-normal">{joiningDate}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-900 font-roboto leading-5 text-sm font-normal">Total Inspection</span>
            <span className="text-gray-600 font-roboto leading-5 text-sm font-normal">
              {String(user.total_inspections).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-900 font-roboto leading-5 text-sm font-normal">Total Canceled Inspection</span>
            <span className="text-gray-600 font-roboto leading-5 text-sm font-normal">
              {String(user.cancelled_inspections ?? 0).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Contact */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-gray-600 font-roboto leading-5 text-sm font-normal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4.66671C2 4.31309 2.14048 3.97395 2.39052 3.7239C2.64057 3.47385 2.97971 3.33337 3.33333 3.33337H12.6667C13.0203 3.33337 13.3594 3.47385 13.6095 3.7239C13.8595 3.97395 14 4.31309 14 4.66671M2 4.66671V11.3334C2 11.687 2.14048 12.0261 2.39052 12.2762C2.64057 12.5262 2.97971 12.6667 3.33333 12.6667H12.6667C13.0203 12.6667 13.3594 12.5262 13.6095 12.2762C13.8595 12.0261 14 11.687 14 11.3334V4.66671M2 4.66671L8 8.66671L14 4.66671" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 font-roboto leading-5 text-sm font-normal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33333 2.66667H8.66667M8 11.3333V11.34M4 3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H5.33333C4.97971 14 4.64057 13.8595 4.39052 13.6095C4.14048 13.3594 4 13.0203 4 12.6667V3.33333Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{user.phone || "N/A"}</span>
          </div>
        </div>

        {/* Suspend / Unsuspend */}
        <button
          onClick={handleToggleSuspend}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-sm text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 ${
            isSuspended
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isLoading ? (
            <span>Processing...</span>
          ) : isSuspended ? (
            <>✓ Unsuspend</>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.00195 9.76599L9.99819 6.23406" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.23438 6.00183L9.76631 9.99807" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Suspend
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserDetailsModal;