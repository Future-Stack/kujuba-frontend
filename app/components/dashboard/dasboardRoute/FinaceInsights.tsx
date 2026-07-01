/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, MoreVertical } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";

// const chartData = [
//   { name: "SUN", receive: 10000, payout: 6000 },
//   { name: "MON", receive: 28000, payout: 12000 },
//   { name: "TUE", receive: 41345, payout: 15000 },
//   { name: "WED", receive: 72000, payout: 28000 },
//   { name: "THU", receive: 20000, payout: 8000 },
//   { name: "FRI", receive: 50000, payout: 23000 },
//   { name: "SAT", receive: 45000, payout: 21000 },
// ];

// ── Custom X-axis tick ──
const CustomXTick = ({ x, y, payload, activeDay }: any) => {
  const isActive = activeDay === payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* 24px gap between chart border and circle */}
      {isActive ? (
        <svg x={-5.5} y={9} width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="5" fill="#D7D7D7" stroke="#D7D7D7"/>
        </svg>
      ) : (
        <svg x={-5.5} y={9} width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="#D7D7D7" strokeWidth="2"/>
        </svg>
      )}
      <text
        x={0}
        y={52}
        textAnchor="middle"
        fill="#171B1E"
        fontSize={14}
        fontWeight={400}
      >
        {payload.value}
      </text>
    </g>
  );
};

