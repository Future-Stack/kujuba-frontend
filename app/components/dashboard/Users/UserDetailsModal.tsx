import Image from "next/image";
import { X, Calendar, ClipboardList, XCircle, Mail } from "lucide-react";
import { useState } from "react";

export interface UserCard {
  id: string;
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  inspectionsCount: number;
  cancelledInspections?: number;
  avatarUrl?: string;
  createdAt: number;
  status?: "Active" | "Suspended";
  joiningDate?: string;
}

interface UserDetailsModalProps {
  user: UserCard;
  onClose: () => void;
}

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const [suspended, setSuspended] = useState(user.status === "Suspended");

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative w-16 h-16 mb-3">
            {user.avatarUrl ? (
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-100">
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-full bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm border-2 border-purple-100">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#09BD3C] border-2 border-white" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base leading-6">{user.name}</h3>
          <p className="text-gray-500 text-sm">{user.role}</p>
        </div>

        {/* Info rows */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-normal">Status</span>
            <span className={`font-medium ${suspended ? "text-red-500" : "text-green-500"}`}>
              {suspended ? "Suspended" : "Active"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-normal flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              Joining Date
            </span>
            <span className="text-gray-800 font-medium">{user.joiningDate ?? "—"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-normal flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-gray-400" />
              Total Inspection
            </span>
            <span className="text-gray-800 font-medium">
              {String(user.inspectionsCount).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-normal flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-gray-400" />
              Total Canceled Inspection
            </span>
            <span className="text-gray-800 font-medium">
              {String(user.cancelledInspections ?? 0).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Contact */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33333 2.66667H8.66667M8 11.3333V11.34M4 3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H5.33333C4.97971 14 4.64057 13.8595 4.39052 13.6095C4.14048 13.3594 4 13.0203 4 12.6667V3.33333Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{user.phone}</span>
          </div>
        </div>

        {/* Suspend / Unsuspend button */}
        <button
          onClick={() => setSuspended((s) => !s)}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            suspended
              ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
              : "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
          }`}
        >
          {suspended ? (
            <>✓ Unsuspend</>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
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