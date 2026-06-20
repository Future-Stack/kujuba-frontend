"use client";

import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";
import React from "react";


// Strict type schema for activities
interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  glowColor: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    title: "Inspector Approved",
    description: "Jonathan King's verification documents have been approved.",
    timestamp: "10 Mins Ago",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M9.99967 2V4.66667C9.99967 4.84348 10.0699 5.01305 10.1949 5.13807C10.32 5.2631 10.4895 5.33333 10.6663 5.33333H13.333M13.333 5.33333L9.99967 2H7.33301C6.97939 2 6.64025 2.14048 6.3902 2.39052C6.14015 2.64057 5.99967 2.97971 5.99967 3.33333V10C5.99967 10.3536 6.14015 10.6928 6.3902 10.9428C6.64025 11.1929 6.97939 11.3333 7.33301 11.3333H11.9997C12.3533 11.3333 12.6924 11.1929 12.9425 10.9428C13.1925 10.6928 13.333 10.3536 13.333 10V5.33333ZM10.6663 11.3333V12.6667C10.6663 13.0203 10.5259 13.3594 10.2758 13.6095C10.0258 13.8595 9.68663 14 9.33301 14H4.66634C4.31272 14 3.97358 13.8595 3.72353 13.6095C3.47348 13.3594 3.33301 13.0203 3.33301 12.6667V6C3.33301 5.64638 3.47348 5.30724 3.72353 5.05719C3.97358 4.80714 4.31272 4.66667 4.66634 4.66667H5.99967" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>,
    iconBg: "bg-[#2563eb]",
    iconColor: "text-white",
    glowColor: "shadow-blue-100 bg-blue-50",
  },
  {
    id: "2",
    title: "Inspection Completed",
    description: "Four Point Inspection completed successfully by Peter Brooks.",
    timestamp: "20 Mins Ago",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M6.33366 2H9.66699C9.93221 2 10.1866 2.10536 10.3741 2.29289C10.5616 2.48043 10.667 2.73478 10.667 3C10.667 3.61884 10.4212 4.21233 9.98357 4.64992C9.54599 5.0875 8.9525 5.33333 8.33366 5.33333H7.66699C7.04815 5.33333 6.45466 5.0875 6.01708 4.64992C5.57949 4.21233 5.33366 3.61884 5.33366 3C5.33366 2.73478 5.43902 2.48043 5.62655 2.29289C5.81409 2.10536 6.06844 2 6.33366 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M2.66699 11.3333V10.6667C2.66699 9.25218 3.2289 7.89562 4.22909 6.89543C5.22928 5.89524 6.58584 5.33333 8.00033 5.33333C9.41481 5.33333 10.7714 5.89524 11.7716 6.89543C12.7718 7.89562 13.3337 9.25218 13.3337 10.6667V11.3333C13.3337 12.0406 13.0527 12.7189 12.5526 13.219C12.0525 13.719 11.3742 14 10.667 14H5.33366C4.62641 14 3.94814 13.719 3.44804 13.219C2.94794 12.7189 2.66699 12.0406 2.66699 11.3333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>,
    iconBg: "bg-[#f97316]",
    iconColor: "text-white",
    glowColor: "shadow-orange-100 bg-orange-50",
  },
  {
    id: "3",
    title: "New Booking Received",
    description: "A new Roof Inspection booking has been submitted.",
    timestamp: "25 Mins Ago",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M10 11.0481V12.6614C9.99965 13.0165 9.8584 13.3568 9.60729 13.6078C9.35617 13.8588 9.01571 13.9999 8.66067 14.0001H3.34C2.98473 14.0001 2.64399 13.859 2.39271 13.6078C2.14143 13.3567 2.00018 13.016 2 12.6607V7.34008C2 6.98481 2.14109 6.64407 2.39224 6.39279C2.6434 6.14151 2.98406 6.00026 3.33933 6.00008H5.30867M6.11133 3.0074C6.20492 2.65955 6.43269 2.36303 6.74465 2.18293C7.05662 2.00282 7.42729 1.95384 7.77533 2.04673L12.9927 3.44473C13.3405 3.53832 13.637 3.76609 13.8171 4.07805C13.9972 4.39002 14.0462 4.76069 13.9533 5.10873L12.5553 10.3261C12.4617 10.6739 12.234 10.9704 11.922 11.1505C11.61 11.3306 11.2394 11.3796 10.8913 11.2867L5.67333 9.88873C5.32548 9.79514 5.02897 9.56737 4.84886 9.25541C4.66876 8.94344 4.61978 8.57277 4.71267 8.22473L6.11133 3.0074Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>,
    iconBg: "bg-[#09BD3C]",
    iconColor: "text-white",
    glowColor: "shadow-emerald-100 bg-emerald-50",
  },
  {
    id: "4",
    title: "Inspection Rescheduled",
    description: "Homeowner rescheduled a Wind Mitigation inspection request.",
    timestamp: "30 Mins Ago",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8 4.66667V8L10 10M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>,
    iconBg: "bg-[#a855f7]",
    iconColor: "text-white",
    glowColor: "shadow-purple-100 bg-purple-50",
  },
  {
    id: "5",
    title: "Cancellation Request",
    description: "A homeowner requested cancellation for a Combined Inspection.",
    timestamp: "40 Mins Ago",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clipPath="url(#clip0_618_5169)">
    <path d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55228C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55228C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667ZM12.28 10.4067C12.41 10.2766 12.5644 10.1735 12.7342 10.1032C12.9041 10.0328 13.0861 9.99658 13.27 9.99658C13.4539 9.99658 13.6359 10.0328 13.8058 10.1032C13.9756 10.1735 14.13 10.2766 14.26 10.4067C14.39 10.5367 14.4931 10.691 14.5635 10.8609C14.6339 11.0307 14.6701 11.2128 14.6701 11.3967C14.6701 11.5805 14.6339 11.7626 14.5635 11.9324C14.4931 12.1023 14.39 12.2566 14.26 12.3867L12 14.6667H10V12.6667L12.28 10.4067Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_618_5169">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>,
    iconBg: "bg-[#e11d48]",
    iconColor: "text-white",
    glowColor: "shadow-rose-100 bg-rose-50",
  },
];

