"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// 1. Types Definitions
interface InspectionData {
  name: string;
  value: number;
  color: string;
}

export default function InspectionGaugeWithCalendar() {
  // 2. Main States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Defaults to current client execution date
  
  // States tracking the currently viewed calendar pane month/year navigation
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Close calendar popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Gauge Metrics Data Allocation
  const inspectionData: InspectionData[] = [
    { name: "Ongoing Inspection", value: 49, color: "#3550DC" },
    { name: "Pending Inspection", value: 35, color: "#FE9738" },
    { name: "Completed Inspection", value: 64, color: "#01B664" },
    { name: "Canceled Inspection", value: 32, color: "#DC3545" },
  ];

  // Extra slice calculating the bottom structural void of the semi-circle (180deg background balance)
  const totalGaugeValue = inspectionData.reduce((acc, curr) => acc + curr.value, 0);

  // 4. Calendar Logic Calculations
  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const viewYear = currentViewDate.getFullYear();
  const viewMonth = currentViewDate.getMonth();

  // Get first day layout offset of target month (Adjusting Sunday index to end sequence)
  const getFirstDayOfMonthOffset = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getDaysInPriorMonth = () => new Date(viewYear, viewMonth, 0).getDate();

  const daysInCurrentMonth = getDaysInMonth(viewYear, viewMonth);
  const daysInPriorMonth = getDaysInPriorMonth();
  const startOffset = getFirstDayOfMonthOffset();

  // Generate matrix array of strings and numbers reflecting matching day targets
  const calendarCells: { dayNum: number; isCurrentMonth: boolean }[] = [];

  // Tail trailing items from prior month
  for (let i = startOffset - 1; i >= 0; i--) {
    calendarCells.push({ dayNum: daysInPriorMonth - i, isCurrentMonth: false });
  }
  // Load current active month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    calendarCells.push({ dayNum: i, isCurrentMonth: true });
  }
  // Pad tail items into next calendar sequence boundary grid
  const remainingGridCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingGridCells; i++) {
    calendarCells.push({ dayNum: i, isCurrentMonth: false });
  }

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleDateSelect = (dayNum: number) => {
    const freshDate = new Date(viewYear, viewMonth, dayNum);
    setSelectedDate(freshDate);
  };

  // Formatter utility matching your precise card format string header layout rule
  const formatDateHeaderString = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="w-full  mx-auto  bg-white rounded-[32px] border border-gray-100 font-roboto shadow-sm select-none relative">
      
      {/* Container Header */}
      <div className="">
        <h3 className="text-base md:text-lg font-bold text-gray-900  p-5 md:p-6 leading-5.5 m px-1 border-b border-gray-100 pb-4 ">Inspection Statistics</h3>
        
        {/* Toggle Trigger Selector Button */}
        <button 
          onClick={() => {
            setCurrentViewDate(new Date(selectedDate)); // Sync view back to targeted values
            setIsCalendarOpen(!isCalendarOpen);
          }}
          className="mt-3 flex items-center gap-1.5 text-primaryColor p-4 font-semibold text-sm transition-colors cursor-pointer hover:text-blue-700"
        >
          <span>{formatDateHeaderString(selectedDate)}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCalendarOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* --- RECHARTS SEMI-CIRCLE GAUGE ARC --- */}
      <div className="w-full h-[210px] relative flex justify-center items-center">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <Pie
        data={inspectionData}
        dataKey="value"
        cx="50%"
        cy="60%"
        startAngle={190}
        endAngle={-10}
        innerRadius="72%"
        outerRadius="95%"
        stroke="none"
        paddingAngle={3}
        cornerRadius={0}
      >
        {inspectionData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>

  <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center justify-center">
    <span className="text-sm font-normal text-gray-600 leading-5 ">
      Total Task
    </span>

    <span className="text-lg md:text-xl font-bold leading-6 text-gray-900 mt-1">
      {totalGaugeValue}
    </span>
  </div>
</div>

      {/* --- METRIC BREAKDOWN TABLE ROWS --- */}
      <div className=" rounded-2xl border border-gray-100 mx-4 mb-4 bg-white divide-y divide-gray-100">
        {inspectionData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3.5 text-sm font-normal leading-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-gray-600 font-normal">{item.name}</span>
            </div>
            <span className="text-gray-900 font-medium leading-5 text-sm">{item.value}</span>
          </div>
        ))}
      </div>

      {/* --- HIGH FIDELITY INTERACTIVE CALENDAR MODAL POPUP --- */}
      {isCalendarOpen && (
        <div 
          ref={modalRef} 
          className="absolute top-[90px] left-4 right-4 bg-white rounded-3xl border border-gray-100  p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Accent Header Badges */}
          <div className="flex flex-col gap-1 mb-4">
            <span className="inline-flex self-start bg-[#2388FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider">
              {selectedDate.getFullYear()}
            </span>
            <h4 className="text-base font-normal text-[#353E5C] mb-4">
              {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </h4>
          </div>

          {/* Calendar Control Pagination */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-semibold text-slate-700 tracking-tight">
              {monthsList[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1.5 rounded-lg text-[#353E5C] hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid Layout Headers mapping Days of Week */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-slate-400 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Individual Day Matrix Selection Nodes */}
          <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-semibold">
            {calendarCells.map((cell, index) => {
              const isCellTargetedSelected = 
                cell.isCurrentMonth && 
                selectedDate.getDate() === cell.dayNum && 
                selectedDate.getMonth() === viewMonth && 
                selectedDate.getFullYear() === viewYear;

              return (
                <button
                  key={index}
                  disabled={!cell.isCurrentMonth}
                  onClick={() => handleDateSelect(cell.dayNum)}
                  className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center transition-all ${
                    !cell.isCurrentMonth 
                      ? "text-gray-200 cursor-not-allowed "  
                      : isCellTargetedSelected
                        ? "bg-primaryColor text-white font-bold shadow-md shadow-blue-200 cursor-pointer" 
                        : "text-gray-700 hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  {cell.dayNum}
                </button>
              );
            })}
          </div>

          {/* Action Submission Trigger Toolbar Footer */}
          <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
            <button 
              onClick={() => setIsCalendarOpen(false)}
              className="w-full sm:w-auto bg-primaryColor hover:bg-blue-700 text-white font-bold text-sm py-2.5 px-6 rounded-xl shadow-lg shadow-blue-100 active:scale-[0.98] cursor-pointer transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      )}

    </div>
  );
}