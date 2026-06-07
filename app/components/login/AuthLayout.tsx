"use client";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Background Image */}
<div className="hidden lg:block relative w-1/2 overflow-hidden">
  <Image
    src="/loginBgImg.png"
    alt="Platform preview"
    fill
    className="object-cover object-center blur-m"
    priority
  />

  {/* Blur + dark overlay */}
  <div className="absolute inset-0  backdrop-blur-[4px]" />
</div>

      {/* Right — Form Area */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        {children}
      </div>
    </div>
  );
}