"use client";

import React from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  sent_at: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}


const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
   notifications,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999]"
      onClick={onClose}
    >
      {/* Modal — top-right position */}
      <div
        className="absolute top-16 right-4 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#171C35]">
              Notifications
            </h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
  notifications.map((item) => (
    <div
      key={item.id}
      className="px-5 py-4 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-primaryColor mt-1.5 flex-shrink-0" />

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-sm font-sora text-[#171C35]">
              {item.title}
            </h3>

            <span className="text-xs text-gray-400">
              {item.sent_at}
            </span>
          </div>

          <p className="text-sm text-[#667085] mt-1">
            {item.message}
          </p>
        </div>
      </div>
    </div>
  ))
) : (
  <div className="p-6 text-center text-gray-500">
    No notifications found
  </div>
)}
        </div>

        {/* Footer */}
        {/* <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#164DB2] text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default NotificationModal;