"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, MoreVertical, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Mapping your SVG point logic into data coordinates for proper rendering
const chartData = [
  { name: "SUN", receive: 10000, payout: 6000 },
  { name: "MON", receive: 28000, payout: 12000 },
  { name: "TUE", receive: 41345, payout: 15000 }, // Exact target dot point
  { name: "WED", receive: 72000, payout: 28000 },
  { name: "THU", receive: 20000, payout: 8000 },
  { name: "FRI", receive: 50000, payout: 23000 },
  { name: "SAT", receive: 45000, payout: 21000 },
];

export default function FinanceInsights() {
  const [viewType, setViewType] = useState<"monthly" | "weekly">("weekly");

  return (
    <div className="w-full  p-4 md:p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm select-none">
      
      {/* Header Utilities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-lg md:text-xl font-normal text-[#171B1E] font-roboto">Finance Insights</h2>
        
        <div className="flex items-center gap-5 self-end sm:self-auto">
          {/* Monthly Selection Button */}
          <button 
            onClick={() => setViewType("monthly")}
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-roboto transition-all ${
              viewType === "monthly" ? "border-[#09BD3C] bg-emerald-50" : "border-gray-300"
            }`}>
              {viewType === "monthly" && <div className="w-2 h-2 bg-[#09BD3C] rounded-full" />}
            </div>
            <span className={viewType === "monthly" ? "text-secondaryColor" : "text-secondaryColor"}>Monthly</span>
          </button>

          {/* Weekly Selection Button */}
          <button 
            onClick={() => setViewType("weekly")}
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
          >
            {viewType === "weekly" ? (
              <CheckCircle2 className="w-5 h-5 text-rose-500 fill-rose-50" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
            <span className={viewType === "weekly" ? "text-gray-800" : "text-gray-400"}>Weekly</span>
          </button>

          <button className="text-gray-400 hover:text-gray-600 transition-colors ml-1">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {/* Receive Payment Analytics */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#09BD3C] flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100">
            <ArrowUpRight className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <p className="text-lg md:text-xl text-secondaryColor font-normal font-roboto ">Receive Payment</p>
            <p className="text-base md:text-base font-normal text-[#171B1E] mt-0.5 font-roboto">$ 459,234.08</p>
          </div>
        </div>

        {/* Payout Analytics */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFAA2B] flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-100">
            <ArrowDownLeft className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <p className="text-lg md:text-xl text-secondaryColor font-normal font-roboto">Payout</p>
            <p className="text-base md:text-base font-normal text-[#171B1E] mt-0.5 font-roboto">$ 23,456</p>
          </div>
        </div>
      </div>

      {/* Interactive Responsive Graph */}
      <div className="w-full h-[280px] md:h-[340px] relative -ml-4 pr-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 25, right: 15, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="receiveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#09BD3C" stopOpacity={0.06}/>
                <stop offset="95%" stopColor="#09BD3C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Grid Lines */}
            <CartesianGrid vertical={false} stroke="#f3f4f6" strokeWidth={1.5} />
            
            {/* X Axis Setup */}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}
              padding={{ left: 25, right: 25 }}
            />
            
            {/* Y Axis Setup */}
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
              domain={[0, 80000]}
              ticks={[0, 20000, 40000, 60000]}
              tickFormatter={(val) => val === 0 ? "0" : `${val / 1000}k`}
            />

            {/* Micro-targeted Indicator Tooltip */}
            <Tooltip 
              cursor={{ stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '3 3' }}
              defaultIndex={2} // Defaults highlight element to Tuesday matching your visual asset mockup
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-200/80 border border-gray-100/50 flex flex-col items-center relative -top-14">
                      <span className="text-[17px] font-extrabold text-gray-800 tracking-tight">
                        ${payload[0].value?.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 mt-0.5 font-normal ">
                        Nov 24th, 2020
                      </span>
                      {/* Anchor arrow pointing directly down to node */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100/50" />
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Payout Line Plot (Orange Curve) */}
            <Area
              type="monotone"
              dataKey="payout"
              stroke="#FFAA2B"
              strokeWidth={5}
              fill="transparent"
              strokeLinecap="round"
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#FFAA2B' }}
            />

            {/* Receive Line Plot (Green Curve) */}
            <Area
              type="monotone"
              dataKey="receive"
              stroke="#09BD3C"
              strokeWidth={6}
              fill="url(#receiveGrad)"
              strokeLinecap="round"
              activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2, fill: '#09BD3C' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}