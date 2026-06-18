/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, Suspense, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "../components/login/AuthLayout";
import LogoIcon from "../components/icon/LogoIcon";
import { useVerifyOtpMutation, useResendOtpMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 300; // 5 minutes

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const [expired, setExpired] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email address. Please restart the process.");
      return;
    }
    try {
      await resendOtp({ email }).unwrap();
      toast.success("OTP resent successfully");
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(RESEND_SECONDS);
      setExpired(false);
      inputs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < OTP_LENGTH) return;
    if (!email) {
      toast.error("Missing email address. Please restart the process.");
      return;
    }

    try {
      await verifyOtp({ email, otp: otpValue }).unwrap();
      toast.success("OTP verified successfully");
      // carrying email + otp forward so reset-password can confirm both in one call.
      // if your API returns a one-time reset token from verify-otp instead, swap
      // the line below to pass that token and read/send it on the reset page.
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otpValue}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid or expired OTP");
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
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-600 font-normal leading-5 text-center mb-6">
            We have sent an OTP to{" "}
            <span className="font-medium text-[#374151]">{email || "your email"}</span>{" "}
            to verify your email address and activate your account by entering the OTP
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 4-digit OTP boxes */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-14 text-center text-xl font-normal border-2 rounded-sm
                    focus:outline-none transition-all duration-150
                    ${digit
                      ? "border-[#5B5EF4] bg-[#EEEEFB]/40 text-[#5B5EF4]"
                      : "border-[#E5E7EB] bg-white text-[#111827]"
                    }
                    focus:border-[#5B5EF4] focus:ring-2 focus:ring-[#5B5EF4]/20
                  `}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              <span className={`text-base font-normal leading-5 ${expired ? "text-[#E22871]" : "text-[#EF4444]"}`}>
                {expired ? "00:00" : formatTime(timeLeft)}
              </span>
            </div>

            {/* Resend */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-gray-900 font-normal leading-5 underline hover:text-[#5B5EF4] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </div>

            <button
              type="submit"
              disabled={otp.join("").length < OTP_LENGTH || isVerifying}
              className="w-full bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] disabled:opacity-50
                disabled:cursor-not-allowed text-white text-sm cursor-pointer font-semibold
                py-3 rounded-sm transition-all duration-150"
            >
              {isVerifying ? "Verifying..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpForm />
    </Suspense>
  );
}