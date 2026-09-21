"use client";
import { Suspense } from "react";
import InspectorEarnings from "@/app/components/dashboard/inspectors/InspectorEarnings";
import { Loader2 } from "lucide-react";

export default function InspectorEarningsPage() {
  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-2">
            Inspector Earnings
          </h1>
          <p className="text-[#B5BCC8] text-base md:text-lg font-normal font-roboto">
            Track inspector payouts, Stripe connections, and pending balances
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primaryColor" />
          </div>
        }
      >
        <InspectorEarnings />
      </Suspense>
    </div>
  );
}
