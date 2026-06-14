/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail,} from "lucide-react";
import AuthLayout from "./AuthLayout";
import LogoIcon from "../icon/LogoIcon";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/app/redux/api/authApi";
import { toast } from "react-toastify";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
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
    console.log("LOGIN ERROR:", error);

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
        {/* Logo */}
        <div className="flex justify-center mb-10">
            <LogoIcon/>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-sm p-5 md:p-10 hover:shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-roboto leading-7 text-center mb-1">Sign in</h1>
          <p className="text-sm text-gray-600 font-normal leading-5 text-center mb-6">
            Please enter your details to sign in
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 font-robot text-gray-900">Email</label>
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
              <label className="ttext-sm font-medium leading-5 font-robot text-gray-900">Password</label>
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
                <span className="text-sm text-gray-900 font-normal font-robot leading-5">Remember Me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-gray-600 font-medium font-robot leading-5 hover:underline">
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
            


            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs font-normal leading-4 text-gray-600">Or Sign In With</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-sm py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-[#374151] cursor-pointer  transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </form>
        </div>

        {/* <p className="text-sm text-[#9CA3AF] text-center mt-5">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#5B5EF4] font-medium hover:underline">
            Signup now
          </Link>
        </p> */}
      </div>
    </AuthLayout>
  );
}