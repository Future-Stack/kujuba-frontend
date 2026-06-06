"use client";

import React from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    title: "Payment Support",
    message: "A new payment support request has been submitted.",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Inspector Upload",
    message: "Inspector uploaded new inspection documents.",
    time: "10 min ago",
  },
  {
    id: 3,
    title: "System Update",
    message: "New package information has been updated.",
    time: "1 hour ago",
  },
];

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
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
          {notifications.map((item) => (
            <div
              key={item.id}
              className="px-5 py-4 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#164DB2] mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm text-[#171C35]">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-sm text-[#667085] mt-0.5">
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
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