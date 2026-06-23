"use client";

import { Delete, Edit, Trash } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FAQCardProps {
  faq: FAQ;
  index: number;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
}

export default function FAQCard({ faq, index, onEdit, onDelete }: FAQCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const createdDate = new Date(faq.createdAt);
const updatedDate = new Date(faq.updatedAt);

const isUpdated =
  createdDate.getTime() !== updatedDate.getTime();

const displayDate = new Date(
  isUpdated ? faq.updatedAt : faq.createdAt
).toLocaleString("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedDate = new Date(faq.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl border border-[#EEEEEEEE] hover:shadow-md transition-shadow duration-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-normal text-[#090909] leading-snug flex-1">
          <span className="text-[#4f46e5] mr-1">{index}.</span>{" "}
          {faq.question}
        </p>

        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f3f4f6] cursor-pointer text-[#6b7280] hover:text-[#1a1d23] transition-colors"
            aria-label="More options"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-[#e2e5eb] rounded-lg shadow-lg z-50 py-1">
              <button
                onClick={() => { setDropdownOpen(false); onEdit(faq); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-[#374151] hover:bg-[#f9fafb] transition-colors cursor-pointer"
              >
             <Edit size={16} className=""/>
                Edit
              </button>
              <button
                onClick={() => { setDropdownOpen(false); onDelete(faq.id); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-[#ef4444] hover:bg-[#fef2f2] transition-colors cursor-pointer"
              >
            <Trash size={16} className=""/>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-base text-[#090909] leading-5.5 font-normal">
       Ans : 
        {faq.answer}
      </p>

     <p className="mt-4 text-[10px] text-gray-500 font-roboto font-normal leading-5 text-right">
  {isUpdated ? "Updated" : "Published"} {displayDate}
</p>
    </div>
  );
}