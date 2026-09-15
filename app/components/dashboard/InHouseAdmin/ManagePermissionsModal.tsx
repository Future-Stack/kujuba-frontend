/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { X, Shield, CheckSquare, Square, Loader2 } from "lucide-react";
import {
  useGetAvailablePermissionsQuery,
  useAssignPermissionsMutation,
} from "@/app/redux/features/inhouseAdminApi";
import { toast } from "react-toastify";

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: number | string | null;
  adminName: string;
  initialPermissions?: string[];
}

export default function ManagePermissionsModal({
  isOpen,
  onClose,
  adminId,
  adminName,
  initialPermissions = [],
}: ManagePermissionsModalProps) {
  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useGetAvailablePermissionsQuery(undefined, { skip: !isOpen });
  const [assignPermissions, { isLoading: isSubmitting }] =
    useAssignPermissionsMutation();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPermissions(initialPermissions || []);
    }
  }, [isOpen, initialPermissions]);

  if (!isOpen || !adminId) return null;

  const modules = permissionsResponse?.data || [];

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

  const handleSelectAll = () => {
    const allKeys: string[] = [];
    modules.forEach((mod: any) => {
      mod.permissions.forEach((p: any) => allKeys.push(p.key));
    });

    if (selectedPermissions.length === allKeys.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allKeys);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      selectedPermissions.forEach((perm, index) => {
        formData.append(`permissions[${index}]`, perm);
      });

      const res = await assignPermissions({
        id: adminId,
        body: formData,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Permissions updated successfully");
        onClose();
      } else {
        toast.error(res.message || "Failed to update permissions");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign permissions");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-roboto">
                Manage Admin Permissions
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Assign module access for{" "}
                <span className="text-indigo-600 font-semibold">
                  {adminName}
                </span>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          {isLoadingPermissions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-sm font-semibold text-gray-700">
                  {selectedPermissions.length} permission(s) selected
                </span>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {selectedPermissions.length > 0 ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="space-y-6">
                {modules.map((mod: any) => {
                  const modKeys = mod.permissions.map((p: any) => p.key);
                  const isModuleAllSelected = modKeys.every((k: string) =>
                    selectedPermissions.includes(k)
                  );
                  const isModuleSomeSelected =
                    !isModuleAllSelected &&
                    modKeys.some((k: string) => selectedPermissions.includes(k));

                  return (
                    <div
                      key={mod.module_key}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs"
                    >
                      <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h4 className="font-bold text-gray-800 text-base">
                          {mod.module}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleToggleModule(mod.permissions)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          {isModuleAllSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : isModuleSomeSelected ? (
                            <div className="w-4 h-4 border-2 border-indigo-600 rounded-xs flex items-center justify-center">
                              <div className="w-2 h-2 bg-indigo-600 rounded-xs" />
                            </div>
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                          Toggle Module
                        </button>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mod.permissions.map((perm: any) => {
                          const isChecked = selectedPermissions.includes(
                            perm.key
                          );
                          return (
                            <label
                              key={perm.key}
                              onClick={() => handleTogglePermission(perm.key)}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                                isChecked
                                  ? "bg-indigo-50/50 border-indigo-200"
                                  : "border-gray-100 hover:border-gray-200 bg-white"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 accent-indigo-600"
                              />
                              <div>
                                <div className="text-sm font-bold text-gray-900">
                                  {perm.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
