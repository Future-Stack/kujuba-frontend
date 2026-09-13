"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ImagePlus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateClientMutation } from "@/app/redux/features/clientApi";

type CreateClientModalProps = {
  open: boolean;
  onClose: () => void;
};

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  company_name: "",
  client_type: "insurance_company",
  phone: "",
  address: "",
};

export default function CreateClientModal({ open, onClose }: CreateClientModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [createClient, { isLoading }] = useCreateClientMutation();

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm);
    setProfileImg(null);
    setProfileFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateField = (key: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    setProfileFile(file);
    setProfileImg(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setProfileFile(null);
    setProfileImg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.company_name.trim() ||
      !form.phone.trim() ||
      !form.address.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const fd = new FormData();
    fd.append("first_name", form.first_name.trim());
    fd.append("last_name", form.last_name.trim());
    fd.append("email", form.email.trim());
    fd.append("password", form.password);
    fd.append("company_name", form.company_name.trim());
    fd.append("client_type", form.client_type);
    fd.append("phone", form.phone.trim());
    fd.append("address", form.address.trim());
    if (profileFile) {
      fd.append("profile_img", profileFile);
    }

    try {
      const res = await createClient(fd).unwrap();
      toast.success(res?.message || "Client account created successfully!");
      onClose();
    } catch (error: any) {
      const validationError = error?.data?.errors
        ? Object.values(error.data.errors).flat()[0]
        : null;
      toast.error(
        (validationError as string) ||
          error?.data?.message ||
          "Failed to create client account"
      );
    }
  };

  const inputClass =
    "w-full border border-[#E7E8FF] text-gray-700 rounded-[10px] px-4 py-3 text-sm font-roboto outline-none focus:border-primaryColor transition-colors bg-white";

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-sora font-bold text-[#000000]">
            Add New Client
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#B5BCC8] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
              Profile Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {profileImg ? (
              <div className="relative w-full h-36 rounded-[10px] overflow-hidden border border-[#E7E8FF]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileImg}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-full shadow cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-[#E7E8FF] rounded-[10px] flex flex-col items-center justify-center gap-1.5 text-[#B5BCC8] hover:border-primaryColor hover:text-primaryColor transition-colors cursor-pointer"
              >
                <ImagePlus size={22} />
                <span className="text-xs font-roboto">
                  Click to upload client avatar
                </span>
              </button>
            )}
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                placeholder="John"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                placeholder="Client"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="client@gmail.com"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                Password *
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Pass123"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Company Name & Client Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => updateField("company_name", e.target.value)}
                placeholder="Allstate Insurance"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                Client Type *
              </label>
              <div className="relative">

                <select
                  value={form.client_type}
                  onChange={(e) => updateField("client_type", e.target.value)}
                  className={`${inputClass} pr-8 appearance-none bg-white`}
                  required
                >
                  <option value="insurance_company">Insurance Company</option>
                  <option value="realtor">Realtor</option>
                  <option value="broker">Broker</option>
                  <option value="agency">Agency</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Phone & Address */}
          <div className="mb-4">
            <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="01234567785"
              className={inputClass}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
              Address *
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Mohakhali, Dhaka"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primaryColor text-white font-sora font-semibold py-3.5 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 text-sm shadow-md"
          >
            {isLoading ? "Creating Client Account..." : "Create Client Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