// ── Custom tooltip ──
// const CustomTooltip = ({ active, payload }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-200/80 border border-gray-100/50 flex flex-col items-center relative -top-14">
//         <span className="text-[17px] font-extrabold text-gray-800 tracking-tight">
//           ${payload[0].value?.toLocaleString()}
//         </span>
//         <span className="text-sm text-gray-400 mt-0.5 font-normal">
//           Nov 24th, 2020
//         </span>
//         <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100/50" />
//       </div>
//     );
//   }
//   return null;
// };

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100">
      {payload.map((entry: any) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between gap-8 mb-1 last:mb-0"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />

            <span className="text-sm text-gray-700">
              {entry.dataKey === "receive"
                ? "Receive Payment"
                : "Payout"}
            </span>
          </div>

          <span
            className="font-semibold"
            style={{ color: entry.color }}
          >
            ${Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const getIcon = (active: boolean) => {
  return active ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#clip0_539_2146)">
        <path d="M22.8516 6.86717C21.8719 4.79061 20.3203 3.04686 18.3656 1.82342C15.6469 0.126548 12.4266 -0.412515 9.30468 0.30936C6.18281 1.02655 3.52499 2.9203 1.82812 5.63905C0.126556 8.3578 -0.412506 11.5734 0.309369 14.7C1.03124 17.8219 2.92499 20.4797 5.63906 22.1765C7.55156 23.3719 9.74531 24.0047 11.9906 24.0047H12.1359C14.3719 23.9765 16.5469 23.3297 18.4312 22.139C18.9797 21.7922 19.1391 21.0703 18.7922 20.5219C18.4453 19.9734 17.7234 19.814 17.175 20.1609C15.6609 21.1219 13.9078 21.6422 12.1078 21.6656C10.2609 21.689 8.45624 21.1781 6.88124 20.1984C4.69218 18.8297 3.16874 16.6922 2.59218 14.1797C2.01562 11.6672 2.44687 9.07967 3.81562 6.89061C6.63749 2.37655 12.6094 0.998423 17.1234 3.8203C18.6984 4.80467 19.9453 6.20624 20.7328 7.87499C21.5016 9.50155 21.8016 11.3062 21.6 13.0875C21.5297 13.7297 21.9891 14.3109 22.6359 14.3812C23.2781 14.4515 23.8594 13.9922 23.9297 13.3453C24.1781 11.1281 23.8031 8.88749 22.8516 6.86717Z" fill="#FF6175"/>
        <path d="M15.8764 7.93123L10.2232 13.5843L8.12793 11.489C7.66855 11.0297 6.92793 11.0297 6.46855 11.489C6.00918 11.9484 6.00918 12.689 6.46855 13.1484L9.39355 16.0734C9.62324 16.3031 9.92324 16.4156 10.2232 16.4156C10.5232 16.4156 10.8232 16.3031 11.0529 16.0734L17.531 9.5906C17.9904 9.13122 17.9904 8.3906 17.531 7.93123C17.0717 7.47654 16.331 7.47654 15.8764 7.93123Z" fill="#FF6175"/>
      </g>
      <defs>
        <clipPath id="clip0_539_2146">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#clip0_539_2155)">
        <path d="M22.8516 6.86717C21.8719 4.79061 20.3203 3.04686 18.3656 1.82342C15.6469 0.126548 12.4266 -0.412515 9.30468 0.30936C6.18281 1.02655 3.52499 2.9203 1.82812 5.63905C0.126556 8.3578 -0.412506 11.5734 0.309369 14.7C1.03124 17.8219 2.92499 20.4797 5.63906 22.1765C7.55156 23.3719 9.74531 24.0047 11.9906 24.0047H12.1359C14.3719 23.9765 16.5469 23.3297 18.4312 22.139C18.9797 21.7922 19.1391 21.0703 18.7922 20.5219C18.4453 19.9734 17.7234 19.814 17.175 20.1609C15.6609 21.1219 13.9078 21.6422 12.1078 21.6656C10.2609 21.689 8.45624 21.1781 6.88124 20.1984C4.69218 18.8297 3.16874 16.6922 2.59218 14.1797C2.01562 11.6672 2.44687 9.07967 3.81562 6.89061C6.63749 2.37655 12.6094 0.998423 17.1234 3.8203C18.6984 4.80467 19.9453 6.20624 20.7328 7.87499C21.5016 9.50155 21.8016 11.3062 21.6 13.0875C21.5297 13.7297 21.9891 14.3109 22.6359 14.3812C23.2781 14.4515 23.8594 13.9922 23.9297 13.3453C24.1781 11.1281 23.8031 8.88749 22.8516 6.86717Z" fill="#D7D7D7"/>
      </g>
      <defs>
        <clipPath id="clip0_539_2155">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
};


function FinanceInsightsSkeleton() {
  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-[20px] border animate-pulse">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>

        <div className="flex gap-4">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="w-full h-[300px] md:h-[350px] bg-gray-100 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
}

const getDateRange = (type: "monthly" | "weekly") => {
  const now = new Date();
  
  if (type === "monthly") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      from_date: from.toISOString().split("T")[0], 
      to_date: to.toISOString().split("T")[0],   
    };
  } else {
    // Weekly: last 7 days
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 6);
    return {
      from_date: from.toISOString().split("T")[0],
      to_date: to.toISOString().split("T")[0],
    };
  }
};
export default function FinanceInsights() {
  const [viewType, setViewType] = useState<"monthly" | "weekly">("weekly");
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const dateRange = getDateRange(viewType);
console.log("Fetching with:", dateRange); 
const { data, isLoading, isError, refetch } = useGetOverviewQuery({ range: viewType });


useEffect(() => {
  refetch();
}, [viewType]);
console.log("API response:", JSON.stringify(data));
console.log(data)
console.log("viewType:", viewType);
console.log("data:", data);
console.log("isLoading:", isLoading);
console.log("isError:", isError);
const financeMetrics = (data?.data as any)?.finance_metrics;
const chartData = (data?.data as any)?.finance_chart || [];
console.log(chartData)
console.log(chartData.length);
const receivePayment = Number(financeMetrics?.receive_payment || 0);
const payout = Number(financeMetrics?.payout || 0);

const maxValue = Math.max(
  ...chartData.map((item: any) =>
    Math.max(item.receive || 0, item.payout || 0)
  ),
  1000
);

const formattedChartData = chartData.map((item: any) => {
  const date = new Date(item.label);
  const isValidDate = !isNaN(date.getTime());
  
  return {
    ...item,
    label: isValidDate
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : item.label, 
  };
});
if (isLoading) {
  return <FinanceInsightsSkeleton />;
}
if (isError || !data?.success) {
  return (
    <div className="w-full p-6 bg-white rounded-[20px] border text-red-500">
      Failed to load finance insights
    </div>
  );
}
  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-[20px] border border-gray-200 hover:shadow-sm select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-lg md:text-xl font-normal text-[#171B1E] font-roboto">
          Finance Insights
        </h2>

        <div className="flex items-center gap-5 self-end sm:self-auto">
          <button
            onClick={() => setViewType("monthly")}
            className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            {getIcon(viewType === "monthly")}
            <span className={viewType === "monthly" ? "text-[#717579]" : "text-gray-400"}>
              Current Monthly
            </span>
          </button>

          <button
            onClick={() => setViewType("weekly")}
            className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            {getIcon(viewType === "weekly")}
            <span className={viewType === "weekly" ? "text-[#717579]" : "text-gray-400"}>
              Current Weekly
            </span>
          </button>

          {/* <button className="text-gray-900 cursor-pointer transition-colors ml-1">
            <MoreVertical className="w-5 h-5" />
          </button> */}
        </div>
      </div>

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#09BD3C] flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100">
            <ArrowUpRight className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <p className="text-lg md:text-xl text-[#09BD3C] font-normal font-roboto">
              Receive Payment
            </p>
            <p className="text-base font-normal text-[#171B1E] mt-0.5 font-roboto">
             ${receivePayment.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFAA2B] flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-100">
            <ArrowDownLeft className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <p className="text-lg md:text-xl text-[#FFAA2B] font-normal font-roboto">
              Payout
            </p>
            <p className="text-base font-normal text-[#171B1E] mt-0.5 font-roboto">
              ${payout.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart — equal left/right space */}
     <div
  className="w-full relative"
  style={{
    height: "350px",
    minWidth: "300px",
  }}
>
        <ResponsiveContainer width="100%" height="100%" >
          <AreaChart
           data={formattedChartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
            onMouseMove={(e: any) => {
              if (e && e.activeLabel) setActiveDay(e.activeLabel);
            }}
            onMouseLeave={() => setActiveDay(null)}
          >
            <defs>
              <linearGradient id="receiveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#09BD3C" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#09BD3C" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E5E7EB"
              strokeWidth={1}
              horizontal={true}
              verticalCoordinatesGenerator={({ width }) => {
                const step = width / 7;
                return Array.from({ length: 6 }, (_, i) => step * (i + 1));
              }}
            />

            <XAxis
             dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={(props) => <CustomXTick {...props} activeDay={activeDay} />}
              interval={0}
              height={75}
              padding={{ left: 40, right: 40 }}
              
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#787878", fontSize: 14, fontWeight: 400 }}
              domain={[0, maxValue]}
              // ticks={[0, 20000, 40000, 60000, 80000]}
              tickFormatter={(value) => value.toLocaleString()}
            tickMargin={24} 
            />

            <Tooltip
              cursor={{
                stroke: "#94a3b8",
                strokeWidth: 1.5,
                strokeDasharray: "3 3",
              }}
              content={<CustomTooltip />}
            />

            {/* Payout — orange */}
            <Area
              type="monotone"
              dataKey="payout"
              stroke="#FFAA2B"
              strokeWidth={4}
              fill="transparent"
              strokeLinecap="round"
              dot={false}
              activeDot={{ r: 10, stroke: "#fff", strokeWidth: 3, fill: "#FFAA2B" }}
            />

            {/* Receive — green */}
            <Area
              type="monotone"
              dataKey="receive"
              stroke="#09BD3C"
              strokeWidth={5}
              fill="url(#receiveGrad)"
              strokeLinecap="round"
              dot={false}
              activeDot={{ r: 12, stroke: "#fff", strokeWidth: 4, fill: "#09BD3C" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}