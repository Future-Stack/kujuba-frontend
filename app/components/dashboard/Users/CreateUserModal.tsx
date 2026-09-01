"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateUserMutation } from "@/app/redux/features/usersApi";
import { useGetInspectionTypesQuery } from "@/app/redux/features/inspectiontypeApi";
import DatePicker from "@/app/components/ui/DatePicker";

type CreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  variant: "homeowner" | "inspector";
};

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  license_number: "",
  license_expiry: "",
  insurance_expiry: "",
};

export default function CreateUserModal({ open, onClose, variant }: CreateUserModalProps) {
  const isInspector = variant === "inspector";
  const [form, setForm] = useState(emptyForm);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [selectedInspectionTypeIds, setSelectedInspectionTypeIds] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const { data: inspectionTypesRes, isLoading: fetchingInspectionTypes } = useGetInspectionTypesQuery(undefined, {
    skip: !open || !isInspector,
  });
  const inspectionTypes = inspectionTypesRes?.data || [];

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm);
    setProfileImg(null);
    setProfileFile(null);
    setSelectedInspectionTypeIds([]);
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
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
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
      !form.phone.trim() ||
      !form.address.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isInspector && (!form.license_number.trim() || !form.license_expiry || !form.insurance_expiry)) {
      toast.error("Please fill in all required inspector fields");
      return;
    }

    const fd = new FormData();
    fd.append("first_name", form.first_name.trim());
    fd.append("last_name", form.last_name.trim());
    fd.append("email", form.email.trim());
    fd.append("password", form.password);
    fd.append("user_type", isInspector ? "inspector" : "homeowner");
    fd.append("phone", form.phone.trim());
    fd.append("address", form.address.trim());
    if (profileFile) fd.append("profile_img", profileFile);
    if (isInspector) {
      fd.append("license_number", form.license_number.trim());
      fd.append("license_expiry", form.license_expiry);
      fd.append("insurance_expiry", form.insurance_expiry);
      selectedInspectionTypeIds.forEach((id) => {
        fd.append("inspection_type_ids[]", String(id));
      });
    }

    try {
      await createUser(fd).unwrap();
      toast.success(isInspector ? "Inspector added successfully" : "User added successfully");
      onClose();
    } catch (error: any) {
      const validationError = error?.data?.errors
        ? Object.values(error.data.errors).flat()[0]
        : null;
      toast.error(validationError || error?.data?.message || "Something went wrong");
    }
  };

  const inputClass =
    "w-full border border-[#E7E8FF] text-gray-600 rounded-[10px] px-4 py-3 text-sm font-roboto outline-none focus:border-primaryColor transition-colors";

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
            {isInspector ? "Add New Inspector" : "Add New User"}
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
              <div className="relative w-full h-40 rounded-[10px] overflow-hidden border border-[#E7E8FF]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profileImg} alt="Preview" className="w-full h-full object-cover" />
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
                className="w-full h-32 border-2 border-dashed border-[#E7E8FF] rounded-[10px] flex flex-col items-center justify-center gap-2 text-[#B5BCC8] hover:border-primaryColor hover:text-primaryColor transition-colors cursor-pointer"
              >
                <ImagePlus size={24} />
                <span className="text-sm font-roboto">Click to upload an image (optional)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">First Name</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                placeholder="John"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">Last Name</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                placeholder="Doe"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Enter password"
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1234567890"
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 Main Street, NY"
              className={inputClass}
            />
          </div>

          {isInspector && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                  License Number
                </label>
                <input
                  type="text"
                  value={form.license_number}
                  onChange={(e) => updateField("license_number", e.target.value)}
                  placeholder="LIC-98765"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                    License Expiry
                  </label>
                  <DatePicker
                    value={form.license_expiry}
                    onChange={(val) => updateField("license_expiry", val)}
                    placeholder="Select expiry date"


                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                    Insurance Expiry
                  </label>
                  <DatePicker
                    value={form.insurance_expiry}
                    onChange={(val) => updateField("insurance_expiry", val)}
                    placeholder="Select expiry date"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                  Inspection Types
                </label>
                {fetchingInspectionTypes ? (
                  <p className="text-xs text-gray-400">Loading inspection types...</p>
                ) : inspectionTypes.length === 0 ? (
                  <p className="text-xs text-gray-400">No inspection types available</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-[#E7E8FF] rounded-[10px] p-3">
                    {inspectionTypes.map((item: any) => {
                      const isChecked = selectedInspectionTypeIds.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                            isChecked
                              ? "border-primaryColor bg-primaryColor/5 text-primaryColor font-medium"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedInspectionTypeIds(
                                  selectedInspectionTypeIds.filter((id) => id !== item.id)
                                );
                              } else {
                                setSelectedInspectionTypeIds([...selectedInspectionTypeIds, item.id]);
                              }
                            }}
                            className="rounded border-gray-300 text-primaryColor focus:ring-primaryColor cursor-pointer"
                          />
                          <span className="truncate">{item.title}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primaryColor text-white font-sora font-semibold py-3 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
