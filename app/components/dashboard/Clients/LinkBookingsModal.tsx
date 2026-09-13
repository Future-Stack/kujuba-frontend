"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { X, Search, Check, Link2, Calendar, MapPin, Building, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useLinkBookingsMutation, ClientType } from "@/app/redux/features/clientApi";
import { useGetInspectionManagementQuery } from "@/app/redux/features/inspectionApi";

type LinkBookingsModalProps = {
  client: ClientType | null;
  open: boolean;
  onClose: () => void;
};

export default function LinkBookingsModal({ client, open, onClose }: LinkBookingsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingIds, setSelectedBookingIds] = useState<number[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { data: inspectionsRes, isLoading: fetchingInspections } =
    useGetInspectionManagementQuery("all", { skip: !open });

  const [linkBookings, { isLoading: submitting }] = useLinkBookingsMutation();

  const rawData = inspectionsRes?.data || inspectionsRes?.inspections || [];
  const bookingsList: any[] = Array.isArray(rawData) ? rawData : rawData?.data || [];

  useEffect(() => {
    if (!open) return;
    setSelectedBookingIds([]);
    setSearchQuery("");
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

  if (!open || !client) return null;

  const toggleSelectBooking = (id: number) => {
    if (selectedBookingIds.includes(id)) {
      setSelectedBookingIds(selectedBookingIds.filter((bId) => bId !== id));
    } else {
      setSelectedBookingIds([...selectedBookingIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBookingIds.length === filteredBookings.length) {
      setSelectedBookingIds([]);
    } else {
      setSelectedBookingIds(filteredBookings.map((b) => b.id || b.booking_id));
    }
  };

  const filteredBookings = bookingsList.filter((b) => {
    const uid = (b.booking_uid || b.id || "").toString().toLowerCase();
    const address = (b.property_address || b.homeowner?.address || "").toLowerCase();
    const propType = (b.property_type || b.homeowner?.property_type || "").toLowerCase();
    const name = (b.homeowner?.name || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      uid.includes(query) ||
      address.includes(query) ||
      propType.includes(query) ||
      name.includes(query)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedBookingIds.length === 0) {
      toast.error("Please select at least one inspection booking to link.");
      return;
    }

    try {
      const res = await linkBookings({
        id: client.id,
        booking_ids: selectedBookingIds,
      }).unwrap();

      toast.success(
        res?.message ||
          `${selectedBookingIds.length} inspection booking(s) linked to ${client.company_name || client.first_name}`
      );
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to link inspection bookings."
      );
    }
  };

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
        className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] flex flex-col font-roboto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-sora font-bold text-gray-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-600" />
              Link Inspection Bookings
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Assign inspection bookings under{" "}
              <span className="font-semibold text-indigo-600">
                {client.company_name || `${client.first_name} ${client.last_name}`}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="py-4 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Booking ID, address, property type or homeowner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-600 transition-colors"
            />
          </div>
          {filteredBookings.length > 0 && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer shrink-0"
            >
              {selectedBookingIds.length === filteredBookings.length
                ? "Deselect All"
                : "Select All"}
            </button>
          )}
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 max-h-[400px] min-h-[220px]">
          {fetchingInspections ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Loading available bookings...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500 font-medium">
                No inspection bookings found matching your search.
              </p>
            </div>
          ) : (
            filteredBookings.map((item) => {
              const bId = item.id || item.booking_id;
              const isSelected = selectedBookingIds.includes(bId);

              return (
                <div
                  key={bId}
                  onClick={() => toggleSelectBooking(bId)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                      : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        #{item.booking_uid || `INS-${bId}`}
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                          item.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "assigned"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {item.property_type || item.homeowner?.property_type || "Inspection Booking"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {item.property_address || item.homeowner?.address || "Address N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>
                          {item.scheduled_date || "Date N/A"}{" "}
                          {item.scheduled_time ? `(${item.scheduled_time})` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <span className="text-xs text-gray-500 font-medium">
            {selectedBookingIds.length} booking(s) selected
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || selectedBookingIds.length === 0}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Linking..." : "Link Selected Bookings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
