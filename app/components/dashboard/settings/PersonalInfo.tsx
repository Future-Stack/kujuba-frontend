/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Camera, Mail, MapPin, Phone, BadgeCheck, IdCard, CalendarDays, Loader2 } from "lucide-react";

import { toast } from "react-toastify";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/app/redux/features/personalInfo";

interface InspectionType {
  id: number;
  title: string;
  price: number;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  user_types: string | null;
  profile: {
    id: number;
    address: string | null;
    phone: string | null;
    profile_img: string | null;
    license_number: string | null;
    license_expiry: string | null;
    insurance_expiry: string | null;
    stripe_account_id: string | null;
    stripe_customer_id: string | null;
    stripe_onboarding_completed: boolean;
    inspection_types: InspectionType[];
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

const emptyForm = {
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
  license_number: "",
  license_expiry: "",
  insurance_expiry: "",
  inspection_types: [] as InspectionType[],
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white border border-gray-100 rounded-sm p-5 md:p-10">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-72 bg-gray-100 rounded animate-pulse mb-8" />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-44 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
          <div className="h-3 w-36 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <div className="h-10 w-32 bg-gray-200 rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function PersonalInfoPage() {
  const { data, isLoading, isError, error } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isSaving }] = useUpdateUserProfileMutation();


  useEffect(() => {
    console.log("[personal-info] query state ->", { data, isLoading, isError, error });
  }, [data, isLoading, isError, error]);

const raw = data as any;
// আগে console করে দেখো কী আসছে
console.log("raw data:", raw);

// এভাবে দুটো case handle করো
const user: UserProfile | undefined =
  raw?.data?.id ? raw.data :       // { success, data: { id, ... } }
  raw?.id ? raw :                   // already unwrapped { id, ... }
  undefined;

  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // populate the form once the profile has loaded
  useEffect(() => {
    if (!user) return;
    const newForm = {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.profile?.phone || "",
      address: user.profile?.address || "",
      license_number: user.profile?.license_number || "",
      license_expiry: user.profile?.license_expiry?.slice(0, 10) || "",
      insurance_expiry: user.profile?.insurance_expiry?.slice(0, 10) || "",
      inspection_types: user.profile?.inspection_types || [],
    } as typeof emptyForm;

    // Update form state only when the incoming user data differs from current form.
    // Use functional updater to compare against the latest previous state and
    // avoid including `form` in the dependency array (prevents cascading renders).
    try {
      setForm((prev) => {
        const same = JSON.stringify(newForm) === JSON.stringify(prev);
        return same ? prev : newForm;
      });
    } catch {
      setTimeout(() => setForm(newForm), 0);
    }
  }, [user]);

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Type validation
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Only JPG, PNG, WEBP or GIF images are allowed.");
    e.target.value = "";
    return;
  }

