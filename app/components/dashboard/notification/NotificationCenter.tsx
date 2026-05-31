"use client";

import { useState } from "react";

type NotificationType =
  | "Announcement"
  | "Approval"
  | "Alert"
  | "Cancellation"
  | "Update";

type Recipient = "All Users" | "All Inspectors" | "Active Inspectors (Miami)" | "Marcus Johnson" | "Patricia Williams";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipients: number;
  recipientLabel: string;
  sentAt: string;
  status: "delivered" | "pending" | "failed";
}

const TYPE_STYLES: Record<NotificationType, { badge: string; dot: string }> = {
  Announcement: { badge: "bg-[#5E65FF1A] text-[#5E65FF] ", dot: "bg-[#5E65FF1A]" },
  Approval: { badge: "bg-[#ECFDF5] text-[#059669] ", dot: "bg-[#ECFDF5]" },
  Alert: { badge: "bg-[#FFFBEB] text-[#D97706] ", dot: "bg-[#FFFBEB]" },
  Cancellation: { badge: "bg-[#FEF2F2] text-[#EF4444] ", dot: "bg-[#FEF2F2]" },
  Update: { badge: "bg-[#5E65FF1A] text-[#5E65FF] ", dot: "bg-[#5E65FF1A]"  },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Platform Maintenance Scheduled",
    message:
      "InspectHub will undergo scheduled maintenance on May 20, 2026 from 2:00 AM – 4:00 AM EST. All services will be temporarily unavailable during this time.",
    type: "Announcement",
    recipients: 3847,
    recipientLabel: "All Users",
    sentAt: "2026-05-15 09:00 AM",
    status: "delivered",
  },
  {
    id: "2",
    title: "Inspector Application Approved",
    message:
      "Congratulations! Your Inspector application has been reviewed and approved. You can now start accepting inspection requests on InspectHub.",
    type: "Approval",
    recipients: 1,
    recipientLabel: "Marcus Johnson",
    sentAt: "2026-05-14 03:22 PM",
    status: "delivered",
  },
  {
    id: "3",
    title: "Urgent Inspection Assigned",
    message:
      "An urgent inspection has been assigned to you at 55 Harbor Lane, Fort Lauderdale. Please confirm your availability within 30 minutes.",
    type: "Alert",
    recipients: 12,
    recipientLabel: "Active Inspectors (Miami)",
    sentAt: "2026-05-15 11:45 AM",
    status: "delivered",
  },
  {
    id: "4",
    title: "Booking Cancellation Notice",
    message:
      "Booking #BK-2043 for 403 Brickell Ave has been cancelled by the homeowner. A cancellation fee has been processed as per platform policy.",
    type: "Cancellation",
    recipients: 1,
    recipientLabel: "Patricia Williams",
    sentAt: "2026-05-13 09:15 AM",
    status: "delivered",
  },
  {
    id: "5",
    title: "New Pricing Policy Effective June 1",
    message:
      "Updated inspection pricing takes effect on June 1, 2026. Four Point Inspections: $280. Roof: $240. Wind Mitigation: $195. Please review the updated fee schedule.",
    type: "Update",
    recipients: 218,
    recipientLabel: "All Inspectors",
    sentAt: "2026-05-10 10:00 AM",
    status: "delivered",
  },
];

const NOTIFICATION_TYPES: NotificationType[] = [
  "Announcement",
  "Approval",
  "Alert",
  "Cancellation",
  "Update",
];

const RECIPIENTS: Recipient[] = [
  "All Users",
  "All Inspectors",
  "Active Inspectors (Miami)",
  "Marcus Johnson",
  "Patricia Williams",
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [notifType, setNotifType] = useState<NotificationType>("Announcement");
  const [sendTo, setSendTo] = useState<Recipient>("All Users");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; message?: string }>({});

  function validate() {
    const e: { title?: string; message?: string } = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!message.trim()) e.message = "Message is required.";
    return e;
  }

  async function handleSend() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));

    const recipientCount =
      sendTo === "All Users"
        ? Math.floor(Math.random() * 4000) + 500
        : sendTo === "All Inspectors"
        ? Math.floor(Math.random() * 300) + 50
        : sendTo.startsWith("Active")
        ? Math.floor(Math.random() * 30) + 5
        : 1;

    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type: notifType,
      recipients: recipientCount,
      recipientLabel: sendTo,
      sentAt: formatted,
      status: "delivered",
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setTitle("");
    setMessage("");
    setSending(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="min-h-screen  font-roboto">
  

      <main className="">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT: Compose Panel */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white rounded-2xl  border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl md:text-2xl leading-7 font-bold text-gray-900 mb-6">Compose Notification</h2>

              <div className="space-y-4">
                {/* Notification Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">Notification Type</label>
                  <div className="relative">
                    <select
                      value={notifType}
                      onChange={(e) => setNotifType(e.target.value as NotificationType)}
                      className="w-full appearance-none rounded-lg border border-gray-100 bg-white px-3 py-2.5 text-sm text-gray-900 pr-9 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition cursor-pointer"
                    >
                      {NOTIFICATION_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Send To */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">Send To</label>
                  <div className="relative">
                    <select
                      value={sendTo}
                      onChange={(e) => setSendTo(e.target.value as Recipient)}
                      className="w-full appearance-none rounded-lg border border-gray-100 bg-white px-3 py-2.5 text-sm text-gray-900 pr-9 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition cursor-pointer"
                    >
                      {RECIPIENTS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
                    placeholder="Notification Title..."
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 transition ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-gray-400"}`}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: undefined })); }}
                    rows={5}
                    placeholder="Write your notification message here..."
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 transition resize-none ${errors.message ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-gray-400"}`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                {/* Success */}
                {success && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 text-sm text-green-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Notification sent successfully!
                  </div>
                )}

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Sent Notifications */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#111827] font-sora leading-5">Sent Notifications</h2>
                <span className="text-xs text-gray-400 font-medium">{notifications.length} total</span>
              </div>

              <div className="divide-y divide-gray-100">
                {notifications.length === 0 && (
                  <div className="py-16 text-center text-sm text-gray-400">No notifications yet.</div>
                )}
                {notifications.map((n) => (
                  <NotificationRow key={n.id} notification={n} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NotificationRow({ notification: n }: { notification: Notification }) {
  const style = TYPE_STYLES[n.type];
  return (
    <div className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors group">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Dot icon */}
        <div className={`mt-1 w-9 h-9 rounded-md shrink-0 ${style.dot}`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-[#111827] leading-5">{n.title}</p>
            <span className={`shrink-0 text-xs font-semibold leading-4 px-2 py-0.5 rounded-full ${style.badge}`}>{n.type}</span>
          </div>
          <p className="text-xs text-[#6B7280] font-normal leading-relaxed line-clamp-2 mb-2">{n.message}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#9CA3AF] font-normal">
            <span className="flex items-center gap-1">
         
              {n.recipients.toLocaleString()} {n.recipients === 1 ? "recipient" : "recipients"}
            </span>
           
            <span>{n.sentAt}</span>
            
            <span className="text-[#9CA3AF]">{n.recipientLabel}</span>
            <span className="ml-auto text-green-500 font-medium">{n.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}