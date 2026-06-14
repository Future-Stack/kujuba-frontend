/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState } from "react";
// import { ArrowUpRight, ArrowDownLeft, MoreVertical } from "lucide-react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// const chartData = [
//   { name: "SUN", receive: 10000, payout: 6000 },
//   { name: "MON", receive: 28000, payout: 12000 },
//   { name: "TUE", receive: 41345, payout: 15000 },
//   { name: "WED", receive: 72000, payout: 28000 },
//   { name: "THU", receive: 20000, payout: 8000 },
//   { name: "FRI", receive: 50000, payout: 23000 },
//   { name: "SAT", receive: 45000, payout: 21000 },
// ];

// // ── Custom X-axis tick with hollow circle below label ──
// const CustomXTick = ({ x, y, payload }: any) => (
//   <g transform={`translate(${x},${y})`}>
//     <text
//       x={0} y={0} dy={14}
//       textAnchor="middle"
//       fill="#9ca3af"
//       fontSize={11}
//       fontWeight={600}
//       letterSpacing="0.05em"
//     >
//       {payload.value}
//     </text>
//     {/* hollow circle */}
//     <circle cx={0} cy={28} r={4} stroke="#D1D5DB" strokeWidth={1.5} fill="#fff" />
//   </g>
// );

// // ── Custom tooltip ──
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

// // ── Toggle icon ──
// const ToggleIcon = ({ active }: { active: boolean }) =>
//   active ? (
//     <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//       <circle cx="12" cy="12" r="11" stroke="#09BD3C" strokeWidth="1.5" />
//       <path
//         d="M7 12l3.5 3.5L17 8"
//         stroke="#09BD3C"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   ) : (
//     <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//       <circle cx="12" cy="12" r="11" stroke="#D7D7D7" strokeWidth="1.5" />
//     </svg>
//   );

// export default function FinanceInsights() {
//   const [viewType, setViewType] = useState<"monthly" | "weekly">("weekly");

//   return (
//     <div className="w-full p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm select-none">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//         <h2 className="text-lg md:text-xl font-normal text-[#171B1E] font-roboto">
//           Finance Insights
//         </h2>

//         <div className="flex items-center gap-5 self-end sm:self-auto">
//           <button
//             onClick={() => setViewType("monthly")}
//             className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
//           >
//             <ToggleIcon active={viewType === "monthly"} />
//             <span className={viewType === "monthly" ? "text-[#3B6D11]" : "text-gray-400"}>
//               Monthly
//             </span>
//           </button>

//           <button
//             onClick={() => setViewType("weekly")}
//             className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
//           >
//             <ToggleIcon active={viewType === "weekly"} />
//             <span className={viewType === "weekly" ? "text-[#3B6D11]" : "text-gray-400"}>
//               Weekly
//             </span>
//           </button>

//           <button className="text-gray-900 cursor-pointer ml-1">
//             <MoreVertical className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-full bg-[#09BD3C] flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100">
//             <ArrowUpRight className="w-6 h-6 stroke-[3]" />
//           </div>
//           <div>
//             <p className="text-lg text-[#3B6D11] font-normal font-roboto">Receive Payment</p>
//             <p className="text-base font-normal text-[#171B1E] mt-0.5 font-roboto">$ 459,234.08</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-full bg-[#FFAA2B] flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-100">
//             <ArrowDownLeft className="w-6 h-6 stroke-[3]" />
//           </div>
//           <div>
//             <p className="text-lg text-[#BA7517] font-normal font-roboto">Payout</p>
//             <p className="text-base font-normal text-[#171B1E] mt-0.5 font-roboto">$ 23,456</p>
//           </div>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="w-full h-[280px] md:h-[340px] relative -ml-4 pr-2">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart
//             data={chartData}
//             margin={{ top: 25, right: 15, left: -15, bottom: 20 }}
//           >
//             <defs>
//               <linearGradient id="receiveGrad" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%"  stopColor="#09BD3C" stopOpacity={0.08} />
//                 <stop offset="95%" stopColor="#09BD3C" stopOpacity={0} />
//               </linearGradient>
//             </defs>

//             {/* Both horizontal AND vertical grid lines */}
//             <CartesianGrid
//               stroke="#f3f4f6"
//               strokeWidth={1.5}
//               vertical={true}
//               horizontal={true}
//             />

//             <XAxis
//               dataKey="name"
//               axisLine={false}
//               tickLine={false}
//               tick={<CustomXTick />}
//               padding={{ left: 25, right: 25 }}
//               interval={0}
//             />

//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
//               domain={[0, 80000]}
//               ticks={[0, 20000, 40000, 60000]}
//               tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}k`)}
//             />

//             <Tooltip
//               cursor={{ stroke: "#94a3b8", strokeWidth: 1.5, strokeDasharray: "3 3" }}
//               content={<CustomTooltip />}
//             />

//             {/* Payout — orange */}
//             <Area
//               type="monotone"
//               dataKey="payout"
//               stroke="#FFAA2B"
//               strokeWidth={4}
//               fill="transparent"
//               strokeLinecap="round"
//               dot={false}
//               activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#FFAA2B" }}
//             />

//             {/* Receive — green */}
//             <Area
//               type="monotone"
//               dataKey="receive"
//               stroke="#09BD3C"
//               strokeWidth={5}
//               fill="url(#receiveGrad)"
//               strokeLinecap="round"
//               dot={false}
//               activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2, fill: "#09BD3C" }}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
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

const chartData = [
  { name: "SUN", receive: 10000, payout: 6000 },
  { name: "MON", receive: 28000, payout: 12000 },
  { name: "TUE", receive: 41345, payout: 15000 },
  { name: "WED", receive: 72000, payout: 28000 },
  { name: "THU", receive: 20000, payout: 8000 },
  { name: "FRI", receive: 50000, payout: 23000 },
  { name: "SAT", receive: 45000, payout: 21000 },
];

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
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-200/80 border border-gray-100/50 flex flex-col items-center relative -top-14">
        <span className="text-[17px] font-extrabold text-gray-800 tracking-tight">
          ${payload[0].value?.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400 mt-0.5 font-normal">
          Nov 24th, 2020
        </span>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100/50" />
      </div>
    );
  }
  return null;
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

export default function FinanceInsights() {
  const [viewType, setViewType] = useState<"monthly" | "weekly">("weekly");
  const [activeDay, setActiveDay] = useState<string | null>(null);

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
              Monthly
            </span>
          </button>

          <button
            onClick={() => setViewType("weekly")}
            className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            {getIcon(viewType === "weekly")}
            <span className={viewType === "weekly" ? "text-[#717579]" : "text-gray-400"}>
              Weekly
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
              $ 459,234.08
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
              $ 23,456
            </p>
          </div>
        </div>
      </div>

      {/* Chart — equal left/right space */}
      <div className="w-full h-[300px] md:h-[350px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
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
              dataKey="name"
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
              domain={[0, 80000]}
              ticks={[0, 20000, 40000, 60000, 80000]}
              tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}k`)}
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