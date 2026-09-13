"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { X, Mail, Send } from "lucide-react";
import { toast } from "react-toastify";
import { useSendClientReportEmailMutation } from "@/app/redux/features/clientReportApi";

type SendEmailModalProps = {
  open: boolean;
  onClose: () => void;
  clientId?: number | string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  defaultEmail?: string;
};

export default function SendEmailModal({
  open,
  onClose,
  clientId,
  frequency,
  startDate,
  endDate,
  status = "all",
  defaultEmail = "",
}: SendEmailModalProps) {
  const [emailOverride, setEmailOverride] = useState(defaultEmail);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sendEmail, { isLoading }] = useSendClientReportEmailMutation();

  useEffect(() => {
    if (open) {
      setEmailOverride(defaultEmail);
    }
  }, [open, defaultEmail]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOverride.trim()) {
      toast.error("Please enter a recipient email address");
      return;
    }

    try {
      const res = await sendEmail({
        client_id: clientId ? Number(clientId) : undefined,
        frequency,
        start_date: startDate,
        end_date: endDate,
        status,
        email_override: emailOverride.trim(),
      }).unwrap();

      toast.success(res?.message || "Client report email sent successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send report email");
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-roboto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-sora font-bold text-gray-900">
              Email Client Report
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="text-xs text-gray-500 mb-4">
            Send the generated inspection summary report PDF to the client or enter a custom email override recipient.
          </p>

          <div className="mb-5">
            <label className="block text-xs font-semibold font-sora text-gray-700 mb-1.5">
              Recipient Email Address *
            </label>
            <input
              type="email"
              value={emailOverride}
              onChange={(e) => setEmailOverride(e.target.value)}
              placeholder="e.g. client@gmail.com"
              className="w-full border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 transition-colors"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isLoading ? "Sending..." : "Send Email"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
