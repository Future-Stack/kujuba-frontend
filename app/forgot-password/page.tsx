"use client";

import { useState } from "react";
import Link from "next/link";
import {  Mail,  } from "lucide-react";
import AuthLayout from "../components/login/AuthLayout";
import LogoIcon from "../components/icon/LogoIcon";



export default function ForgotPasswordPage() {

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle login
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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-roboto leading-7 text-center mb-1">Forgot Password</h1>
          <p className="text-sm text-gray-600 font-normal leading-5 text-center mb-6">
            If you forgot your password, well, then we’ll email you instructions to reset your password.
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

         

     
            {/* Submit */}
            <Link href="/otp">
             <button
              type="submit"
              className="w-full bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] text-white text-sm font-semibold
                py-2.5 rounded-lg transition-all duration-150 cursor-pointer mt-4"
            >
              Verify Email
            </button>
            </Link>
    <p className="text-sm flex gap-2 text-gray-600 items-center justify-center mt-5">
        Return to 
 <Link href="/" className="text-gray-900 font-medium hover:underline">
            Sign In
          </Link>
</p>
   
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