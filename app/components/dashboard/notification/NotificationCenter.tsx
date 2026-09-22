/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetAllNotificationsQuery,
  useGetAdminNotificationsQuery,
  useSendNotificationMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useMarkAsUnreadMutation,
} from "@/app/redux/features/notificationApi";
import { ChevronDown, CheckCheck, Check, MailOpen, Mail } from "lucide-react";
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
  Update: { badge: "bg-[#5E65FF1A] text-[#5E65FF] ", dot: "bg-[#5E65FF1A]" },
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

function getPaginationRange(current: number, total: number) {
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== undefined) {
      if (typeof i === "number" && i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (typeof i === "number" && i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    if (typeof i === "number") {
      l = i;
    }
  }

  return rangeWithDots;
}

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<"sent" | "admin">("sent");

  // Sent notifications query
  const { data: sentData, refetch: refetchSent } = useGetAllNotificationsQuery(undefined);
  const notifications =
    sentData?.data?.map((item: any) => ({
      id: item.id,
      title: item.title,
      message: item.message,
      type: item.type,
      recipients: item.recipients,
      recipientLabel: item.sent_to,
      sentAt: item.sent_at,
      status: item.status,
    })) || [];

  // Admin notifications query
  const { data: adminData } = useGetAdminNotificationsQuery();
  const adminNotifications = adminData?.data || [];

  // Mutations
  const [sendNotification, { isLoading: sending }] = useSendNotificationMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAsUnread] = useMarkAsUnreadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const [notifType, setNotifType] = useState<NotificationType>("Announcement");
  const [sendTo, setSendTo] = useState<Recipient>("All Users");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ title?: string; message?: string }>({});
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [openRecipient, setOpenRecipient] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSend = async () => {
    const errs: { title?: string; message?: string } = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (!message.trim()) errs.message = "Message is required.";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

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

      await sendNotification(payload).unwrap();
      toast.success("Notification sent successfully");
      setTitle("");
      setMessage("");
      refetchSent();
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to send notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All admin notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const currentList = activeTab === "sent" ? notifications : adminNotifications;
  const totalPages = Math.ceil(currentList.length / itemsPerPage) || 1;
  const paginatedList = currentList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen font-roboto">
      <main>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Compose Panel */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white rounded-[5px] border border-gray-100 hover:shadow-sm p-6">
              <h2 className="text-xl md:text-2xl leading-7 font-bold text-gray-900 mb-6">
                Compose Notification
              </h2>

              <div className="space-y-4">
                {/* Notification Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">
                    Notification Type
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsTypeOpen(!isTypeOpen)}
                      className="w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 cursor-pointer"
                    >
                      <span>{notifType}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {isTypeOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 text-gray-900 rounded-lg cursor-pointer shadow-lg z-50">
                        {NOTIFICATION_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setNotifType(type);
                              setIsTypeOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
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
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 text-gray-900 rounded-lg shadow-lg z-50 overflow-hidden">
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
                  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors((p) => ({ ...p, title: undefined }));
                    }}
                    placeholder="Notification Title..."
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 transition ${
                      errors.title ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-gray-400"
                    }`}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 leading-5 mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setErrors((p) => ({ ...p, message: undefined }));
                    }}
                    rows={5}
                    placeholder="Write your notification message here..."
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 transition resize-none ${
                      errors.message ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-gray-400"
                    }`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                  className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
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

          {/* RIGHT: Notifications Panel */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-md border border-gray-200 hover:shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("sent");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                      activeTab === "sent"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Sent Notifications ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("admin");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                      activeTab === "admin"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Admin Alerts ({adminNotifications.length})
                  </button>
                </div>

                {activeTab === "admin" && adminNotifications.some((a: any) => !a.is_read) && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={isMarkingAll}
                    className="text-xs text-primaryColor font-medium flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-100">
                {currentList.length === 0 && (
                  <div className="py-16 text-center text-sm text-gray-400">
                    No {activeTab === "sent" ? "sent notifications" : "admin alerts"} found.
                  </div>
                )}

                {activeTab === "sent"
                  ? paginatedList.map((n: any) => (
                      <NotificationRow key={n.id} notification={n} />
                    ))
                  : paginatedList.map((n: any) => (
                      <AdminNotificationRow
                        key={n.id}
                        notification={n}
                        onMarkRead={async (id) => {
                          try {
                            await markAsRead(id).unwrap();
                            toast.success("Marked as read");
                          } catch {
                            toast.error("Failed to update status");
                          }
                        }}
                        onMarkUnread={async (id) => {
                          try {
                            await markAsUnread(id).unwrap();
                            toast.info("Marked as unread");
                          } catch {
                            toast.error("Failed to update status");
                          }
                        }}
                      />
                    ))}
              </div>

              {currentList.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, currentList.length)} of{" "}
                    {currentList.length} items
                  </span>

                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 text-xs border rounded transition ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "cursor-pointer hover:bg-indigo-50 text-gray-600 border-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {getPaginationRange(currentPage, totalPages).map((page, idx) => {
                      if (typeof page === "string") {
                        return (
                          <span
                            key={`dots-${idx}`}
                            className="px-2 py-1 text-xs text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-xs rounded transition cursor-pointer ${
                            currentPage === page
                              ? "bg-primaryColor text-white font-medium"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 text-xs border rounded transition ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "cursor-pointer hover:bg-indigo-50 text-gray-600 border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NotificationRow({ notification: n }: { notification: Notification }) {
  const normalizedType =
    n.type?.charAt(0).toUpperCase() + n.type?.slice(1).toLowerCase();

  const style =
    TYPE_STYLES[normalizedType as NotificationType] || TYPE_STYLES.Announcement;

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
              {Number(n.recipients || 0) === 1 ? "recipient" : "recipients"}
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

function AdminNotificationRow({
  notification,
  onMarkRead,
  onMarkUnread,
}: {
  notification: any;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
}) {
  const isRead = !!notification.is_read;

  return (
    <div
      className={`px-4 sm:px-6 py-4 transition-colors flex items-start justify-between gap-4 ${
        isRead ? "bg-white" : "bg-blue-50/30 font-medium"
      } hover:bg-gray-50`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div
          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
            isRead ? "bg-transparent" : "bg-primaryColor"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3
              className={`text-sm ${
                isRead ? "text-gray-700 font-normal" : "text-gray-900 font-semibold"
              }`}
            >
              {notification.title}
            </h3>
            <span className="text-xs text-gray-400 shrink-0">
              {notification.sent_at}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-1">
            {notification.message}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => (isRead ? onMarkUnread(notification.id) : onMarkRead(notification.id))}
        className="p-1.5 rounded hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition cursor-pointer shrink-0"
        title={isRead ? "Mark as unread" : "Mark as read"}
      >
        {isRead ? (
          <MailOpen size={16} className="text-gray-400" />
        ) : (
          <Mail size={16} className="text-primaryColor" />
        )}
      </button>
    </div>
  );
}
