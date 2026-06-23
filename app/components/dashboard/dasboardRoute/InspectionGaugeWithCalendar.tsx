/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";

// Format Date → "YYYY-MM-DD"
function toApiDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default function InspectionGaugeWithCalendar() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());

  // Applied date filter — only updates when user clicks "Apply"
  const [appliedDate, setAppliedDate] = useState<Date | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Build query params — if a date is applied, send from_date & to_date as same day
  const queryParams = appliedDate
    ? {
        from_date: toApiDate(appliedDate),
        to_date: toApiDate(appliedDate),
        range: "weekly",
      }
    : {
        from_date: undefined,
        to_date: undefined,
        range: "weekly",
      };

  const { data, isLoading, isFetching } = useGetOverviewQuery(queryParams as any);
  const circleChart = data?.data?.circle_chart;

  const inspectionData = [
    { name: "Assigned Inspection",  value: circleChart?.assigned_inspection  ?? 0, color: "#3550DC" },
    { name: "Pending Inspection",   value: circleChart?.started_inspection   ?? 0, color: "#FE9738" },
    { name: "Completed Inspection", value: circleChart?.completed_inspection ?? 0, color: "#01B664" },
  ];

  const totalGaugeValue = circleChart?.total_task ?? 0;
  const loading = isLoading || isFetching;

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar Logic
  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const monthsList = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const viewYear  = currentViewDate.getFullYear();
  const viewMonth = currentViewDate.getMonth();

  const getFirstDayOffset = () => {
    const d = new Date(viewYear, viewMonth, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPriorMonth   = new Date(viewYear, viewMonth, 0).getDate();
  const startOffset        = getFirstDayOffset();

  const calendarCells: { dayNum: number; isCurrentMonth: boolean }[] = [];
  for (let i = startOffset - 1; i >= 0; i--)
    calendarCells.push({ dayNum: daysInPriorMonth - i, isCurrentMonth: false });
  for (let i = 1; i <= daysInCurrentMonth; i++)
    calendarCells.push({ dayNum: i, isCurrentMonth: true });
  for (let i = 1; i <= 42 - calendarCells.length; i++)
    calendarCells.push({ dayNum: i, isCurrentMonth: false });

  const handlePrevMonth = () => setCurrentViewDate(new Date(viewYear, viewMonth - 1, 1));
  const handleNextMonth = () => setCurrentViewDate(new Date(viewYear, viewMonth + 1, 1));
  const handleDateSelect = (dayNum: number) => setSelectedDate(new Date(viewYear, viewMonth, dayNum));

  const handleApply = () => {
    setAppliedDate(new Date(selectedDate));
    setIsCalendarOpen(false);
  };

  const handleClear = () => {
    setAppliedDate(null);
    setSelectedDate(new Date());
    setIsCalendarOpen(false);
  };

  const formatDateHeader = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });

  const isApplied = appliedDate !== null;

  return (
    <div className="w-full mx-auto bg-white rounded-[20px] border border-gray-200 font-roboto hover:shadow-sm select-none relative">

      {/* Header */}
      <div>
        <h3 className="text-base md:text-lg font-bold text-gray-900 px-5 py-4 leading-5 border-b border-gray-100">
          Inspection Statistics
        </h3>

        <div className="flex items-center justify-between px-4 mt-3">
          <button
            onClick={() => {
              setCurrentViewDate(new Date(selectedDate));
              setIsCalendarOpen(!isCalendarOpen);
            }}
            className="flex items-center gap-1.5 text-primaryColor font-semibold text-sm transition-colors cursor-pointer hover:text-blue-700"
          >
            <span>
              {isApplied ? formatDateHeader(appliedDate!) : formatDateHeader(new Date())}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCalendarOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Clear filter badge */}
          {isApplied && (
            <button
              onClick={handleClear}
              className="text-[11px] font-semibold text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Gauge */}
      <div className="w-full h-[210px] relative flex justify-center items-center">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-[#3550DC] rounded-full animate-spin" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={inspectionData}
              dataKey="value"
              cx="50%"
              cy="60%"
              startAngle={190}
              endAngle={-10}
              innerRadius="60%"
              outerRadius="75%"
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
          <span className="text-sm font-normal text-gray-600 leading-5">Total Task</span>
          <span className="text-lg md:text-xl font-bold leading-6 text-gray-900 mt-1">
            {loading ? "—" : totalGaugeValue}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-2xl border border-gray-100 mx-4 mb-4 bg-white divide-y divide-gray-100">
        {inspectionData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3.5 text-sm font-normal leading-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="text-gray-900 font-medium text-sm">
              {loading ? "—" : item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Popup */}
      {isCalendarOpen && (
        <div
          ref={modalRef}
          className="absolute top-[90px] left-4 right-4 bg-white rounded-3xl border border-gray-100 p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex flex-col gap-1 mb-4">
            <span className="inline-flex self-start bg-[#2388FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider">
              {selectedDate.getFullYear()}
            </span>
            <h4 className="text-base font-normal text-[#353E5C] mb-4">
              {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </h4>
          </div>

          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-semibold text-slate-700 tracking-tight">
              {monthsList[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1.5 rounded-lg text-[#353E5C] hover:bg-gray-50 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-slate-400 mb-2">
            {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-semibold">
            {calendarCells.map((cell, index) => {
              const isSelected =
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
                      ? "text-gray-200 cursor-not-allowed"
                      : isSelected
                      ? "bg-primaryColor text-white font-bold shadow-md shadow-blue-200 cursor-pointer"
                      : "text-gray-700 hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  {cell.dayNum}
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              onClick={handleClear}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-primaryColor hover:bg-blue-700 text-white font-bold text-sm py-2.5 px-6 rounded-xl shadow-lg shadow-blue-100 active:scale-[0.98] cursor-pointer transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}