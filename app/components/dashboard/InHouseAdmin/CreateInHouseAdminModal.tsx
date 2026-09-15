/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { X, UserPlus, Upload, Loader2, Eye, EyeOff, Shield } from "lucide-react";
import {
  useCreateInhouseAdminMutation,
  useGetAvailablePermissionsQuery,
} from "@/app/redux/features/inhouseAdminApi";
import { toast } from "react-toastify";

interface CreateInHouseAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInHouseAdminModal({
  isOpen,
  onClose,
}: CreateInHouseAdminModalProps) {
  const [createAdmin, { isLoading }] = useCreateInhouseAdminMutation();
  const { data: permissionsResponse } = useGetAvailablePermissionsQuery(
    undefined,
    { skip: !isOpen }
  );

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "permissions">("details");

  if (!isOpen) return null;

  const modules = permissionsResponse?.data || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleTogglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleToggleModule = (modulePermissions: any[]) => {
    const keys = modulePermissions.map((p) => p.key);
    const allSelected = keys.every((k) => selectedPermissions.includes(k));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((k) => !keys.includes(k)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...keys])));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (form.phone) formData.append("phone", form.phone);
      if (form.address) formData.append("address", form.address);

      if (selectedFile) {
        formData.append("profile_img", selectedFile);
      }

      selectedPermissions.forEach((perm, index) => {
        formData.append(`permissions[${index}]`, perm);
      });

      const res = await createAdmin(formData).unwrap();

      if (res.success) {
        toast.success(res.message || "In-house admin created successfully.");
        // Reset form
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setSelectedPermissions([]);
        setActiveTab("details");
        onClose();
      } else {
        toast.error(res.message || "Failed to create in-house admin.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create in-house admin.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-roboto">
                Add New In-House Admin
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Create a staff member and assign module permissions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-gray-100 px-6 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Admin Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("permissions")}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "permissions"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Shield className="w-4 h-4" />
            Assign Permissions ({selectedPermissions.length})
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {activeTab === "details" ? (
            <>
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-100 bg-slate-50 flex items-center justify-center group cursor-pointer shadow-sm">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-semibold">Upload</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">
                  Profile Photo (Optional)
                </span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    placeholder="e.g. Rahim"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    placeholder="e.g. Admin"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. inhouse_rahim@kujuba.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1234567890"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Miami, Florida"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-sm font-semibold text-gray-700">
                  {selectedPermissions.length} permission(s) assigned
                </span>
                <span className="text-xs text-gray-500">
                  Select which features this admin can access in their dashboard
                </span>
              </div>

              {modules.map((mod: any) => {
                const modKeys = mod.permissions.map((p: any) => p.key);
                const isModuleAllSelected = modKeys.every((k: string) =>
                  selectedPermissions.includes(k)
                );

                return (
                  <div
                    key={mod.module_key}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs"
                  >
                    <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h4 className="font-bold text-gray-800 text-sm">
                        {mod.module}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleToggleModule(mod.permissions)}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        {isModuleAllSelected ? "Deselect Module" : "Select Module"}
                      </button>
                    </div>

                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {mod.permissions.map((perm: any) => {
                        const isChecked = selectedPermissions.includes(perm.key);
                        return (
                          <label
                            key={perm.key}
                            onClick={() => handleTogglePermission(perm.key)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                              isChecked
                                ? "bg-indigo-50/50 border-indigo-200"
                                : "border-gray-100 hover:border-gray-200 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-gray-300 accent-indigo-600"
                            />
                            <div>
                              <div className="text-xs font-bold text-gray-900">
                                {perm.name}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                {perm.description}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Hidden Submit */}
          <button type="submit" className="hidden" id="create-admin-submit-btn" />
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-b-2xl">
          {activeTab === "details" ? (
            <button
              type="button"
              onClick={() => setActiveTab("permissions")}
              className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" /> Set Permissions &rarr;
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className="text-sm font-semibold text-gray-600 hover:underline"
            >
              &larr; Back to Details
            </button>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any)}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
