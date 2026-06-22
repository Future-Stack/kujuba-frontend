/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RescheduleEntry {
  date: string;
  reason: string;
}

interface PaymentData {
  inspection_fee?: string | number;
  urgent_fee?: string | number;
  platform_commission?: string | number;
  inspector_payout?: string | number;
  method?: string;
  status?: string;
  paid_on?: string | null;
}

interface Props {
  category?: string | null;
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  notes?: string | null;
  rescheduleHistory?: any;
  payment?: PaymentData | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function money(v?: string | number | null) {
  if (v === null || v === undefined || v === "") return "0.00";
  const n = typeof v === "number" ? v : parseFloat(v);
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // already a formatted string like "June 21, 2026"
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// reschedule_history is typed `any` on the backend — handle a few likely field names defensively
function getRescheduleEntries(history: any): RescheduleEntry[] {
  if (!history || !Array.isArray(history)) return [];
  return history.map((h: any) => ({
    date: h.date ?? h.rescheduled_date ?? h.new_date ?? h.timestamp ?? "—",
    reason: h.reason ?? h.note ?? h.message ?? "—",
  }));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InspectionPayment({
  category,
  scheduledDate,
  scheduledTime,
  notes,
  rescheduleHistory,
  payment,
}: Props) {
  const rescheduleEntries = getRescheduleEntries(rescheduleHistory);

  const inspectionFee = money(payment?.inspection_fee);
  const urgentFee = money(payment?.urgent_fee);
  const commission = money(payment?.platform_commission);
  const payout = money(payment?.inspector_payout);
  const method = payment?.method || "—";
  const status = payment?.status || "—";
  const isPaid = status.toLowerCase() === "paid";

  return (
    <div className="antialiased selection:bg-indigo-100">
      <div className=" space-y-6">

        {/* --- SECTION 1: INSPECTION DETAILS --- */}
        <section className="bg-white border border-[#F3F4F6] rounded-[16px] p-5 md:p-6 ">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5007 1.66675H5.00065C4.55862 1.66675 4.1347 1.84234 3.82214 2.1549C3.50958 2.46746 3.33398 2.89139 3.33398 3.33341V16.6667C3.33398 17.1088 3.50958 17.5327 3.82214 17.8453C4.1347 18.1578 4.55862 18.3334 5.00065 18.3334H15.0007C15.4427 18.3334 15.8666 18.1578 16.1792 17.8453C16.4917 17.5327 16.6673 17.1088 16.6673 16.6667V5.83341L12.5007 1.66675Z" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.666 1.66675V5.00008C11.666 5.44211 11.8416 5.86603 12.1542 6.17859C12.4667 6.49115 12.8907 6.66675 13.3327 6.66675H16.666" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.33268 7.5H6.66602" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.3327 10.8333H6.66602" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.3327 14.1667H6.66602" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-lg font-semibold text-slate-900 font-sora tracking-tight">Inspection Details</h2>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            {/* Category */}
            <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl items-start gap-3">
              <div className="mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5007 1.66675H5.00065C4.55862 1.66675 4.1347 1.84234 3.82214 2.1549C3.50958 2.46746 3.33398 2.89139 3.33398 3.33341V16.6667C3.33398 17.1088 3.50958 17.5327 3.82214 17.8453C4.1347 18.1578 4.55862 18.3334 5.00065 18.3334H15.0007C15.4427 18.3334 15.8666 18.1578 16.1792 17.8453C16.4917 17.5327 16.6673 17.1088 16.6673 16.6667V5.83341L12.5007 1.66675Z" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.666 1.66675V5.00008C11.666 5.44211 11.8416 5.86603 12.1542 6.17859C12.4667 6.49115 12.8907 6.66675 13.3327 6.66675H16.666" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.33268 7.5H6.66602" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.3327 10.8333H6.66602" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.3327 14.1667H6.66602" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-normal text-[#6A7282] font-roboto leading-4 block mb-1">Category</span>
                <span className="text-sm font-medium leading-5 text-[#101828] font-roboto">{category || "—"}</span>
              </div>
            </div>

            {/* Scheduled Date */}
            <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl items-start gap-3">
              <div className="mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6.66602 1.66675V5.00008" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.334 1.66675V5.00008" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.8333 3.33325H4.16667C3.24619 3.33325 2.5 4.07944 2.5 4.99992V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99992C17.5 4.07944 16.7538 3.33325 15.8333 3.33325Z" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.5 8.33325H17.5" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-normal text-[#6A7282] font-roboto leading-4 block mb-1">Scheduled Date</span>
                <span className="text-sm font-medium leading-5 text-[#101828] font-roboto">{formatDate(scheduledDate)}</span>
              </div>
            </div>

            {/* Scheduled Time */}
            <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl items-start gap-3">
              <div className="mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M9.99935 18.3334C14.6017 18.3334 18.3327 14.6025 18.3327 10.0001C18.3327 5.39771 14.6017 1.66675 9.99935 1.66675C5.39698 1.66675 1.66602 5.39771 1.66602 10.0001C1.66602 14.6025 5.39698 18.3334 9.99935 18.3334Z" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 5V10L13.3333 11.6667" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-normal text-[#6A7282] font-roboto leading-4 block mb-1">Scheduled Time</span>
                <span className="text-sm font-medium leading-5 text-[#101828] font-roboto">{scheduledTime || "—"}</span>
              </div>
            </div>
          </div>

          {/* Inspection Notes */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#364153] leading-6 mb-2">Inspection Notes</h3>
            <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl text-sm text-[#6A7282] leading-relaxed">
              {notes && notes.trim() ? notes : "No notes provided."}
            </div>
          </div>

          {/* Reschedule History — only render if there actually is some */}
          {rescheduleEntries.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.67737 2.00631 11.2874 2.66082 12.4933 3.82667L14 5.33333" stroke="#364153" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.9993 2V5.33333H10.666" stroke="#364153" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14C6.32263 13.9937 4.71265 13.3392 3.50667 12.1733L2 10.6667" stroke="#364153" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.33333 10.6667H2V14.0001" stroke="#364153" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="text-sm font-medium text-[#364153] leading-6">Reschedule History</h3>
              </div>
              <div className="space-y-2">
                {rescheduleEntries.map((history, idx) => (
                  <div key={idx} className="bg-[#FFF7ED] font-normal border border-[#FFEDD4] rounded-xl p-3 text-sm">
                    <span className="font-medium text-[#CA3500]">{history.date}</span>
                    <span className="text-slate-400 mx-2">-</span>
                    <span className="text-[#4A5565]">{history.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* --- SECTION 2: PAYMENT INFORMATION --- */}
        <section className="bg-white border border-[#F3F4F6] rounded-[16px] p-5 md:p-6 ">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.666 4.16675H3.33268C2.41221 4.16675 1.66602 4.91294 1.66602 5.83341V14.1667C1.66602 15.0872 2.41221 15.8334 3.33268 15.8334H16.666C17.5865 15.8334 18.3327 15.0872 18.3327 14.1667V5.83341C18.3327 4.91294 17.5865 4.16675 16.666 4.16675Z" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.66602 8.33325H18.3327" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-lg font-semibold text-slate-900 font-sora tracking-tight">Payment Information</h2>
          </div>

          {/* Content Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Financial Ledger (Left Side) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm ">
                <span className="text-[#4A5565] font-normal leading-5 font-roboto">Inspection Fee</span>
                <span className="font-medium leading-6 text-[#101828] text-base">${inspectionFee}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                <span className="text-[#4A5565] font-normal leading-5 font-roboto">Urgent Fee</span>
                <span className="font-medium leading-6 text-[#101828] text-base">+${urgentFee}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                <span className="text-[#4A5565] font-normal leading-5 font-roboto">Platform Commission</span>
                <span className="font-medium leading-6 text-[#101828] text-base">-${commission}</span>
              </div>

              {/* Inspector Payout Box */}
              <div className="bg-[#F0FDF4] border border-[#B9F8CF] rounded-xl p-4 flex justify-between items-center mt-6">
                <span className="text-[#008236] font-medium leading-5 font-roboto text-sm">Inspector Payout</span>
                <span className="text-[#008236] font-semibold text-base leading-6 font-roboto">${payout}</span>
              </div>
            </div>

            {/* Metadata (Right Side) */}
            <div className="lg:col-span-5 space-y-5 lg:pl-6 ">

              {/* Payment Method */}
              <div className="flex items-start gap-3">
                <div className="text-slate-400 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clipPath="url(#clip0_1715_2403)">
                      <path d="M13.334 3.33325H2.66732C1.93094 3.33325 1.33398 3.93021 1.33398 4.66659V11.3333C1.33398 12.0696 1.93094 12.6666 2.66732 12.6666H13.334C14.0704 12.6666 14.6673 12.0696 14.6673 11.3333V4.66659C14.6673 3.93021 14.0704 3.33325 13.334 3.33325Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1.33398 6.66675H14.6673" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1715_2403">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-normal text-[#6A7282] leading-4 font-roboto block mb-0.5">Payment Method</span>
                  <span className="text-sm font-medium text-[#101828] leading-5 font-roboto">{method}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <span className="text-sm font-medium text-[#4A5565] font-roboto leading-5 block mb-2">Payment Status</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
                  isPaid
                    ? 'bg-[#F0FDF4] border border-[#B9F8CF] text-[#008236]'
                    : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              {/* Paid On Date */}
              <div className="flex items-start gap-3">
                <div className="text-slate-400 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.33398 1.33325V3.99992" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.666 1.33325V3.99992" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 6.66675H14" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-normal text-[#6A7282] leading-4 font-roboto block mb-0.5">Paid On</span>
                  <span className="text-sm font-medium text-[#101828] leading-5 font-roboto">{formatDate(payment?.paid_on)}</span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

