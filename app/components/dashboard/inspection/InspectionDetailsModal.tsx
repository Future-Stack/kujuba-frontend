"use client";

import React from "react";
import {
  X,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Home,
 
  Tag,
  ShieldCheck,
  Briefcase,
  FileText,
  Award,
  Navigation,
  UserCheck,
  UserCog,
  Download,
  CheckCircle,
  DollarSign,
  AlertOctagon,
} from "lucide-react";

interface Inspector {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  status: string;
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

interface Props {
  card: CardItem;
  columnTitle: string;
  onClose: () => void;
}

// Mock detail data — replace with real API data as needed
const getMockDetails = (card: CardItem) => ({
  orderNo: `#FP-${Math.floor(2000 + Math.random() * 1000)}`,
  date: "May 28, 2026",
  time: "10:30 AM",
  homeowner: {
    name: "Sarah Johnson",
    role: "Property Owner",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "1847 Maple Street, Orlando, FL 32801",
    propertyType: "Single Family Home",
    propertySize: "2,400 sq ft",
  },
  inspector: card.assignedInspector
    ? {
        name: card.assignedInspector.name,
        avatar: card.assignedInspector.avatar,
        avatarColor: card.assignedInspector.avatarColor,
        verified: true,
        specialty: "Four Point & Wind Mitigation",
        experience: "12 years",
        license: "FL-HI-12345",
        serviceRadius: "50 miles",
        assignedOn: "May 25, 2026",
      }
    : null,
  inspectionDetails: {
    type: card.type,
    notes: "Standard inspection covering roof, electrical, HVAC, and plumbing systems. Customer requested special attention to the roof condition following recent storms.",
  },
});

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 py-1.5">
    <div className="w-4 h-4 shrink-0 mt-0.5">
      {icon}
    </div>

    <div className="flex flex-col">
      <span className="text-xs text-[#6A7282]">{label}</span>
      <span className="text-sm text-[#101828] font-medium">{value}</span>
    </div>
  </div>
);

