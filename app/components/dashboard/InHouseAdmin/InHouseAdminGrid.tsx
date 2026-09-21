/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Shield,
  UserCheck,
  UserX,
  MoreVertical,
  Loader2,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import {
  useGetInhouseAdminsQuery,
  useSuspendInhouseAdminMutation,
  useUnsuspendInhouseAdminMutation,
} from "@/app/redux/features/inhouseAdminApi";
import CreateInHouseAdminModal from "./CreateInHouseAdminModal";
import ManagePermissionsModal from "./ManagePermissionsModal";
import { toast } from "react-toastify";

export default function InHouseAdminGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 10;

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedAdminForPermissions, setSelectedAdminForPermissions] = useState<any>(null);

  // Active action dropdown ID
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const { data: responseData, isLoading, isFetching } = useGetInhouseAdminsQuery({
    search: searchQuery,
    status: statusFilter,
    page: currentPage,
    per_page: perPage,
  });

  const [suspendAdmin, { isLoading: isSuspending }] = useSuspendInhouseAdminMutation();
  const [unsuspendAdmin, { isLoading: isUnsuspending }] = useUnsuspendInhouseAdminMutation();

  const adminList = responseData?.data?.data || [];
  const pagination = responseData?.data || {};
  const totalPages = pagination.last_page || 1;

  const handleSuspendToggle = async (admin: any) => {
    setActiveMenuId(null);
    try {
      if (admin.status === "active") {
        const res = await suspendAdmin(admin.id).unwrap();
        toast.success(res.message || "Admin suspended successfully.");
      } else {
        const res = await unsuspendAdmin(admin.id).unwrap();
        toast.success(res.message || "Admin reactivated successfully.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update admin status.");
    }
  };

  const handleOpenPermissions = (admin: any) => {
    setActiveMenuId(null);
    setSelectedAdminForPermissions(admin);
    setIsPermissionsOpen(true);
  };

  return (
    <div className="w-full font-roboto">
      <div className="border rounded-2xl border-gray-200 bg-white p-5 shadow-xs">
        {/* Toolbar Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6 pb-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, email, phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
              {["all", "active", "suspended"].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusFilter === st
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Add Admin Action */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 cursor-pointer rounded-sm shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
            // className="w-full lg:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add In-House Admin
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto min-h-[350px]">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : adminList.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-gray-800">No In-House Admins Found</h4>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery
                  ? "No admins matching your search terms."
                  : "Click 'Add In-House Admin' to register a staff member."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-3.5 px-4 rounded-l-xl">Admin Profile</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Permissions</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {adminList.map((admin: any) => {
                  const permissionsCount = Array.isArray(admin.permissions)
                    ? admin.permissions.length
                    : 0;

                  return (
                    <tr key={admin.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                            {admin.image ? (
                              <img
                                src={admin.image}
                                alt={`${admin.first_name}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>
                                {admin.first_name?.[0]?.toUpperCase()}
                                {admin.last_name?.[0]?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {admin.first_name} {admin.last_name}
                            </div>
                            <div className="text-xs text-indigo-500 font-semibold mt-0.5">
                              {admin.user_type === "inhouse_admin" ? "In-House Admin" : admin.user_type}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 text-xs font-medium text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{admin.email}</span>
                          </div>
                          {admin.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span>{admin.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-xs font-medium text-gray-600">
                        {admin.address ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{admin.address}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${admin.status === "active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-rose-50 text-rose-600 border border-rose-200"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${admin.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                          />
                          <span className="capitalize">{admin.status}</span>
                        </span>
                      </td>

                      {/* Permissions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-500 font-bold text-xs rounded-lg border border-indigo-100">
                            {permissionsCount} Assigned
                          </span>
                          <button
                            onClick={() => handleOpenPermissions(admin)}
                                                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"

                            // className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveMenuId(activeMenuId === admin.id ? null : admin.id)
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === admin.id && (
                            <div className="origin-top-right absolute right-4 top-12 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-1.5 z-40 animate-in fade-in duration-150">
                              <button
                                onClick={() => handleOpenPermissions(admin)}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                                Manage Permissions
                              </button>
                              <button
                                onClick={() => handleSuspendToggle(admin)}
                                disabled={isSuspending || isUnsuspending}
                                className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer ${admin.status === "active"
                                    ? "text-rose-600 hover:bg-rose-50"
                                    : "text-emerald-600 hover:bg-emerald-50"
                                  }`}
                              >
                                {admin.status === "active" ? (
                                  <>
                                    <UserX className="w-3.5 h-3.5" /> Suspend Admin
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" /> Unsuspend Admin
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">

            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded transition ${currentPage === 1
                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
                }`}
            >
              Prev
            </button>

            {Array.from(
              { length: Math.min(totalPages, 10) },
              (_, i) => {
                const maxVisible = 7;
                let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let end = start + maxVisible - 1;
                if (end > totalPages) { end = totalPages; start = Math.max(1, end - maxVisible + 1); }
                return start + i <= end ? start + i : null;
              }
            )
              .filter(Boolean)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p!)}
                  className={`px-3 py-1 border rounded cursor-pointer ${currentPage === p
                      ? "bg-primaryColor text-white"
                      : "bg-white text-black border border-primaryColor"
                    }`}
                >
                  {p}
                </button>
              ))}


            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded transition ${currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
                }`}
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* Create Admin Modal */}
      <CreateInHouseAdminModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Permissions Modal */}
      {selectedAdminForPermissions && (
        <ManagePermissionsModal
          isOpen={isPermissionsOpen}
          onClose={() => {
            setIsPermissionsOpen(false);
            setSelectedAdminForPermissions(null);
          }}
          adminId={selectedAdminForPermissions.id}
          adminName={`${selectedAdminForPermissions.first_name} ${selectedAdminForPermissions.last_name}`}
          initialPermissions={selectedAdminForPermissions.permissions || []}
        />
      )}
    </div>
  );
}
