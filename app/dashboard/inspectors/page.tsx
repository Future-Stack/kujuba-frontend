"use client";
import InspectorsCard from "@/app/components/dashboard/inspectors/InspectorCard";
import InspectorGrid from "@/app/components/dashboard/inspectors/InspectorGrid";
import CreateUserModal from "@/app/components/dashboard/Users/CreateUserModal";
import { Plus } from "lucide-react";
import { Suspense, useState } from "react";

export default function inspectors() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Inspector Management </h1>
          <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Manage inspector onboarding, approval, and performance</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-primaryColor text-white font-sora font-semibold text-sm px-5 py-3 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={18} />
          Add New Inspector
        </button>
      </div>
      <div>
        <InspectorsCard />
      </div>
      <div>
        <Suspense fallback={<div>Loading grid...</div>}>
          <InspectorGrid />
        </Suspense>
      </div>
      <CreateUserModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        variant="inspector"
      />
    </div>
  );
}
