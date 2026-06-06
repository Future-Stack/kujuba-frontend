"use client";

import { useState } from "react";

export default function PlatformSettings() {
  const [autoApprove, setAutoApprove] = useState(false);

  const [form, setForm] = useState({
    platformName: "CONNECT TO INSPECT",
    supportEmail: "support@inspecthub.com",
    maxInspectors: "25",
    inspectorResponseTime: "30",
    urgentBookingLeadTime: "4",
    reportDeadline: "48",
    commissionRate: "20",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full border border-[#F3F4F6] rounded-[12px] py-[25px] px-[23px]">
      <h2 className="text-sm font-semibold text-[#111827] font-sora leading-5 mb-5">
        Platform Configuration
      </h2>

      <div className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Platform Name">
            <Input name="platformName" value={form.platformName} onChange={handleChange} />
          </Field>
          <Field label="Support Email">
            <Input name="supportEmail" value={form.supportEmail} onChange={handleChange} type="email" />
          </Field>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Max Inspectors Per Area">
            <Input name="maxInspectors" value={form.maxInspectors} onChange={handleChange} type="number" />
          </Field>
          <Field label="Inspector Response Time (min)">
            <Input name="inspectorResponseTime" value={form.inspectorResponseTime} onChange={handleChange} type="number" />
          </Field>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Urgent Booking Lead Time (hr)">
            <Input name="urgentBookingLeadTime" value={form.urgentBookingLeadTime} onChange={handleChange} type="number" />
          </Field>
          <Field label="Report Deadline (hours)">
            <Input name="reportDeadline" value={form.reportDeadline} onChange={handleChange} type="number" />
          </Field>
        </div>

        {/* Row 4 — half width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Platform Commission Rate (%)">
            <Input name="commissionRate" value={form.commissionRate} onChange={handleChange} type="number" />
          </Field>
        </div>

        {/* Auto-approve toggle */}
        <div className="flex items-center justify-between bg-[#F0F1FF] rounded-[10px] px-5 py-4 mt-7">
          <div>
            <p className="text-sm font-medium text-[#1F2937] font-roboto leading-5">
              Auto-approve new inspector applications
            </p>
            <p className="text-xs text-[#9CA3AF] font-normal leading-4 font-normal mt-0.5">
              Skip manual review for inspectors who meet all criteria
            </p>
          </div>
          <button
            onClick={() => setAutoApprove(!autoApprove)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer flex-shrink-0 ${
              autoApprove ? "bg-[#5B5EF4]" : "bg-[#D1D5DB]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                autoApprove ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button className="bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] text-white text-sm font-semibold font-roboto px-6 py-2.5 rounded-lg transition-all cursor-pointer duration-200">
            Save Platform Settings
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Field wrapper ─── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-[#6B7280] font-roboto leading-4 font-semibold mb-0.5">{label}</label>
      {children}
    </div>
  );
}

/* ─── Input ─── */
function Input({
  name,
  value,
  onChange,
  type = "text",
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#1F2937] font-medium font-roboto leading-5 bg-white
        focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4]
        hover:border-[#C4C6F1] transition-all duration-150 w-full"
    />
  );
}