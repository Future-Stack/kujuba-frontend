"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Download,
  Building,
  Mail,
  Phone,
  MapPin,
  Link2,
  Ban,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Filter,
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetClientsQuery,
  useSuspendClientMutation,
  useUnsuspendClientMutation,
  useDeleteClientMutation,
  ClientType,
} from "@/app/redux/features/clientApi";
import ClientDetailsModal from "./ClientDetailsModal";
import LinkBookingsModal from "./LinkBookingsModal";

export default function ClientsGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Selected client for details modal & link bookings modal
  const [detailClient, setDetailClient] = useState<ClientType | null>(null);
  const [linkModalClient, setLinkModalClient] = useState<ClientType | null>(null);

  // RTK Query Hooks
  const { data: clientsRes, isLoading, isError } = useGetClientsQuery();
  const [suspendClient, { isLoading: suspending }] = useSuspendClientMutation();
  const [unsuspendClient, { isLoading: unsuspending }] = useUnsuspendClientMutation();
  const [deleteClient, { isLoading: deleting }] = useDeleteClientMutation();

  const rawClients = clientsRes?.data;
  const clientsList: ClientType[] = useMemo(() => {
    if (Array.isArray(rawClients)) return rawClients;
    if (rawClients && typeof rawClients === "object" && "data" in rawClients) {
      return (rawClients as any).data || [];
    }
    return [];
  }, [rawClients]);

  // Filtering & Sorting
  const filteredAndSortedClients = useMemo(() => {
    let result = [...clientsList];

    if (selectedType !== "all") {
      result = result.filter(
        (c) => (c.client_type || "").toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase().includes(query) ||
          (c.company_name || "").toLowerCase().includes(query) ||
          (c.email || "").toLowerCase().includes(query) ||
          (c.address || "").toLowerCase().includes(query) ||
          (c.phone || "").toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [clientsList, searchQuery, selectedType, sortOrder]);

  // Pagination
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedClients, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);

  const getPageNumbers = (current: number, total: number, maxVisible = 5) => {
    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Handlers for Suspend / Unsuspend / Delete
  const handleSuspend = async (id: number) => {
    try {
      const res = await suspendClient(id).unwrap();
      toast.success(res?.message || "Client suspended successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to suspend client");
    }
  };

  const handleUnsuspend = async (id: number) => {
    try {
      const res = await unsuspendClient(id).unwrap();
      toast.success(res?.message || "Client activated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to activate client");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this client account?")) return;
    try {
      const res = await deleteClient(id).unwrap();
      toast.success(res?.message || "Client deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete client");
    }
  };

  // Export CSV
  const handleExport = () => {
    if (filteredAndSortedClients.length === 0) {
      toast.error("No client data to export.");
      return;
    }

    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Company Name",
      "Client Type",
      "Phone",
      "Address",
      "Status",
      "Total Inspections",
      "Completed Inspections",
      "Created At",
    ];

    const rows = filteredAndSortedClients.map((c) => [
      c.id,
      c.first_name,
      c.last_name,
      c.email,
      c.company_name,
      c.client_type,
      c.phone,
      c.address,
      c.status,
      c.total_inspections ?? 0,
      c.completed_inspections ?? 0,
      c.created_at ?? "",
    ]);

    const csvContent =
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v ?? ""}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "clients-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full font-roboto mt-4 antialiased">
      <div className="border rounded-sm border-[#E8E8E8] p-5 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all text-gray-800 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Client Type Filter */}
            <div className="relative w-full sm:w-auto">
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all text-gray-700 font-medium cursor-pointer"
                >
                  <option value="all">All Client Types</option>
                  <option value="insurance_company">Insurance Company</option>
                  <option value="realtor">Realtor</option>
                  <option value="broker">Broker</option>
                  <option value="agency">Agency</option>
                </select>

              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Client Data</span>
            </button>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-50 h-64 rounded-xl border border-gray-100 p-5" />
            ))}
          </div>
        ) : isError ? (
          <div className="w-full text-center py-16 bg-red-50/50 rounded-xl border border-red-100 text-red-600 font-medium text-sm">
            Failed to load clients. Please verify your connection or refresh the page.
          </div>
        ) : paginatedClients.length > 0 ? (
          viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {paginatedClients.map((client) => {
                const fullName = client.full_name || `${client.first_name || ""} ${client.last_name || ""}`.trim();
                const initials = fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                const isActive = client.status === "active";
                const isSuspended = client.status === "suspended";

                return (
                  <div
                    key={client.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Top Row: Avatar, Name & Status */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 shrink-0">
                            {client.image ? (
                              <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-100 shadow-sm">
                                <Image
                                  src={client.image}
                                  alt={fullName}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm border border-indigo-100">
                                {initials || "CL"}
                              </div>
                            )}
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                isActive
                                  ? "bg-emerald-500"
                                  : isSuspended
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                              }`}
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm leading-snug truncate group-hover:text-indigo-600 transition-colors">
                              {fullName}
                            </h4>
                            <p className="text-xs font-semibold text-indigo-600 truncate mt-0.5">
                              {client.company_name || "Independent"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : isSuspended
                              ? "bg-rose-50 text-rose-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {client.status}
                        </span>
                      </div>

                      {/* Client Type Pill */}
                      <div className="mb-4">
                        <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-md capitalize">
                          {(client.client_type || "Client").replace("_", " ")}
                        </span>
                      </div>

                      {/* Info Card Box */}
                      <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-2 mb-4 border border-slate-100 text-xs text-gray-600">
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{client.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{client.address || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer & Actions */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-3 px-1">
                        <span>Linked Inspections</span>
                        <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-md font-bold">
                          {client.total_inspections ?? 0}
                        </span>
                      </div>

                      {/* Action Bar */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setLinkModalClient(client)}
                            className="flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold py-2 px-2.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Link</span>
                          </button>

                          <button
                            onClick={() => setDetailClient(client)}
                            className="flex items-center justify-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-semibold py-2 px-2.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        </div>

                        {/* Secondary Quick Action Bar */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-2 px-1">
                          {isActive ? (
                            <button
                              onClick={() => handleSuspend(client.id)}
                              disabled={suspending}
                              className="text-[11px] font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Suspend</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnsuspend(client.id)}
                              disabled={unsuspending}
                              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Activate</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(client.id)}
                            disabled={deleting}
                            className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List / Table View */
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Company & Client</th>
                    <th className="py-3.5 px-4">Client Type</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4 text-center">Inspections</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {paginatedClients.map((client) => {
                    const fullName = client.full_name || `${client.first_name || ""} ${client.last_name || ""}`.trim();
                    const initials = fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    const isActive = client.status === "active";
                    const isSuspended = client.status === "suspended";

                    return (
                      <tr key={client.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 shrink-0">
                              {client.image ? (
                                <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-100">
                                  <Image
                                    src={client.image}
                                    alt={fullName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                                  {initials || "CL"}
                                </div>
                              )}
                              <span
                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                  isActive
                                    ? "bg-emerald-500"
                                    : isSuspended
                                    ? "bg-rose-500"
                                    : "bg-amber-500"
                                }`}
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm leading-snug">{fullName}</h4>
                              <p className="text-xs font-semibold text-indigo-600">{client.company_name || "Independent"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded capitalize">
                            {(client.client_type || "Client").replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 text-xs">{client.email}</td>
                        <td className="py-3.5 px-4 text-gray-600 text-xs">{client.phone || "N/A"}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-indigo-600">{client.total_inspections ?? 0}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isActive
                                ? "bg-emerald-50 text-emerald-600"
                                : isSuspended
                                ? "bg-rose-50 text-rose-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {client.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setLinkModalClient(client)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold rounded transition-colors cursor-pointer"
                            >
                              Link
                            </button>
                            <button
                              onClick={() => setDetailClient(client)}
                              className="px-2.5 py-1 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                            {isActive ? (
                              <button
                                onClick={() => handleSuspend(client.id)}
                                disabled={suspending}
                                className="p-1 text-amber-600 hover:bg-amber-50 rounded cursor-pointer disabled:opacity-50"
                                title="Suspend Client"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnsuspend(client.id)}
                                disabled={unsuspending}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer disabled:opacity-50"
                                title="Activate Client"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(client.id)}
                              disabled={deleting}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer disabled:opacity-50"
                              title="Delete Client"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="w-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium text-sm">
              No client accounts found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              currentPage === 1
                ? "opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-indigo-50 border-gray-200 cursor-pointer"
            }`}
          >
            Prev
          </button>

          {getPageNumbers(currentPage, totalPages, 7).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                currentPage === p
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              currentPage === totalPages
                ? "opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-indigo-50 border-gray-200 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Client Details Modal */}
      {detailClient && (
        <ClientDetailsModal
          client={detailClient}
          onClose={() => setDetailClient(null)}
          onSuspend={handleSuspend}
          onUnsuspend={handleUnsuspend}
          onDelete={handleDelete}
          onLinkBookings={(c) => {
            setDetailClient(null);
            setLinkModalClient(c);
          }}
        />
      )}

      {/* Link Bookings Modal */}
      {linkModalClient && (
        <LinkBookingsModal
          client={linkModalClient}
          open={!!linkModalClient}
          onClose={() => setLinkModalClient(null)}
        />
      )}
    </div>
  );
}
