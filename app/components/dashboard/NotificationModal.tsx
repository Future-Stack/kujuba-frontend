"use client";

import Link from "next/link";
import React from "react";
import {
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useMarkAsUnreadMutation,
  AdminNotification,
} from "@/app/redux/features/notificationApi";
import { Check, CheckCheck, MailOpen, Mail } from "lucide-react";
import { toast } from "react-toastify";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotification[];
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  const [markAsRead] = useMarkAsReadMutation();
  const [markAsUnread] = useMarkAsUnreadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  if (!isOpen) return null;

  const hasUnread = notifications.some((item) => !item.is_read);

  const handleMarkAll = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleItemClick = async (item: AdminNotification) => {
    if (!item.is_read) {
      try {
        await markAsRead(item.id).unwrap();
      } catch {
        // silent catch or notification
      }
    }
  };

  const handleToggleReadStatus = async (
    e: React.MouseEvent,
    item: AdminNotification
  ) => {
    e.stopPropagation();
    try {
      if (item.is_read) {
        await markAsUnread(item.id).unwrap();
        toast.info("Marked as unread");
      } else {
        await markAsRead(item.id).unwrap();
        toast.success("Marked as read");
      }
    } catch {
      toast.error("Failed to update notification status");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      {/* Modal — top-right position */}
      <div
        className="absolute top-16 right-4 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#171C35]">
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {hasUnread && (
              <button
                type="button"
                onClick={handleMarkAll}
                disabled={isMarkingAll}
                className="text-xs text-primaryColor hover:underline font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((item) => {
              const isRead = !!item.is_read;
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`px-5 py-4 border-b last:border-b-0 border-gray-200  transition cursor-pointer flex items-start justify-between gap-3 ${
                    isRead ? "bg-white text-gray-500" : "bg-blue-50/40 text-gray-900 font-medium"
                  } hover:bg-gray-50`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        isRead ? "bg-transparent" : "bg-primaryColor"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-sm font-sora truncate ${
                            isRead ? "text-gray-600 font-normal" : "text-[#171C35] font-semibold"
                          }`}
                        >
                          {item.title}
                        </h3>

                        <span className="text-xs text-gray-400 shrink-0">
                          {item.sent_at}
                        </span>
                      </div>

                      <p className="text-xs text-[#667085] mt-1 line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleToggleReadStatus(e, item)}
                    className="p-1 rounded hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition cursor-pointer shrink-0 mt-1"
                    title={isRead ? "Mark as unread" : "Mark as read"}
                  >
                    {isRead ? (
                      <MailOpen size={14} className="text-gray-400" />
                    ) : (
                      <Mail size={14} className="text-primaryColor" />
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500">
              No notifications found
            </div>
          )}
        </div>

        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          className="block w-full text-center text-primaryColor font-medium text-sm py-3 hover:bg-gray-50 transition border-t border-gray-100"
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationModal;
