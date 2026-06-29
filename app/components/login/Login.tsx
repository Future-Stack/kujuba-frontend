/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";
import LogoIcon from "../icon/LogoIcon";
import { useRouter } from "next/navigation";
import {  useLoginMutation } from "@/app/redux/api/authApi";
import { toast } from "react-toastify";


declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  // const [, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({
        email: form.email,
        password: form.password,
      }).unwrap();

      if (res.success) {
        localStorage.setItem("access_token", res.access_token);
        if (res.user.user_type === "admin") {
          toast.success("Login successful");
          router.push("/dashboard");
        } else {
          toast.error("You are not authorized as admin");
        }
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
        error?.error ||
        "Invalid email or password"
      );
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center mb-10">
          <LogoIcon />
        </div>

        <div className="bg-white border border-gray-100 rounded-sm p-5 md:p-10 hover:shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-roboto leading-7 text-center mb-1">
            Sign in
          </h1>
          <p className="text-sm text-gray-600 font-normal leading-5 text-center mb-6">
            Please enter your details to sign in
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 text-gray-900">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-gray-100 rounded-sm px-4 py-2.5 pr-10 text-sm text-[#111827]
                    focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5F5F]" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 text-gray-900">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#111827]
                    focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F5F5F] hover:text-[#6B7280]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] accent-[#5B5EF4]"
                />
                <span className="text-sm text-gray-900 font-normal leading-5">Remember Me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-gray-600 font-medium leading-5 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] text-white text-sm font-semibold
                py-2.5 rounded-lg transition-all duration-150 cursor-pointer mt-4 disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}