  // Size validation — 2MB max
  const maxSizeMB = 2;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    toast.error(`Image is too large. Maximum allowed size is ${maxSizeMB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
    e.target.value = "";
    return;
  }

  setAvatarFile(file);
  setAvatarPreview(URL.createObjectURL(file));
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const payload = {
    first_name: form.first_name || "",
    last_name: form.last_name || "",
    phone: form.phone || "",
    address: form.address || "",
    license_number: form.license_number || "",
    license_expiry: form.license_expiry || "",
    insurance_expiry: form.insurance_expiry || "",
  };

  try {
    if (avatarFile) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("profile_img", avatarFile);

      await updateUserProfile(formData).unwrap();
    } else {
      await updateUserProfile(payload).unwrap();
    }

    toast.success("Profile updated successfully");
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to update profile");
  }
};

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="w-full max-w-3xl mx-auto p-10 text-center text-sm text-red-500">
        Couldn&apos;t load your profile. Open the browser console — there&apos;s a
        logged query state there showing what came back (or didn&apos;t).
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className="bg-white border border-gray-100 rounded-sm p-5 md:p-6 ">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-roboto leading-7 mb-1">
          Personal Information
        </h1>
        <p className="text-sm text-gray-600 font-normal leading-5 mb-8">
          Keep your contact and license details up to date.
        </p>

        {/* Avatar + identity */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <img
              src={avatarPreview || user?.profile?.profile_img || undefined}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-gray-100 bg-gray-50"
            />
            <label className="absolute -bottom-1 -right-1 bg-primaryColor text-white rounded-full p-1.5 cursor-pointer hover:bg-[#4a4dd4] transition">
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900 font-roboto">
              {user?.first_name} {user?.last_name}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              {user?.email}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {user?.status && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3 h-3" />
                  {user.status}
                </span>
              )}
              {user?.user_types && (
                <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {user.user_types}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 font-roboto text-gray-900">First Name</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#111827]
                  focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 font-roboto text-gray-900">Last Name</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#111827]
                  focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 font-roboto text-gray-900">Phone</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#111827]
                    focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
                />
                {/* <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5F5F]" /> */}
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 font-roboto text-gray-900">Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#111827]
                    focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
                />
                {/* <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5F5F]" /> */}
              </div>
            </div>

            {/* License Number */}
            {/* <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-5 font-roboto text-gray-900">License Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.license_number}
                  onChange={(e) => handleChange("license_number", e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#111827]
                    focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition"
                />
                <IdCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5F5F]" />
              </div>
            </div> */}

            {/* License Expiry */}
        {/* License Expiry */}
{/* <div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium leading-5 font-roboto text-gray-900">License Expiry</label>
  <div className="relative">
    <input
      type="date"
      value={form.license_expiry}
      onChange={(e) => handleChange("license_expiry", e.target.value)}
      className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#111827]
        focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition
        [&::-webkit-calendar-picker-indicator]:opacity-0
        [&::-webkit-calendar-picker-indicator]:absolute
        [&::-webkit-calendar-picker-indicator]:right-0
        [&::-webkit-calendar-picker-indicator]:w-10
        [&::-webkit-calendar-picker-indicator]:h-full
        [&::-webkit-calendar-picker-indicator]:cursor-pointer"
    />
    <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5F5F] pointer-events-none" />
  </div>
</div> */}

{/* Insurance Expiry */}
{/* <div className="flex flex-col gap-1.5 md:col-span-2 md:w-1/2">
  <label className="text-sm font-medium leading-5 font-roboto text-gray-900">Insurance Expiry</label>
  <div className="relative">
    <input
      type="date"
      value={form.insurance_expiry}
      onChange={(e) => handleChange("insurance_expiry", e.target.value)}
      className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#111827]
        focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4] transition
        [&::-webkit-calendar-picker-indicator]:opacity-0
        [&::-webkit-calendar-picker-indicator]:absolute
        [&::-webkit-calendar-picker-indicator]:right-0
        [&::-webkit-calendar-picker-indicator]:w-10
        [&::-webkit-calendar-picker-indicator]:h-full
        [&::-webkit-calendar-picker-indicator]:cursor-pointer"
    />
    <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5F5F] pointer-events-none" />
  </div>
</div> */}
          </div>

          {/* Inspection Types — catalog items (id/title/price) the inspector
              offers. Read-only here until there's an endpoint to pick from
              the full catalog; this just reflects what's already assigned. */}
          {/* <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-5 font-roboto text-gray-900">Inspection Types</label>
            <div className="flex flex-wrap gap-2">
              {form.inspection_types.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 bg-[#EEEEFB] text-[#5B5EF4] text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {item.title}
                  <span className="text-[#5B5EF4]/60">${item.price}</span>
                </span>
              ))}
              {form.inspection_types.length === 0 && (
                <span className="text-sm text-gray-400">No inspection types assigned yet</span>
              )}
            </div>
          </div> */}

          {/* Account & Payment (read-only) */}
          {/* <div className="mt-2 pt-6 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 font-roboto mb-3">Account & Payment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow label="Stripe Account" value={user?.profile?.stripe_account_id || "Not connected"} />
              <InfoRow label="Stripe Customer" value={user?.profile?.stripe_customer_id || "—"} />
              <InfoRow
                label="Payment Onboarding"
                value={
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                      user?.profile?.stripe_onboarding_completed
                        ? "text-green-700 bg-green-50"
                        : "text-amber-700 bg-amber-50"
                    }`}
                  >
                    {user?.profile?.stripe_onboarding_completed ? "Completed" : "Not completed"}
                  </span>
                }
              />
            </div>
          </div> */}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] disabled:opacity-50
                disabled:cursor-not-allowed text-white text-sm cursor-pointer font-semibold
                py-2.5 px-6 rounded-sm transition-all duration-150 inline-flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}