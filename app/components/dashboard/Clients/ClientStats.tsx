"use client";

import React from "react";
import StatCard from "@/app/components/reusabledCard/StateCard";
import { useGetClientStatsQuery } from "@/app/redux/features/clientApi";
import { Building2, CheckCircle2, Clock, ShieldAlert, Users } from "lucide-react";

export default function ClientStats() {
  const { data, isLoading } = useGetClientStatsQuery();
  const statsData = data?.data;

  const stats = [
    {
      value: isLoading ? "..." : (statsData?.total_clients ?? 0),
      label: "Total Clients",
      change: `${statsData?.client_growth_percentage ?? 0}% than last month`,
      isPositive: (statsData?.client_growth_percentage ?? 0) >= 0,
      iconPath: "/dashboard/clients",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>
      ),
    },
    {
      value: isLoading ? "..." : (statsData?.active_clients ?? 0),
      label: "Active Clients",
      change: `${statsData?.active_growth_percentage ?? 0}% than last month`,
      isPositive: (statsData?.active_growth_percentage ?? 0) >= 0,
      valueColor: "text-emerald-600",
      iconPath: "/dashboard/clients",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
      ),
    },
    {
      value: isLoading ? "..." : (statsData?.pending_clients ?? 0),
      label: "Pending Clients",
      change: `${statsData?.pending_growth_percentage ?? 0}% than last month`,
      isPositive: (statsData?.pending_growth_percentage ?? 0) >= 0,
      valueColor: "text-amber-500",
      iconPath: "/dashboard/clients",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
      ),
    },
    {
      value: isLoading ? "..." : (statsData?.suspended_clients ?? 0),
      label: "Suspended Clients",
      change: `${statsData?.suspended_growth_percentage ?? 0}% than last month`,
      isPositive: (statsData?.suspended_growth_percentage ?? 0) >= 0,
      valueColor: "text-rose-600",
      labelColor: "text-rose-600",
      iconPath: "/dashboard/clients",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
