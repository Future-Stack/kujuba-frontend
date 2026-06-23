"use client";



import FAQManagement from "@/app/components/dashboard/support/FAQManagment";
import SupportRequests from "@/app/components/dashboard/support/SupportRequiest";

import { useState } from "react";


type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
};
 

export default function Support() {
   const [activeTab, setActiveTab] = useState<string>("faq-management");

   const tabs: Tab[] = [
  {
    id: "faq-management",
    label: "FAQ Management",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  <path d="M13.19 6H6.79C6.53 6 6.28 6.01 6.04 6.04C3.35 6.27 2 7.86 2 10.79V14.79C2 18.79 3.6 19.58 6.79 19.58H7.19C7.41 19.58 7.7 19.73 7.83 19.9L9.03 21.5C9.56 22.21 10.42 22.21 10.95 21.5L12.15 19.9C12.3 19.7 12.54 19.58 12.79 19.58H13.19C16.12 19.58 17.71 18.24 17.94 15.54C17.97 15.3 17.98 15.05 17.98 14.79V10.79C17.98 7.6 16.38 6 13.19 6ZM6.5 14C5.94 14 5.5 13.55 5.5 13C5.5 12.45 5.95 12 6.5 12C7.05 12 7.5 12.45 7.5 13C7.5 13.55 7.05 14 6.5 14ZM9.99 14C9.43 14 8.99 13.55 8.99 13C8.99 12.45 9.44 12 9.99 12C10.54 12 10.99 12.45 10.99 13C10.99 13.55 10.55 14 9.99 14ZM13.49 14C12.93 14 12.49 13.55 12.49 13C12.49 12.45 12.94 12 13.49 12C14.04 12 14.49 12.45 14.49 13C14.49 13.55 14.04 14 13.49 14Z" fill="currentColor"/>
  <path d="M21.9802 6.79V10.79C21.9802 12.79 21.3602 14.15 20.1202 14.9C19.8202 15.08 19.4702 14.84 19.4702 14.49L19.4802 10.79C19.4802 6.79 17.1902 4.5 13.1902 4.5L7.10025 4.51C6.75025 4.51 6.51025 4.16 6.69025 3.86C7.44025 2.62 8.80025 2 10.7902 2H17.1902C20.3802 2 21.9802 3.6 21.9802 6.79Z" fill="currentColor"/>
</svg>,
  },
  {
    id: "support-requests",
    label: "Support Requests",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  <g clipPath="url(#clip0_1718_2242)">
    <path d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10V11.9C3.69833 12.1628 3.4539 12.4849 3.28188 12.8461C3.10986 13.2074 3.01391 13.6001 3 14C3.02278 14.5798 3.22019 15.1393 3.56636 15.605C3.91254 16.0708 4.39133 16.421 4.94 16.61C6.24 19.72 8.85 22 12 22H15V20H12C9.74 20 7.69 18.3 6.66 15.61L6.45 15.06L5.86 15C5.61972 14.966 5.39999 14.8459 5.24177 14.6619C5.08354 14.4779 4.99761 14.2427 5 14C5.00105 13.8255 5.04776 13.6543 5.13547 13.5034C5.22319 13.3525 5.34886 13.2273 5.5 13.14L6 12.85V11C6 10.7348 6.10536 10.4804 6.29289 10.2929C6.48043 10.1054 6.73478 10 7 10H17C17.2652 10 17.5196 10.1054 17.7071 10.2929C17.8946 10.4804 18 10.7348 18 11V16H13.91C13.8192 15.7454 13.6613 15.5201 13.4531 15.3479C13.2448 15.1756 12.9938 15.0629 12.7267 15.0215C12.4596 14.9801 12.1863 15.0117 11.9357 15.1129C11.6851 15.214 11.4664 15.381 11.3029 15.5962C11.1394 15.8114 11.037 16.0668 11.0066 16.3353C10.9763 16.6039 11.019 16.8757 11.1304 17.1219C11.2418 17.3682 11.4176 17.5798 11.6393 17.7343C11.8611 17.8889 12.1204 17.9807 12.39 18H20C20.5304 18 21.0391 17.7893 21.4142 17.4142C21.7893 17.0391 22 16.5304 22 16V14C22 13.4696 21.7893 12.9609 21.4142 12.5858C21.0391 12.2107 20.5304 12 20 12V10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z" fill="currentColor"/>
  </g>
  <defs>
    <clipPath id="clip0_1718_2242">
      <rect width="24" height="24" fill="currentColor"/>
    </clipPath>
  </defs>
</svg>,
  },
];
 
  return (
    <div className="">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">FAQ & Support </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Configure FAQs and respond to user support requests.</p>
     <div className="flex items-center bg-[#E7E8FF] border border-primaryColor rounded-[14px] p-[6px] gap-1 w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5  rounded-[12px] text-lg font-sora font-semibold
              transition-all duration-200 cursor-pointer whitespace-nowrap
              ${
                isActive
                  ? "bg-primaryColor text-white shadow-sm"
                  : "bg-transparent text-[#5B5EF4] hover:bg-[#5B5EF4]/10"
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
       {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "faq-management" && <FAQManagement />}
        {activeTab === "support-requests" && <SupportRequests />}
      </div>
      <div>
         
      </div>
    </div>
  );
}