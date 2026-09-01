"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import UserCard from "@/app/components/dashboard/Users/UserCard";
import UserGridDashboard from "@/app/components/dashboard/Users/UsersGrid";
import CreateUserModal from "@/app/components/dashboard/Users/CreateUserModal";

export default function Users() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">User Management </h1>
          <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Manage User status, inspections, and Payments</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-primaryColor text-white font-sora font-semibold text-sm px-5 py-3 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={18} />
          Add New User
        </button>
      </div>
      <div>
        <UserCard />
      </div>
      <div>
        <UserGridDashboard />
      </div>
      <CreateUserModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        variant="homeowner"
      />
    </div>
  );
}
