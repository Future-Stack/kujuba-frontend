/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";


export default function InspectionStatistics() {
  const { data, isLoading, isFetching } = useGetOverviewQuery(undefined as any);

  const rawBarChart = data?.data?.bar_chart ?? [];

  // Map API fields → chart keys
  const chartData = rawBarChart.map((item) => ({
    name: item.date,
    active: Number(item.assigned),
    inprogress: Number(item.started),
    completed: Number(item.completed),
  }));

  const loading = isLoading || isFetching;

  return (
    <div className="w-full  p-4 md:px-5 md:py-4 bg-white rounded-[20px] border border-gray-200 hover:shadow-sm  select-none">
      
      {/* Card Header */}
      <div className="border-b border-gray-100 pb-5 mb-6 ">
        <h3 className="text-base md:text-lg font-bold text-gray-900  leading-5.5 m px-1 ">Inspection Statistics</h3>
      </div>

      {/* Centered Custom Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm font-medium text-gray-600">
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-primaryColor" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#FE9738]" />
          <span>Inprogress</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#01B664]" />
          <span>Completed</span>
        </div>
      </div>

      {/* Chart Wrapper */}
      <div className="w-full h-[280px] md:h-[300px] overflow-x-auto overflow-y-hidden -ml-1 pr-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-[#3550DC] rounded-full animate-spin" />
          </div>
        )}
        <div className="min-w-[550px] h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={12}
            >
              <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "#5F5F5F", fontSize: 14, fontWeight: 400 }}
                interval={0} 
                tickMargin={12} 
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "#5F5F5F", fontSize: 14, fontWeight: 400 }}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickMargin={12}
              />

              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-1 text-xs font-bold text-gray-800">
                        <p className="text-gray-400 font-medium mb-0.5">{payload[0].payload.name}</p>
                        {payload.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 justify-between">
                            <span className="flex items-center gap-1.5 font-semibold text-gray-500">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              {item.name}:
                            </span>
                            <span>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Active Bar Series (Royal Blue) */}
              <Bar 
                dataKey="active" 
                name="Active"
                fill="#3550DC" 
                maxBarSize={12}
                radius={[10, 10, 0, 0]}
              />

              {/* In-Progress Bar Series (Warm Orange) */}
              <Bar 
                dataKey="inprogress" 
                name="Inprogress"
                fill="#FE9738" 
                maxBarSize={12}
                radius={[10, 10, 0, 0]}
              />

              {/* Completed Bar Series (Emerald Green) */}
              <Bar 
                dataKey="completed" 
                name="Completed"
                fill="#01B664" 
                maxBarSize={12}
                radius={[10, 10, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}








// "use client";

// import React from "react";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// // Mapping the exact data sequence and specific color overrides from your image
// const data = [
//   { name: "12 May", active: 92, inprogress: 23, completed: 47 },
//   { name: "13 May", active: 39, inprogress: 83, completed: 47 },
//   { name: "14 May", active: 92, inprogress: 23, completed: 47, specialColor: "#8b5cf6" }, // Purple override for May 14th completed
//   { name: "15 May", active: 64, inprogress: 23, completed: 49 },
//   { name: "16 May", active: 74, inprogress: 23, completed: 38 },
//   { name: "17 May", active: 37, inprogress: 23, completed: 29 },
//   { name: "18 May", active: 92, inprogress: 23, completed: 65 },
// ];

// export default function InspectionStatistics() {
//   return (
//     <div className="w-full  p-4 md:px-5 md:py-4 bg-white rounded-[20px] border border-gray-200 hover:shadow-sm  select-none">
      
//       {/* Card Header */}
//       <div className="border-b border-gray-100 pb-5 mb-6 ">
//         <h3 className="text-base md:text-lg font-bold text-gray-900  leading-5.5 m px-1 ">Inspection Statistics</h3>
//       </div>

//       {/* Centered Custom Legend */}
//       <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm font-medium text-gray-600">
//         <div className="flex items-center gap-2.5">
//           <span className="w-3.5 h-3.5 rounded-full bg-primaryColor" />
//           <span>Active</span>
//         </div>
//         <div className="flex items-center gap-2.5">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#FE9738]" />
//           <span>Inprogress</span>
//         </div>
//         <div className="flex items-center gap-2.5">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#01B664]" />
//           <span>Completed</span>
//         </div>
//       </div>

//       {/* Chart Wrapper - Responsive viewport scaling with horizontal drag safety on tiny screens */}
//       <div className="w-full h-[280px] md:h-[300px] overflow-x-auto overflow-y-hidden -ml-1 pr-1">
//         <div className="min-w-[550px] h-full w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={data}
//               margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
//               barGap={12} // Gap distance separating parallel vertical categories inside a single group
//             >
//               {/* Desaturated dotted gridlines */}
//               <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
              
//               <XAxis 
//                 dataKey="name" 
//                 axisLine={false} 
//                 tickLine={false}
//                 tick={{ fill: "#5F5F5F", fontSize: 14, fontWeight: 400 }}
//                 interval={0} 
//                 tickMargin={12} 
//               />
              
//               <YAxis 
//                 axisLine={false} 
//                 tickLine={false}
//                 tick={{ fill: "#5F5F5F", fontSize: 14, fontWeight: 400 }}
//                 domain={[0, 100]}
//                 ticks={[0, 20, 40, 60, 80, 100]}
//                 tickMargin={12}
//               />

//               <Tooltip
//                 cursor={{ fill: "transparent" }} // Disables the dark hover rectangular grid background overlay
//                 content={({ active, payload }) => {
//                   if (active && payload && payload.length) {
//                     return (
//                       <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-1 text-xs font-bold text-gray-800">
//                         <p className="text-gray-400 font-medium mb-0.5">{payload[0].payload.name}</p>
//                         {payload.map((item, idx) => (
//                           <div key={idx} className="flex items-center gap-4 justify-between">
//                             <span className="flex items-center gap-1.5 font-semibold text-gray-500">
//                               <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
//                               {item.name}:
//                             </span>
//                             <span>{item.value}</span>
//                           </div>
//                         ))}
//                       </div>
//                     );
//                   }
//                   return null;
//                 }}
//               />

//               {/* Active Bar Series (Royal Blue) */}
//               <Bar 
//                 dataKey="active" 
//                 name="Active"
//                 fill="#3550DC" 
//                 maxBarSize={12}
//                 radius={[10, 10, 0, 0 ]} // Gives the bar the exact visual pill-shape structure
//               />

//               {/* In-Progress Bar Series (Warm Orange) */}
//               <Bar 
//                 dataKey="inprogress" 
//                 name="Inprogress"
//                 fill="#FE9738" 
//                 maxBarSize={12}
//                 radius={[10, 10,  0, 0 ]}
//               />

//               {/* Completed Bar Series (Emerald Green with conditional color logic override for May 14th) */}
//               <Bar 
//                 dataKey="completed" 
//                 name="Completed"
//                 fill="#01B664" 
//                 maxBarSize={12}
//                 radius={[10, 10,  0, 0 ]}
//               >
//                 {data.map((entry, index) => (
//                   <rect
//                     key={`cell-${index}`}
//                     fill={entry.specialColor ? entry.specialColor : "#059669"}
//                   />
//                 ))}
//               </Bar>

//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//     </div>
//   );
// }