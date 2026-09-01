"use client";

import FAQManagement from "@/app/components/dashboard/support/FAQManagment";

export default function FAQ() {
  return (
    <div className="">
      <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">FAQ </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Manage frequently asked questions and provide helpful answers for customers.</p>
      <div>
        <FAQManagement />
      </div>
    </div>
  );
}
