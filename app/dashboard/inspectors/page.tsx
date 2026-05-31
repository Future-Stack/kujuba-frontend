"use client";
import InspectorsCard from "@/app/components/dashboard/inspectors/InspectorCard";
import InspectorGrid from "@/app/components/dashboard/inspectors/InspectorGrid";
import { Suspense } from "react";



export default function inspectors() {
  return (
    <div className="">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Inspector Management </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Manage inspector onboarding, approval, and performance</p>
      <div>
      <InspectorsCard/>
      </div>
      <div>
            <Suspense fallback={<div>Loading grid...</div>}>
        <InspectorGrid />
      </Suspense>
      </div>
    </div>
  );
} 