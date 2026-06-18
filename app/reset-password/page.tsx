/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "../components/login/AuthLayout";
import LogoIcon from "../components/icon/LogoIcon";
import { useResetPasswordMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!email || !otp) {
      setError("Missing verification details. Please restart the process.");
      return;
    }
    setError("");

    try {
      await resetPassword({
        email,
        otp,
        new_password: form.password,
        new_password_confirmation: form.confirmPassword,
      }).unwrap();
      toast.success("Password reset successfully");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <LogoIcon />
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-sm p-5 md:p-10 hover:shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-roboto leading-7 text-center mb-1">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 font-normal leading-5 text-center mb-6">
            Securely reset your account password if you&apos;ve forgotten it or need
            to update it.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 font-roboto text-gray-900">Password</label>
              <div className="relative">
                <input
                  type={show.password ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setError("");
                  }}
                  required
                  className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#111827]
                    focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, password: !show.password })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer hover:text-[#6B7280]"
                >
                  {show.password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 font-roboto text-gray-900">Confirm Password</label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm({ ...form, confirmPassword: e.target.value });
                    setError("");
                  }}
                  required
                  className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#111827]
                    focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, confirm: !show.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer hover:text-[#6B7280]"
                >
                  {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] cursor-pointer text-white text-sm font-semibold
                py-3 rounded-sm transition-all duration-150 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset"}
            </button>
          </form>

          <p className="text-sm flex gap-2 text-gray-600 items-center justify-center mt-5">
            Return to
            <Link href="/" className="text-gray-900 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}