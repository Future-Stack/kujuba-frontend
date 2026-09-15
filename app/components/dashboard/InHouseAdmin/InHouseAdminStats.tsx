"use client";

import React from "react";
import StatCard from "@/app/components/reusabledCard/StateCard";
import { useGetInhouseAdminStatsQuery } from "@/app/redux/features/inhouseAdminApi";
import { ShieldCheck, UserCheck, UserX } from "lucide-react";

export default function InHouseAdminStats() {
  const { data, isLoading } = useGetInhouseAdminStatsQuery();
  const statsData = data?.data;

  const stats = [
    {
      value: isLoading ? "..." : (statsData?.total_inhouse_admins ?? 0),
      label: "Total In-House Admins",
      change: "All registered staff admins",
      isPositive: true,
      iconPath: "/dashboard/inhouse-admins",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
      ),
    },
    {
      value: isLoading ? "..." : (statsData?.active_admins ?? 0),
      label: "Active Admins",
      change: "Active in-house admins",
      isPositive: true,
      valueColor: "text-emerald-600",
      iconPath: "/dashboard/inhouse-admins",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <UserCheck className="w-6 h-6" />
        </div>
      ),
    },
    {
      value: isLoading ? "..." : (statsData?.suspended_admins ?? 0),
      label: "Suspended Admins",
      change: "Currently suspended admins",
      isPositive: false,
      valueColor: "text-rose-600",
      labelColor: "text-rose-600",
      iconPath: "/dashboard/inhouse-admins",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <UserX className="w-6 h-6" />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
