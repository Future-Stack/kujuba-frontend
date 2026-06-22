/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Download, Eye, EyeIcon, FileText, X } from 'lucide-react';



interface ReportImage {
  id?: number | string;
  url: string;
  alt?: string;
}

interface ReportData {
  images?: ReportImage[];
  pdf_url?: string | null;
  report_url?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  fileName?: string | null;
  uploaded_at?: string | null;
  created_at?: string | null;
  status?: string | null;
  [key: string]: any;
}

interface Props {
  report?: ReportData | null;
}



function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}



export default function InspectionReportMedia({ report }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const images = report?.images ?? [];
  const pdfUrl = report?.pdf_url ?? report?.report_url ?? report?.file_url ?? null;
  const fileName =
    report?.file_name ?? report?.fileName ?? (pdfUrl ? pdfUrl.split("/").pop() : null);
  const uploadedOn = report?.uploaded_at ?? report?.created_at ?? null;
  const status = report?.status ?? null;


  const hasReport = !!report && (images.length > 0 || !!pdfUrl);

  const handleViewReport = () => {
    if (pdfUrl) window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadReport = () => {
    if (!pdfUrl) return;
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName || "inspection_report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloading(false);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 md:p-6 antialiased">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.1673 6.66667L10.0007 2.5L5.83398 6.66667" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 2.5V12.5" stroke="#5E65FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="text-lg font-semibold text-slate-900 font-sora tracking-tight">Inspection Report & Media</h2>
      </div>

      {!hasReport ? (
        /* ── Nothing uploaded yet ── */
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FileText className="w-8 h-8 text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">Report not uploaded yet</p>
          <p className="text-xs text-gray-300 mt-1">
            It will appear here once the inspector uploads it from the app.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* --- LEFT SIDE: UPLOADED IMAGES (only if any) --- */}
          {images.length > 0 && (
            <div className={`space-y-3 ${pdfUrl ? "lg:col-span-6" : "lg:col-span-12"}`}>
              <div className="flex items-center gap-1.5 text-[#364153] font-medium leading-4 text-sm font-roboto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="#364153" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.99935 7.33317C6.73573 7.33317 7.33268 6.73622 7.33268 5.99984C7.33268 5.26346 6.73573 4.6665 5.99935 4.6665C5.26297 4.6665 4.66602 5.26346 4.66602 5.99984C4.66602 6.73622 5.26297 7.33317 5.99935 7.33317Z" stroke="#364153" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 9.99996L11.9427 7.94263C11.6926 7.69267 11.3536 7.55225 11 7.55225C10.6464 7.55225 10.3074 7.69267 10.0573 7.94263L4 14" stroke="#364153" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Uploaded Images ({images.length})</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id ?? idx}
                    onClick={() => setSelectedImage(img.url)}
                    className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer border border-slate-100 transition duration-200 active:scale-95"
                  >
                    <img
                      src={img.url}
                      alt={img.alt ?? "Inspection photo"}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- RIGHT SIDE: PDF REPORT VIEWER (only if a pdf exists) --- */}
          {pdfUrl && (
            <div className={`space-y-3 ${images.length > 0 ? "lg:col-span-6" : "lg:col-span-12"}`}>
              <div className="text-[#364153] font-medium leading-4 text-sm font-roboto">
                PDF Report
              </div>

              <div className="bg-[#5E65FF0D] border border-[#5E65FF33] rounded-2xl p-3 flex flex-col justify-between min-h-[140px] space-y-4">

                <div className="flex items-start gap-3 justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#5E65FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#5E65FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 9H8" stroke="#5E65FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 13H8" stroke="#5E65FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 17H8" stroke="#5E65FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-normal text-[#101828] leading-5 font-sora truncate pr-2 max-w-[240px] sm:max-w-xs md:max-w-md lg:max-w-[200px] xl:max-w-xs">
                        {fileName ?? "Inspection_Report.pdf"}
                      </h4>
                      <p className="text-xs text-[#4A5565] font-normal leading-4 mt-0.5">
                        Uploaded: {formatDate(uploadedOn)}
                      </p>
                    </div>
                  </div>

                  {status && (
                    <span className="shrink-0 bg-white border border-slate-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-[#364153]">
                      {status}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleViewReport}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition duration-150 cursor-pointer"
                  >
                    <EyeIcon className="w-4 h-4 text-slate-500" />
                    View Report
                  </button>

                  <button
                    onClick={handleDownloadReport}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 transition duration-150 cursor-pointer"
                  >
                    <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* --- IMAGE PREVIEW MODAL --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="relative bg-white max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Image Preview</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-slate-900 flex justify-center items-center max-h-[70vh]">
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


