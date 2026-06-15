/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useChangePasswordMutation } from "@/app/redux/api/authApi";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  form: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  showPassword: any;
  setShowPassword: React.Dispatch<React.SetStateAction<any>>;
};

export default function ChangePasswordModal({
  open,
  onClose,
  form,
  setForm,
  showPassword,
  setShowPassword,
}: Props) {
  const [updatePassword, { isLoading }] = useChangePasswordMutation();

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdatePass = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Password mismatch");
      return;
    }

    try {
      await updatePassword({
        current_password: form.currentPassword,
        new_password: form.newPassword,
        new_password_confirmation: form.confirmPassword,
      }).unwrap();

      toast.success("Password updated successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-xl p-6 border border-gray-200 border border-gray-200-[#E7E8FF]">

        <h2 className="text-lg font-semibold text-black mb-5">
          Change Password
        </h2>

        {/* Current */}
        <div className="relative mb-4">
          <label className="text-sm text-gray-800 mb-1 block">Current Password</label>
          <input
            name="currentPassword"
            type={showPassword.current ? "text" : "password"}
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter Current Password"
            className="w-full border border-gray-200 rounded-[10px] placeholder:text-gray-400 text-gray-800 px-4 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword({
                ...showPassword,
                current: !showPassword.current,
              })
            }
            className="absolute right-3 text-gray-800 cursor-pointer top-9"
          >
            {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* New */}
        <div className="relative mb-4">
          <label className="text-sm text-gray-800 mb-1 block">New Password</label>
          <input
            name="newPassword"
            type={showPassword.new ? "text" : "password"}
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter New Password"
            className="w-full border border-gray-200 placeholder:text-gray-400 text-gray-800 rounded-[10px] px-4 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword({
                ...showPassword,
                new: !showPassword.new,
              })
            }
            className="absolute right-3 text-gray-800 cursor-pointer top-9"
          >
            {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm */}
        <div className="relative mb-4">
          <label className="text-sm text-gray-800 mb-1 block">Confirm Password</label>
          <input
            name="confirmPassword"
            type={showPassword.confirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Enter Confirm Password"
            className="w-full border border-gray-200 rounded-[10px] placeholder:text-gray-400 text-gray-800 px-4 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword({
                ...showPassword,
                confirm: !showPassword.confirm,
              })
            }
            className="absolute right-3 text-gray-800 cursor-pointer top-9"
          >
            {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-400 text-gray-700 cursor-pointer rounded-[10px]"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdatePass}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-primaryColor cursor-pointer text-white rounded-[10px]"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}