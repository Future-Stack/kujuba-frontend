"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ClientStats from "@/app/components/dashboard/Clients/ClientStats";
import ClientsGrid from "@/app/components/dashboard/Clients/ClientsGrid";
import CreateClientModal from "@/app/components/dashboard/Clients/CreateClientModal";

export default function ClientsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="p-2 sm:p-4">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-2">
            Client Management
          </h1>
          <p className="text-[#B5BCC8] text-base md:text-lg font-normal font-roboto mb-6">
            Manage corporate clients, insurance companies, realtors, stats, and link inspection bookings
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-primaryColor text-white font-sora font-semibold text-sm px-5 py-3 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          <Plus size={18} />
          Add New Client
        </button>
      </div>

      <div>
        <ClientStats />
      </div>

      <div>
        <ClientsGrid />
      </div>

      <CreateClientModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
