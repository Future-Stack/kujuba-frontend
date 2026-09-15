"use client";

import React from "react";
import InHouseAdminStats from "@/app/components/dashboard/InHouseAdmin/InHouseAdminStats";
import InHouseAdminGrid from "@/app/components/dashboard/InHouseAdmin/InHouseAdminGrid";

export default function InHouseAdminsPage() {
  return (
    <div className="p-2 sm:p-4">
      <div className="mb-6">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-2">
          In-House Admin Management
        </h1>
        <p className="text-[#8F8F8F] text-base md:text-lg font-normal font-roboto">
          Manage staff accounts, suspend/unsuspend admins, and configure module access permissions
        </p>
      </div>

      <InHouseAdminStats />

      <InHouseAdminGrid />
    </div>
  );
}
