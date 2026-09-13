"use client";

import ClientReportsView from "@/app/components/dashboard/ClientReports/ClientReportsView";

export default function ClientReportsPage() {
  return (
    <div className="p-2 sm:p-4">
      <div className="mb-6">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-2">
          Client Reports
        </h1>
        <p className="text-[#B5BCC8] text-base md:text-lg font-normal font-roboto">
          Generate, preview, email, and download corporate client inspection summary reports
        </p>
      </div>

      <ClientReportsView />
    </div>
  );
}
