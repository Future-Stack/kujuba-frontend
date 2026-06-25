/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useGetOverviewQuery } from "@/app/redux/features/overviewApi";

function toApiDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default function InspectionGaugeWithCalendar() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);

  const [appliedStart, setAppliedStart] = useState<Date | null>(null);
  const [appliedEnd, setAppliedEnd] = useState<Date | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const queryParams =
    appliedStart && appliedEnd
      ? { start_date: toApiDate(appliedStart), end_date: toApiDate(appliedEnd), range: "weekly" }
      : { range: "weekly" };

  const { data, isLoading, isFetching } = useGetOverviewQuery(queryParams as any);
  const circleChart = data?.data?.circle_chart;

  const inspectionData = [
    { name: "Assigned Inspection",  value: circleChart?.assigned_inspection  ?? 0, color: "#3550DC" },
    { name: "Started Inspection",   value: circleChart?.started_inspection   ?? 0, color: "#FE9738" },
    { name: "Completed Inspection", value: circleChart?.completed_inspection ?? 0, color: "#01B664" },
  ];

  const totalGaugeValue = circleChart?.total_task ?? 0;
  const loading = isLoading || isFetching;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const monthsList = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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

  const handleDateClick = (dayNum: number) => {
    const clicked = new Date(viewYear, viewMonth, dayNum);
    if (selectingStart) {
      setStartDate(clicked);
      setEndDate(null);
      setSelectingStart(false);
    } else {
      if (startDate && clicked < startDate) {
        setEndDate(startDate);
        setStartDate(clicked);
      } else {
        setEndDate(clicked);
      }
      setSelectingStart(true);
    }
  };

  const isInRange = (dayNum: number) => {
    const cell = new Date(viewYear, viewMonth, dayNum);
    const end = endDate ?? hoverDate;
    if (!startDate || !end) return false;
    const [a, b] = startDate <= end ? [startDate, end] : [end, startDate];
    return cell > a && cell < b;
  };

  const isStart = (dayNum: number) =>
    startDate?.getDate() === dayNum &&
    startDate?.getMonth() === viewMonth &&
    startDate?.getFullYear() === viewYear;

  const isEnd = (dayNum: number) => {
    const end = endDate ?? (hoverDate && !selectingStart ? hoverDate : null);
    return end?.getDate() === dayNum &&
      end?.getMonth() === viewMonth &&
      end?.getFullYear() === viewYear;
  };

  const handleApply = () => {
    if (!startDate || !endDate) return;
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
    setIsCalendarOpen(false);
  };

  const handleClear = () => {
    setAppliedStart(null);
    setAppliedEnd(null);
    setStartDate(null);
    setEndDate(null);
    setSelectingStart(true);
    setIsCalendarOpen(false);
  };

  const formatShort = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const headerLabel = appliedStart && appliedEnd
    ? `${formatShort(appliedStart)} → ${formatShort(appliedEnd)}`
    : "Select Date Range";

  return (
    <div className="w-full mx-auto bg-white rounded-[20px] border border-gray-200 font-roboto hover:shadow-sm select-none relative">

      {/* Header */}
      <div>
        <h3 className="text-base md:text-lg font-bold text-gray-900 px-5 py-4 leading-5 border-b border-gray-100">
          Inspection Statistics
        </h3>

        <div className="flex items-center justify-between px-4 mt-3">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-1.5 text-primaryColor font-semibold text-sm transition-colors cursor-pointer hover:text-blue-700"
          >
            <span>{headerLabel}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCalendarOpen ? "rotate-180" : ""}`} />
          </button>

          {(appliedStart && appliedEnd) && (
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
            <Pie data={inspectionData} dataKey="value" cx="50%" cy="60%" startAngle={190} endAngle={-10} innerRadius="60%" outerRadius="75%" stroke="none" paddingAngle={3} cornerRadius={0}>
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
            <span className="text-gray-900 font-medium text-sm">{loading ? "—" : item.value}</span>
          </div>
        ))}
      </div>

      {/* Calendar Popup */}
      {isCalendarOpen && (
        <div
          ref={modalRef}
          className="absolute top-[90px] left-4 right-4 bg-white rounded-3xl border border-gray-100 p-5 shadow-2xl z-50"
        >
          {/* Selected range display */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex-1 text-center bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">Start Date</p>
              <p className="text-sm font-semibold text-gray-800">
                {startDate ? formatShort(startDate) : "—"}
              </p>
            </div>
            <span className="text-gray-300 font-bold">→</span>
            <div className="flex-1 text-center bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">End Date</p>
              <p className="text-sm font-semibold text-gray-800">
                {endDate ? formatShort(endDate) : "—"}
              </p>
            </div>
          </div>

          {/* Selecting hint */}
          <p className="text-[11px] text-center text-primaryColor font-medium mb-3">
            {selectingStart ? "Select start date" : "Select end date"}
          </p>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-700">{monthsList[viewMonth]} {viewYear}</span>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1.5 rounded-lg text-[#353E5C] hover:bg-gray-50 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-slate-400 mb-2">
            {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold">
            {calendarCells.map((cell, index) => {
              const inRange  = cell.isCurrentMonth && isInRange(cell.dayNum);
              const isS      = cell.isCurrentMonth && isStart(cell.dayNum);
              const isE      = cell.isCurrentMonth && isEnd(cell.dayNum);

              return (
              <button
  key={index}
  disabled={!cell.isCurrentMonth}
  onClick={() => handleDateClick(cell.dayNum)}
  onMouseEnter={() => {
    if (!selectingStart && cell.isCurrentMonth)
      setHoverDate(new Date(viewYear, viewMonth, cell.dayNum));
  }}
  onMouseLeave={() => setHoverDate(null)}
  className={`h-8 w-full flex items-center justify-center transition-all text-xs
    ${!cell.isCurrentMonth ? "text-gray-200 cursor-not-allowed" : ""}
    ${inRange ? "bg-blue-50 text-primaryColor" : ""}
    ${isS ? "bg-primaryColor text-white rounded-full cursor-pointer" : ""}
    ${isE ? "bg-primaryColor text-white rounded-full cursor-pointer" : ""}
    ${!isS && !isE && !inRange && cell.isCurrentMonth ? "text-gray-700 hover:bg-slate-50 hover:rounded-full cursor-pointer" : ""}
  `}
>
  {cell.dayNum}
</button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              onClick={handleClear}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className="flex-1 bg-primaryColor hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 px-6 rounded-xl shadow-lg shadow-blue-100 cursor-pointer transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}