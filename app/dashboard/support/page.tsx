"use client";

import SupportRequests from "@/app/components/dashboard/support/SupportRequiest";


export default function Support() {
  return (
    <div className="">
      <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Support </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Respond to user support requests.</p>
      <div>
        <SupportRequests />
      </div>
    </div>
  );
}
