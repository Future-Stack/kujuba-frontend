/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAllNotificationsQuery, useSendNotificationMutation } from "@/app/redux/features/notificationApi";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type NotificationType =
  | "Announcement"
  | "Approval"
  | "Alert"
  | "Cancellation"
  | "Update";

type Recipient =
  | "All Users"
  | "All Inspectors"
  | "All Homeowners";

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
  "All Homeowners",
];

const recipientLabels = {
  all_users: "All Users",
  all_inspectors: "All Inspectors",
  all_homeowners: "All Homeowners",
};
export default function NotificationCenter() {
const { data, isLoading, refetch } = useGetAllNotificationsQuery(undefined);

const notifications =
  data?.data?.map((item: any) => ({
    id: item.id,
    title: item.title,
    message: item.message,
    type: item.type,
    recipients: item.recipients,
    recipientLabel: item.sent_to,
    sentAt: item.sent_at,
    status: item.status,
  })) || [];
  const [sendNotification, { isLoading: sending }] =
  useSendNotificationMutation();

  const [notifType, setNotifType] = useState<NotificationType>("Announcement");
 const [sendTo, setSendTo] = useState<Recipient>("All Users");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  // const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; message?: string }>({});
  const [isTypeOpen, setIsTypeOpen] = useState(false);

const [openRecipient, setOpenRecipient] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

  function validate() {
    const e: { title?: string; message?: string } = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!message.trim()) e.message = "Message is required.";
    return e;
  }

const handleSend = async () => {
  try {

const recipientMap: Record<Recipient, string> = {
  "All Users": "all_users",
  "All Inspectors": "all_inspectors",
  "All Homeowners": "all_homeowners",
};

const payload = {
  type: notifType.toLowerCase(),
  title,
  message,
  send_to: recipientMap[sendTo],
};
    console.log("Sending payload:", payload);

    const res = await sendNotification(payload).unwrap();

    console.log("Response:", res);

    toast.success("Notification sent successfully");
    refetch()
  } catch (error) {
    console.error("Send error:", error);
    toast.error("Failed to send notification");
  }
};


const totalPages = Math.ceil(notifications.length / itemsPerPage);

const paginatedNotifications = notifications.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  return (
    <div className="min-h-screen  font-roboto">
  

      <main className="">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT: Compose Panel */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white rounded-[5px]  border border-gray-100 hover:shadow-sm p-6">
              <h2 className="text-xl md:text-2xl leading-7 font-bold text-gray-900 mb-6">Compose Notification</h2>

              <div className="space-y-4">
                {/* Notification Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">Notification Type</label>
               <div className="relative">
  <button
    onClick={() => setIsTypeOpen(!isTypeOpen)}
    className="w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 cursor-pointer " 
  >
    <span>{notifType}</span>
    <ChevronDown className="w-4 h-4" />
  </button>

  {isTypeOpen && (
    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 text-gray-900 rounded-lg cursor-pointer shadow-lg z-50">
      {NOTIFICATION_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => {
            setNotifType(type);
            setIsTypeOpen(false);
          }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
        >
          {type}
        </button>
      ))}
    </div>
  )}
</div>
                </div>

                {/* Send To */}
                <div>
  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">
    Send To
  </label>

  <div className="relative">
    <button
      type="button"
      onClick={() => setOpenRecipient(!openRecipient)}
      className="w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 cursor-pointer text-sm text-gray-900"
    >
      <span>{sendTo}</span>

      <ChevronDown
        className={`w-4 h-4 transition-transform ${
          openRecipient ? "rotate-180" : ""
        }`}
      />
    </button>

    {openRecipient && (
      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 text-gray-900  rounded-lg shadow-lg z-50 overflow-hidden">
        {RECIPIENTS.map((recipient) => (
          <button
            key={recipient}
            type="button"
            onClick={() => {
              setSendTo(recipient);
              setOpenRecipient(false);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {recipient}
          </button>
        ))}
      </div>
    )}
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
            <div className="bg-white rounded-md  border border-gray-200 hover:shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#111827] font-sora leading-5">Sent Notifications</h2>
                <span className="text-xs text-gray-400 font-medium">{notifications.length} total</span>
              </div>

              <div className="divide-y divide-gray-100">
                {notifications.length === 0 && (
                  <div className="py-16 text-center text-sm text-gray-400">No notifications yet.</div>
                )}
                {paginatedNotifications.map((n:any) => (
                  <NotificationRow key={n.id} notification={n} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {notifications.length > 0 && (
  <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
<button
  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  disabled={currentPage === 1}
  className={`px-3 py-1 border rounded transition ${
    currentPage === 1
      ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
      : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
  }`}
>
  Previous
</button>

    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-3 py-1 rounded  cursor-pointer ${
          currentPage === index + 1
            ? "bg-blue-600 text-white"
            : "border border-primaryColor text-gray-500"
        }`}
      >
        {index + 1}
      </button>
    ))}

<button
  onClick={() =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }
  disabled={currentPage === totalPages}
  className={`px-3 py-1 border rounded transition ${
    currentPage === totalPages
      ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
      : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
  }`}
>
  Next
</button>
  </div>
)}
      </main>
    </div>
  );
}

function NotificationRow({ notification: n }: { notification: Notification }) {
  const normalizedType =
    n.type?.charAt(0).toUpperCase() +
    n.type?.slice(1).toLowerCase();

  const style =
    TYPE_STYLES[normalizedType as NotificationType] ||
    TYPE_STYLES.Announcement;

  return (
    <div className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors group">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Dot icon */}
        <div className={`mt-1 w-9 h-9 rounded-md shrink-0 ${style.dot}`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-[#111827] leading-5">
              {n.title}
            </p>

            <span
              className={`shrink-0 text-xs font-semibold leading-4 px-2 py-0.5 rounded-full ${style.badge}`}
            >
              {normalizedType}
            </span>
          </div>

          <p className="text-xs text-[#6B7280] font-normal leading-relaxed line-clamp-2 mb-2">
            {n.message}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#9CA3AF] font-normal">
            <span className="flex items-center gap-1">
              {Number(n.recipients || 0).toLocaleString()}{" "}
              {Number(n.recipients || 0) === 1
                ? "recipient"
                : "recipients"}
            </span>

            <span>{n.sentAt}</span>

            <span className="text-[#9CA3AF]">
              {n.recipientLabel}
            </span>

            <span className="ml-auto text-green-500 font-medium">
              {n.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}