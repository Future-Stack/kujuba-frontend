"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  minDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 288 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse initial view date
  const parseDate = (str: string): Date | null => {
    if (!str) return null;
    const parts = str.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    return null;
  };

  const selectedDate = parseDate(value);

  const [viewDate, setViewDate] = useState<Date>(() => selectedDate || new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  // Recalculate popup position relative to the trigger, in viewport coordinates
  // (position: fixed), so it always escapes any scrollable/overflow ancestor.
  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 288; // matches popover's w-72
    let left = rect.left;
    // Flip to the left edge of the trigger if it would overflow the right side of the viewport
    if (left + popoverWidth > window.innerWidth - 8) {
      left = Math.max(8, rect.right - popoverWidth);
    }
    setCoords({ top: rect.bottom + 8, left, width: rect.width });
  };

  // Compute coords BEFORE opening, so the popup never renders at (0,0) first
  // and then jumps into place — this is what caused the "lafano" flash.
  const openPicker = () => {
    updateCoords();
    setIsOpen(true);
  };

  const closePicker = () => {
    setIsOpen(false);
    setShowYearPicker(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onScrollOrResize = () => updateCoords();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [isOpen]);

  // Close on outside click — must check both the trigger AND the portaled popover,
  // since the popover no longer lives inside containerRef in the DOM tree.
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        closePicker();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateStr = `${viewYear}-${mm}-${dd}`;
    onChange(dateStr);
    closePicker();
  };

  const formatDisplay = (str: string) => {
    const d = parseDate(str);
    if (!d) return "";
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
  };

  // Generate days in calendar month
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const yearsRange = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - 5 + i);

  const popover = isOpen && (
    <div
      ref={popoverRef}
      style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 9999 }}
      className="bg-white border border-[#E7E8FF] rounded-2xl shadow-xl p-4 w-72 font-roboto select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => setShowYearPicker(!showYearPicker)}
          className="font-sora font-semibold text-sm text-gray-800 hover:text-primaryColor transition-colors flex items-center gap-1 cursor-pointer"
        >
          {MONTH_NAMES[viewMonth]} {viewYear}
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {showYearPicker ? (
        /* Year / Month Quick Picker Grid */
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto py-2 pr-1">
          {yearsRange.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => {
                setViewDate(new Date(yr, viewMonth, 1));
                setShowYearPicker(false);
              }}
              className={`py-1.5 px-2 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                yr === viewYear
                  ? "bg-primaryColor text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-primaryColor/10 hover:text-primaryColor"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      ) : (
        /* Calendar Days Grid */
        <>
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((day) => (
              <span key={day} className="text-[11px] font-semibold text-gray-400 py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Prev month offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
              return (
                <span
                  key={`prev-${i}`}
                  className="text-xs text-gray-300 py-2 flex items-center justify-center pointer-events-none"
                >
                  {dayNum}
                </span>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getDate() === day;

              const isToday =
                new Date().getFullYear() === viewYear &&
                new Date().getMonth() === viewMonth &&
                new Date().getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`text-xs font-medium py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? "bg-primaryColor text-white shadow-xs font-bold"
                      : isToday
                      ? "bg-primaryColor/10 text-primaryColor border border-primaryColor/30 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-primaryColor"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Quick Actions Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-xs font-medium">
        <button
          type="button"
          onClick={() => {
            const today = new Date();
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const dd = String(today.getDate()).padStart(2, "0");
            onChange(`${today.getFullYear()}-${mm}-${dd}`);
            closePicker();
          }}
          className="text-primaryColor hover:underline cursor-pointer"
        >
          Today
        </button>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              closePicker();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Display Button */}
      <div
        ref={triggerRef}
        onClick={() => (isOpen ? closePicker() : openPicker())}
        className="w-full border border-[#E7E8FF] text-gray-700 bg-white rounded-[10px] px-4 py-3 text-sm font-roboto flex items-center justify-between cursor-pointer hover:border-primaryColor focus:border-primaryColor transition-all select-none"
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-primaryColor shrink-0" />
      </div>

      {mounted && popover && createPortal(popover, document.body)}
    </div>
  );
}