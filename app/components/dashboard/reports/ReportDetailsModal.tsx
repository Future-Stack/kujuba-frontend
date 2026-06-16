"use client";

import Image from "next/image";
import { X, FileText, Image as ImageIcon, Video } from "lucide-react";
import { Report } from "@/app/redux/features/reportsApi";

type Props = {
  report: Report;
  onClose: () => void;
};

export default function ReportDetailsModal({ report, onClose }: Props) {
  const { report_id, inspection_id, report_details } = report;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl text-gray-900 font-bold mb-2">Report Details</h3>
            <p className="text-sm text-gray-500">
              {report_id} · {inspection_id}
            </p>
          </div>

          <button className="text-gray-800 cursor-pointer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h4 className="text-sm text-gray-800 font-semibold mb-2">Notes</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {report_details?.notes || "No notes provided."}
          </p>
        </div>

        {/* PDF */}
        {report_details?.report_file && (
          <a
            href={report_details.report_file}
            target="_blank"
            className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit"
          >
            <FileText size={16} />
            View PDF
          </a>
        )}

        {/* Photos */}
        {report_details?.media?.photos?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm text-gray-800 font-semibold mb-2 flex items-center gap-1">
              <ImageIcon size={15} /> Photos
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {report_details.media.photos.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                  unoptimized
                />
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {report_details?.media?.videos?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm text-gray-800 font-semibold mb-2 flex items-center gap-1">
              <Video size={15} /> Videos
            </h4>

            {report_details.media.videos.map((src, i) => (
              <video key={i} src={src} controls className="w-full rounded-lg mb-2" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}