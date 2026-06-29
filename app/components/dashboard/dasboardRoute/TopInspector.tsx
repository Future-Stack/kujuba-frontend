



"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";


function TopInspectorSkeleton() {
  return (
    <div className="w-full bg-white rounded-[20px] border border-gray-200 p-4 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-4" />

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div>
                <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="h-10 w-full bg-gray-200 rounded mt-6" />
    </div>
  );
}

export default function TopInspector() {
   const { data, isLoading, isError } = useGetOverviewQuery();

  if (isLoading) return <TopInspectorSkeleton />;

  const getInitials = (name: string) => {
  if (!name) return "U";

  const parts = name.trim().split(" ");

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return parts[0][0].toUpperCase();
};

  if (isError || !data?.success) {
    return (
      <div className="w-full bg-white rounded-[20px] border p-4 text-red-500 text-center">
        Failed to load inspectors
      </div>
    );
  }

  const inspectors = data.data.top_inspectors;
  return (
    <div className="w-full h-full bg-white rounded-[20px] border border-gray-200 flex flex-col justify-between font-roboto">
      
      <div>
        <h3 className="text-base md:text-lg font-bold text-gray-900 px-5 py-4 border-b border-gray-100">
          Top Inspector
        </h3>

        <div className="space-y-5 px-4 pt-4">
          {inspectors.map((inspector) => (
            <div key={inspector.id} className="flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0">
  
  {inspector.profile?.avatar ? (
    <Image
      src={inspector.profile.avatar}
      alt={inspector.name}
      fill
      className="object-cover"
      unoptimized
    />
  ) : (
    <div className="w-full h-full bg-[#e0e7ff] text-[#6366f1] flex items-center justify-center font-bold text-sm">
      {getInitials(inspector.name)}
    </div>
  )}

</div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {inspector.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {inspector.profile?.address || "No location"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-600">Total Earnings</p>
                <p className="text-sm font-semibold text-gray-900">
                  ${inspector.total_earnings}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-6 pb-4">
        <Link href="/dashboard/inspectors">
          <button className="w-full mt-6 border border-primaryColor text-primaryColor text-sm py-2 rounded-xl hover:bg-blue-50 cursor-pointer transition">
            View All
          </button>
        </Link>
      </div>
    </div>
  );

}