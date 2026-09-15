/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetUserProfileQuery } from "./redux/features/personalInfo";
import { toast } from "react-toastify";

export function isRouteAllowed(pathname: string, user: any): boolean {
  if (!user) return true;
  // Super admins have access to all routes
  if (user.user_type === "admin" || user.user_type === "super_admin") return true;

  if (user.user_type === "inhouse_admin") {
    const permissions: string[] = Array.isArray(user.permissions) ? user.permissions : [];

    if (pathname === "/dashboard") {
      return permissions.length === 0 || permissions.some((p) => p.startsWith("dashboard"));
    }
    if (pathname.startsWith("/dashboard/homeowners")) {
      return permissions.some((p) => p.startsWith("users"));
    }
    if (pathname.startsWith("/dashboard/clients")) {
      return permissions.some((p) => p.startsWith("clients"));
    }
    if (pathname.startsWith("/dashboard/client-reports")) {
      return permissions.some((p) => p.startsWith("client_reports"));
    }
    if (pathname.startsWith("/dashboard/inhouse-admins")) {
      return false; // Restricted to super admin
    }
    if (
      pathname.startsWith("/dashboard/inspection_type") ||
      pathname.startsWith("/dashboard/inspections")
    ) {
      return permissions.some((p) => p.startsWith("inspections"));
    }
    if (pathname.startsWith("/dashboard/inspectors")) {
      return permissions.some((p) => p.startsWith("inspectors"));
    }
    if (pathname.startsWith("/dashboard/payments")) {
      return false; // Restricted to super admin
    }
    if (pathname.startsWith("/dashboard/reports")) {
      return permissions.some((p) => p.startsWith("reports"));
    }
    if (pathname.startsWith("/dashboard/reviews")) {
      return permissions.some((p) => p.startsWith("reviews"));
    }
    if (
      pathname.startsWith("/dashboard/faq") ||
      pathname.startsWith("/dashboard/support")
    ) {
      return permissions.some((p) => p.startsWith("support"));
    }
    if (
      pathname.startsWith("/dashboard/notifications") ||
      pathname.startsWith("/dashboard/settings")
    ) {
      return true;
    }
  }

  return true;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [tokenChecked, setTokenChecked] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { data: profileData, isLoading: isProfileLoading } = useGetUserProfileQuery(
    undefined,
    { skip: !token }
  );

  const user = profileData?.data;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access_token");
      if (!storedToken) {
        router.replace("/");
      } else {
        setTokenChecked(true);
      }
    }
  }, [router, pathname]);

  useEffect(() => {
    if (tokenChecked && !isProfileLoading && user) {
      const allowed = isRouteAllowed(pathname, user);
      if (!allowed) {
        toast.error("You do not have permission to access this page.");
        router.replace("/dashboard");
      }
    }
  }, [pathname, user, isProfileLoading, tokenChecked, router]);

  if (!tokenChecked || (token && isProfileLoading)) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B5EF4]"></div>
      </div>
    );
  }

  return <>{children}</>;
}