const InspectionDetailsModal: React.FC<Props> = ({ card, columnTitle, onClose }) => {
  const details = getMockDetails(card);

  const isCompleted = card.status === "Completed";
  const isCanceled = card.status === "Canceled";

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl   w-full max-w-5xl max-h-[90vh] overflow-y-auto">

        {/* ── TOP HEADER ── */}
        <div className=" px-8 py-6 pb-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg md:text-xl font-sora leading-7 font-semibold text-gray-900">{details.orderNo}</span>

              {/* Status badge */}
              {isCompleted && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#008236] border border-[#B9F8CF]">
                  Completed
                </span>
              )}
              {isCanceled && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">
                  Canceled
                </span>
              )}
              {!isCompleted && !isCanceled && card.status === "Inspector Assigned" && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  Inspector Assigned
                </span>
              )}
              {!isCompleted && !isCanceled && card.status === "Select Inspector" && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  Pending
                </span>
              )}

              {/* Urgent badge */}
              {card.urgent && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#CA3500] border border-[#FFD6A8] flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3" />
                  Urgent
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold font-sora leading-8 text-gray-900 mb-2">{card.type}</h2>

          <div className="flex items-center gap-4 text-sm text-[#4A5565] font-normal leading-5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {details.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {details.time}
            </span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="px-6 py-6 space-y-5">

          {/* Info Grid: Homeowner + Inspector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Homeowner Information */}
            <div className="border border-[#F3F4F6] rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M15.8327 17.5V15.8333C15.8327 14.9493 15.4815 14.1014 14.8564 13.4763C14.2312 12.8512 13.3834 12.5 12.4993 12.5H7.49935C6.61529 12.5 5.76745 12.8512 5.14233 13.4763C4.5172 14.1014 4.16602 14.9493 4.16602 15.8333V17.5" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M9.99935 9.16667C11.8403 9.16667 13.3327 7.67428 13.3327 5.83333C13.3327 3.99238 11.8403 2.5 9.99935 2.5C8.1584 2.5 6.66602 3.99238 6.66602 5.83333C6.66602 7.67428 8.1584 9.16667 9.99935 9.16667Z" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
               
                <span className="text-base md:text-lg leading-7 font-semibold text-[#101828]">Homeowner Information</span>
              </div>

              {/* Avatar row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                  SJ
                </div>
                <div>
                  <p className="text-base font-semibold font-sora leaiding-7 text-gray-900">{details.homeowner.name}</p>
                  <p className="text-sm text-[#4A5565] font-roboto font-normal leading-5">{details.homeowner.role}</p>
                </div>
              </div>

              <div className="space-y-0.5">
                <InfoRow icon={<Mail className="w-4 h-4 text-gray-400" />} label="Email" value={details.homeowner.email} />
                <InfoRow icon={<Phone className="w-4 h-4 text-gray-400" />} label="Phone" value={details.homeowner.phone} />
                <InfoRow icon={<MapPin className="w-4 h-4 text-gray-400" />} label="Address" value={details.homeowner.address} />
                <InfoRow icon={<Home className="w-4 h-4 text-gray-400" />} label="Property Type" value={details.homeowner.propertyType} />
                <InfoRow icon= {<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_1674_2903)">
    <path d="M14.1999 10.1999C14.349 10.3485 14.4674 10.5251 14.5481 10.7196C14.6289 10.9141 14.6705 11.1226 14.6705 11.3332C14.6705 11.5438 14.6289 11.7523 14.5481 11.9468C14.4674 12.1413 14.349 12.3179 14.1999 12.4665L12.4665 14.1999C12.3179 14.349 12.1413 14.4674 11.9468 14.5481C11.7523 14.6289 11.5438 14.6705 11.3332 14.6705C11.1226 14.6705 10.9141 14.6289 10.7196 14.5481C10.5251 14.4674 10.3485 14.349 10.1999 14.1999L1.79987 5.79987C1.50024 5.49879 1.33203 5.0913 1.33203 4.66653C1.33203 4.24177 1.50024 3.83428 1.79987 3.5332L3.5332 1.79987C3.83428 1.50024 4.24177 1.33203 4.66653 1.33203C5.0913 1.33203 5.49879 1.50024 5.79987 1.79987L14.1999 10.1999Z" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.66602 8.33333L10.9993 7" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.66602 6.33333L8.99935 5" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.66602 4.33333L6.99935 3" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.666 10.3333L12.9993 9" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_1674_2903">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg> } label="Property Size" value={details.homeowner.propertySize} />
              </div>
            </div>

            {/* Inspector Information */}
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
              
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
               
                <span className="text-base md:text-lg leading-7 font-semibold text-[#101828]">Inspector Information</span>
              </div>

              {details.inspector ? (
                <>
                  {/* Avatar row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${details.inspector.avatarColor}`}>
                      {details.inspector.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-base font-semibold font-sora leaiding-7 text-gray-900">{details.inspector.name}</p>
                        {details.inspector.verified && (
                          <span className="flex items-center gap-0.5 text-xs font-semibold leading-4 text-[#008236] bg-[#F0FDF4] border border-[#B9F8CF] px-1.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#4A5565] font-roboto font-normal leading-5">{details.inspector.specialty}</p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <InfoRow icon={<Award className="w-4 h-4 text-gray-400" />} label="Experience" value={details.inspector.experience} />
                    <InfoRow icon= {<svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15" fill="none">
  <path d="M11.3327 8.00038C11.3327 11.3337 8.99935 13.0004 6.22602 13.967C6.08079 14.0163 5.92304 14.0139 5.77935 13.9604C2.99935 13.0004 0.666016 11.3337 0.666016 8.00038V3.33371C0.666016 3.1569 0.736254 2.98733 0.861278 2.86231C0.986302 2.73729 1.15587 2.66705 1.33268 2.66705C2.66602 2.66705 4.33268 1.86705 5.49268 0.853714C5.63392 0.733047 5.81358 0.666748 5.99935 0.666748C6.18511 0.666748 6.36478 0.733047 6.50602 0.853714C7.67268 1.87371 9.33268 2.66705 10.666 2.66705C10.8428 2.66705 11.0124 2.73729 11.1374 2.86231C11.2624 2.98733 11.3327 3.1569 11.3327 3.33371V8.00038Z" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>} label="License" value={details.inspector.license} />
                    <InfoRow icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_1715_2816)">
    <path d="M8.40467 11.1966C9.42067 10.2859 12 7.74192 12 5.33325C12 4.27239 11.5786 3.25497 10.8284 2.50482C10.0783 1.75468 9.06087 1.33325 8 1.33325C6.93913 1.33325 5.92172 1.75468 5.17157 2.50482C4.42143 3.25497 4 4.27239 4 5.33325C4 7.74192 6.58 10.2859 7.59533 11.1966C7.71156 11.2854 7.85375 11.3335 8 11.3335C8.14625 11.3335 8.28844 11.2854 8.40467 11.1966Z" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.99935 6.66667C8.73573 6.66667 9.33268 6.06971 9.33268 5.33333C9.33268 4.59695 8.73573 4 7.99935 4C7.26297 4 6.66602 4.59695 6.66602 5.33333C6.66602 6.06971 7.26297 6.66667 7.99935 6.66667Z" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.8097 9.33325H3.33637C3.19659 9.33331 3.06036 9.37731 2.94695 9.45901C2.83354 9.54072 2.74868 9.65601 2.70437 9.78859L1.36837 13.7886C1.33487 13.8888 1.32568 13.9955 1.34154 14.1C1.3574 14.2044 1.39786 14.3036 1.45958 14.3894C1.52131 14.4751 1.60253 14.545 1.69655 14.5932C1.79058 14.6414 1.89471 14.6665 2.00037 14.6666H14.0004C14.1059 14.6665 14.21 14.6414 14.304 14.5932C14.3979 14.545 14.4791 14.4753 14.5408 14.3896C14.6025 14.3039 14.643 14.2048 14.6589 14.1005C14.6748 13.9961 14.6657 13.8894 14.6324 13.7893L13.299 9.78925C13.2548 9.65645 13.1699 9.54094 13.0563 9.45909C12.9428 9.37724 12.8063 9.33322 12.6664 9.33325H10.1917" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_1715_2816">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>} label="Service Radius" value={details.inspector.serviceRadius} />
                    <InfoRow icon={<UserCheck className="w-4 h-4 text-gray-400" />} label="Assigned On" value={details.inspector.assignedOn} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <UserCog className="w-8 h-8 text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No inspector assigned yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Inspection Details */}
          <div className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Inspection Details</span>
            </div>
            <div className="space-y-0.5">
              <InfoRow icon={<Tag className="w-4 h-4 text-gray-400" />} label="Type" value={details.inspectionDetails.type} />
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-600 leading-relaxed">{details.inspectionDetails.notes}</p>
            </div>
          </div>

          {/* Status Steps */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "User Payment", value: card.payment },
              { label: "Inspection Report", value: card.report },
              { label: "Ins. Payment", value: card.insPay },
            ].map((step) => (
              <div key={step.label} className="text-center">
                <p className={`text-xs mb-1 ${step.value === "line" ? "text-gray-300" : "text-gray-500 font-medium"}`}>
                  {step.label}
                </p>
                <p className="text-sm font-bold text-gray-800 min-h-[20px]">
                  {step.value === "line" ? "" : step.value}
                </p>
                <div className={`h-[2px] mt-1.5 rounded-full ${step.value === "line" ? "bg-gray-150 bg-gray-200" : "bg-[#A3E635]"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTION FOOTER ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 bg-[#4353FF] hover:bg-[#3444ee] text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer">
            <UserCog className="w-3.5 h-3.5" />
            Assign/Reassign Inspector
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Download Report
          </button>
          <button className="flex items-center gap-1.5 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer">
            <CheckCircle className="w-3.5 h-3.5" />
            Mark as Completed
          </button>
          <button className="flex items-center gap-1.5 border border-orange-200 text-orange-600 text-xs font-semibold px-3.5 py-2.5 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
            <DollarSign className="w-3.5 h-3.5" />
            Refund Payment
          </button>
          <button className="flex items-center gap-1.5 border border-red-200 text-red-500 text-xs font-semibold px-3.5 py-2.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
            <AlertOctagon className="w-3.5 h-3.5" />
            Suspend Inspector
          </button>

          <button
            onClick={onClose}
            className="ml-auto flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold px-3.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default InspectionDetailsModal;