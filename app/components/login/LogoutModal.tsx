import React from "react";
import LogoIcon from "../icon/LogoIcon";

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

 return (
  <div
    className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 animate-fadeIn"
    onClick={onCancel}
  >
    <div
      className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Logo */}
      <div className="flex justify-center mb-4 h-12">
        <LogoIcon />
      </div>

      {/* Text */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-[#171C35] mb-2">
          Are You Sure You Want to Logout?
        </h2>

        <p className="text-sm text-[#667085]">
          You will need to enter your credentials again to access your account.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 py-2 bg-primaryColor text-white rounded-xl hover:bg-blue-700 cursor-pointer"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
);
};

export default LogoutModal;