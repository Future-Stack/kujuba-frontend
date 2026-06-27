"use client";

import { useState } from "react";

export type PricingItem = {
  id: number;
  name: string;
  description: string;
  originalPrice?: number;
  price: number;
  disabled: boolean;
};

export default function PricingItemsList({
  initialItems,
}: {
  initialItems: PricingItem[];
}) {
  const [items, setItems] = useState<PricingItem[]>(initialItems);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleEditClick = (item: PricingItem) => {
    setEditingId(item.id);
    setEditValue(String(item.price));
   
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, originalPrice: item.price } : i
      )
    );
  };

  const handleSave = (id: number) => {
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed) && parsed >= 0) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, price: parsed, originalPrice: undefined } 
            : item
        )
      );
    }
    setEditingId(null);
  };

  const handleDisable = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, disabled: !item.disabled } : item
      )
    );
  };

  return (
    <div className="w-full max-w-4xl">
      <div className=" overflow-hidden space-y-4 ">
        {items.map((item) => {
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-y-4  border border-gray-100 rounded-xl px-5 py-4 bg-white transition-colors ${
                item.disabled ? "opacity-50" : ""
              }`}
            >
              {/* Left: name + desc */}
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-bold text-gray-900 leading-5 font-roboto mb-2.5 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-[#5C6470] font-normal leading-4 mt-0.5">{item.description}</p>
              </div>

              {/* Right: price + actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Price display / edit */}
                <div className="flex items-center border border-gray-100 rounded-[6px]">
                  {/* Left: original/old price - always show when originalPrice exists */}
                  {item.originalPrice && (
                    <span className="text-sm text-[#9CA3AF] bg-[#F5F6FA] rounded-l-[6px] px-3 py-2 line-through border-r border-gray-100">
                      ${item.originalPrice}
                    </span>
                  )}

                  {/* Right: editable new price */}
                  {isEditing ? (
                    <div className="flex items-center gap-0.5 px-2 py-1">
                      <span className="text-sm font-semibold text-[#111827]">$</span>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="w-16 text-sm font-semibold text-[#111827] focus:outline-none bg-transparent text-right"
                      />
                    </div>
                  ) : (
                    <span className="text-sm bg-[#F5F6FA] rounded-sm font-semibold text-[#111827] px-3 py-2">
                      ${item.price}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-4 min-w-[100px]">
                  {isEditing ? (
                    <button
                      onClick={() => handleSave(item.id)}
                      className="flex items-center justify-center gap-1.5 bg-[#22C55E] hover:bg-[#16a34a] text-white text-xs font-normal px-3 py-1.5 rounded-sm cursor-pointer transition-all duration-150 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <path d="M8.86667 2C9.1744 2.00501 9.46793 2.14878 9.68333 2.4L11.9 4.93333C12.1198 5.17951 12.2456 5.51497 12.25 5.86667V12.6667C12.25 13.0203 12.1271 13.3594 11.9083 13.6095C11.6895 13.8595 11.3928 14 11.0833 14H2.91667C2.60725 14 2.3105 13.8595 2.09171 13.6095C1.87292 13.3594 1.75 13.0203 1.75 12.6667V3.33333C1.75 2.97971 1.87292 2.64057 2.09171 2.39052C2.3105 2.14048 2.60725 2 2.91667 2H8.86667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.91732 14V9.33335C9.91732 9.15654 9.85586 8.98697 9.74646 8.86195C9.63707 8.73693 9.48869 8.66669 9.33398 8.66669H4.66732C4.51261 8.66669 4.36424 8.73693 4.25484 8.86195C4.14544 8.98697 4.08398 9.15654 4.08398 9.33335V14" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.08398 2V4.66667C4.08398 4.84348 4.14544 5.01305 4.25484 5.13807C4.36424 5.2631 4.51261 5.33333 4.66732 5.33333H8.75065" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(item)}
                      disabled={item.disabled}
                      className="flex items-center justify-center gap-1.5 bg-[#5B5EF4] hover:bg-[#4a4dd4] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-normal px-3 cursor-pointer py-1.5 rounded-sm transition-all duration-150 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7.58398 12.25H12.2507" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.3508 3.97366C12.6592 3.66533 12.8325 3.2471 12.8326 2.811C12.8326 2.37489 12.6594 1.95662 12.3511 1.64821C12.0428 1.33979 11.6245 1.1665 11.1884 1.16644C10.7523 1.16639 10.3341 1.33958 10.0256 1.64792L2.24048 9.43483C2.10504 9.56987 2.00488 9.73614 1.94881 9.919L1.17823 12.4577C1.16315 12.5081 1.16201 12.5617 1.17493 12.6127C1.18785 12.6638 1.21435 12.7104 1.25161 12.7476C1.28887 12.7848 1.33551 12.8112 1.38657 12.824C1.43763 12.8369 1.49122 12.8357 1.54164 12.8205L4.08089 12.0505C4.26358 11.9949 4.42983 11.8954 4.56506 11.7606L12.3508 3.97366Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit Price
                    </button>
                  )}

                  <button
                    onClick={() => handleDisable(item.id)}
                    className="flex items-center justify-center gap-1.5 text-[#EF4444] hover:bg-[#FEF2F2] bg-[#F8F9FF] text-xs font-semibold px-3 py-1.5 rounded-sm cursor-pointer transition-all duration-150 active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1.16602 1.16669L12.8327 12.8334" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4.87109 1.56917C5.92729 1.15665 7.08082 1.0609 8.19057 1.29363C9.30033 1.52636 10.3182 2.07748 11.1197 2.87957C11.9212 3.68167 12.4715 4.69996 12.7034 5.8099C12.9352 6.91984 12.8386 8.07329 12.4253 9.12917" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11.1309 11.13C10.5885 11.6724 9.94462 12.1026 9.236 12.3961C8.52737 12.6896 7.76787 12.8407 7.00086 12.8407C6.23385 12.8407 5.47434 12.6896 4.76572 12.3961C4.05709 12.1026 3.41322 11.6724 2.87086 11.13C2.3285 10.5876 1.89828 9.94376 1.60475 9.23514C1.31123 8.52651 1.16016 7.76701 1.16016 6.99999C1.16016 6.23298 1.31123 5.47348 1.60475 4.76485C1.89828 4.05623 2.3285 3.41235 2.87086 2.87" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item.disabled ? "Enable" : "Disable"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}