function RecentActivitySkeleton() {
  return (
    <div className="w-full bg-white rounded-[20px] border p-5 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 rounded mb-6" />

      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 mb-6">
          <div className="w-11 h-11 rounded-full bg-gray-200" />

          <div className="flex-1">
            <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-full bg-gray-200 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
export default function RecentActivity() {

  const { data, isLoading, isError } = useGetOverviewQuery();

if (isLoading) {
  return <RecentActivitySkeleton />;
}

if (isError || !data?.success) {
  return (
    <div className="w-full bg-white rounded-[20px] border p-4 text-center text-red-500">
      Failed to load activities
    </div>
  );
}

const activities = data.data.recent_activity || [];

const activityStyles = [
  {
    icon:  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M9.99967 2V4.66667C9.99967 4.84348 10.0699 5.01305 10.1949 5.13807C10.32 5.2631 10.4895 5.33333 10.6663 5.33333H13.333M13.333 5.33333L9.99967 2H7.33301C6.97939 2 6.64025 2.14048 6.3902 2.39052C6.14015 2.64057 5.99967 2.97971 5.99967 3.33333V10C5.99967 10.3536 6.14015 10.6928 6.3902 10.9428C6.64025 11.1929 6.97939 11.3333 7.33301 11.3333H11.9997C12.3533 11.3333 12.6924 11.1929 12.9425 10.9428C13.1925 10.6928 13.333 10.3536 13.333 10V5.33333ZM10.6663 11.3333V12.6667C10.6663 13.0203 10.5259 13.3594 10.2758 13.6095C10.0258 13.8595 9.68663 14 9.33301 14H4.66634C4.31272 14 3.97358 13.8595 3.72353 13.6095C3.47348 13.3594 3.33301 13.0203 3.33301 12.6667V6C3.33301 5.64638 3.47348 5.30724 3.72353 5.05719C3.97358 4.80714 4.31272 4.66667 4.66634 4.66667H5.99967" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>,
    iconBg: "bg-[#2563eb]",
    glowColor: "shadow-blue-100 bg-blue-50",
  },
  {
    icon:<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M6.33366 2H9.66699C9.93221 2 10.1866 2.10536 10.3741 2.29289C10.5616 2.48043 10.667 2.73478 10.667 3C10.667 3.61884 10.4212 4.21233 9.98357 4.64992C9.54599 5.0875 8.9525 5.33333 8.33366 5.33333H7.66699C7.04815 5.33333 6.45466 5.0875 6.01708 4.64992C5.57949 4.21233 5.33366 3.61884 5.33366 3C5.33366 2.73478 5.43902 2.48043 5.62655 2.29289C5.81409 2.10536 6.06844 2 6.33366 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M2.66699 11.3333V10.6667C2.66699 9.25218 3.2289 7.89562 4.22909 6.89543C5.22928 5.89524 6.58584 5.33333 8.00033 5.33333C9.41481 5.33333 10.7714 5.89524 11.7716 6.89543C12.7718 7.89562 13.3337 9.25218 13.3337 10.6667V11.3333C13.3337 12.0406 13.0527 12.7189 12.5526 13.219C12.0525 13.719 11.3742 14 10.667 14H5.33366C4.62641 14 3.94814 13.719 3.44804 13.219C2.94794 12.7189 2.66699 12.0406 2.66699 11.3333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>,
    iconBg: "bg-[#f97316]",
    glowColor: "shadow-orange-100 bg-orange-50",
  },
  {
    icon:  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M10 11.0481V12.6614C9.99965 13.0165 9.8584 13.3568 9.60729 13.6078C9.35617 13.8588 9.01571 13.9999 8.66067 14.0001H3.34C2.98473 14.0001 2.64399 13.859 2.39271 13.6078C2.14143 13.3567 2.00018 13.016 2 12.6607V7.34008C2 6.98481 2.14109 6.64407 2.39224 6.39279C2.6434 6.14151 2.98406 6.00026 3.33933 6.00008H5.30867M6.11133 3.0074C6.20492 2.65955 6.43269 2.36303 6.74465 2.18293C7.05662 2.00282 7.42729 1.95384 7.77533 2.04673L12.9927 3.44473C13.3405 3.53832 13.637 3.76609 13.8171 4.07805C13.9972 4.39002 14.0462 4.76069 13.9533 5.10873L12.5553 10.3261C12.4617 10.6739 12.234 10.9704 11.922 11.1505C11.61 11.3306 11.2394 11.3796 10.8913 11.2867L5.67333 9.88873C5.32548 9.79514 5.02897 9.56737 4.84886 9.25541C4.66876 8.94344 4.61978 8.57277 4.71267 8.22473L6.11133 3.0074Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>,
    iconBg: "bg-[#09BD3C]",
    glowColor: "shadow-emerald-100 bg-emerald-50",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8 4.66667V8L10 10M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>,
    iconBg: "bg-[#a855f7]",
    glowColor: "shadow-purple-100 bg-purple-50",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clipPath="url(#clip0_618_5169)">
    <path d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55228C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55228C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667ZM12.28 10.4067C12.41 10.2766 12.5644 10.1735 12.7342 10.1032C12.9041 10.0328 13.0861 9.99658 13.27 9.99658C13.4539 9.99658 13.6359 10.0328 13.8058 10.1032C13.9756 10.1735 14.13 10.2766 14.26 10.4067C14.39 10.5367 14.4931 10.691 14.5635 10.8609C14.6339 11.0307 14.6701 11.2128 14.6701 11.3967C14.6701 11.5805 14.6339 11.7626 14.5635 11.9324C14.4931 12.1023 14.39 12.2566 14.26 12.3867L12 14.6667H10V12.6667L12.28 10.4067Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_618_5169">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>,
    iconBg: "bg-[#e11d48]",
    glowColor: "shadow-rose-100 bg-rose-50",
  },
];
  return (
    <div className="w-full  bg-white rounded-[20px] border border-gray-200 hover:shadow-sm font-roboto select-none">
      
      {/* Card Header */}
      <h3 className="text-base md:text-lg font-bold text-gray-900  px-5 py-4 leading-5.5  border-b border-gray-100 pb-4">Recent Activity</h3>

      {/* Timeline List Container */}
      <div className="relative pl-1 px-5 md:px-6 py-4">
        
        {/* Continuous Dashed Connecting Line */}
        <div className="absolute left-[22px] top-6 bottom-6 w-[1.5px] font-roboto border-l-2 border-dashed border-gray-100 z-0" />

     <div className="space-y-6 relative z-10">
  {activities.map((item, index) => {
    const iconStyle = activityStyles[index % activityStyles.length];

    return (
      <div key={index} className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-lg ${iconStyle.glowColor}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${iconStyle.iconBg} text-white`}
          >
            <div className="w-4 h-4">{iconStyle.icon}</div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-medium text-gray-900 text-sm leading-5 flex-1 break-words">
              {item.title}
            </h4>

            <span className="text-xs md:text-sm text-gray-600 shrink-0 whitespace-nowrap">
              {item.time || "N/A"}
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-600 mt-1 leading-4 break-words">
            {item.description}
          </p>
        </div>
      </div>
    );
  })}
</div>
      </div>

    </div>
  );
}