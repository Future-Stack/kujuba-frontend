import React, { useState } from 'react';
import Image from 'next/image';
import { BookMarked, Download, Eye, EyeIcon } from 'lucide-react';

// Mock Data matching the design
const IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be', alt: 'House model and keys' },
  { id: 2, src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', alt: 'Modern backyard pool view' },
  { id: 3, src: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f', alt: 'Suburban house front yard' }
];

const REPORT_INFO = {
  fileName: "Four_Point_Inspection_Report_FP2048.pdf",
  uploadDate: "May 28, 2026",
  status: "Approved"
};

export default function InspectionReportMedia() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Simulated handlers for UI functionality
  const handleViewReport = () => {
    alert(`Opening viewer for: ${REPORT_INFO.fileName}`);
  };

  const handleDownloadReport = () => {
    setIsDownloading(true);
    // Simulate API download lag
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Downloading: ${REPORT_INFO.fileName}`);
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 md:p-6  antialiased">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#5E65FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14.1673 6.66667L10.0007 2.5L5.83398 6.66667" stroke="#5E65FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 2.5V12.5" stroke="#5E65FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        <h2 className="text-lg font-semibold text-slate-900 font-sora tracking-tight">Inspection Report & Media</h2>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* --- LEFT SIDE: UPLOADED IMAGES --- */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center gap-1.5 text-[#364153] font-medium leading-4 text-sm font-roboto  ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="#364153" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.99935 7.33317C6.73573 7.33317 7.33268 6.73622 7.33268 5.99984C7.33268 5.26346 6.73573 4.6665 5.99935 4.6665C5.26297 4.6665 4.66602 5.26346 4.66602 5.99984C4.66602 6.73622 5.26297 7.33317 5.99935 7.33317Z" stroke="#364153" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 9.99996L11.9427 7.94263C11.6926 7.69267 11.3536 7.55225 11 7.55225C10.6464 7.55225 10.3074 7.69267 10.0573 7.94263L4 14" stroke="#364153" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            <span>Uploaded Images ({IMAGES.length})</span>
          </div>

          {/* Responsive Gallery Grid */}
          <div className="grid grid-cols-3 gap-3">
            {IMAGES.map((img) => (
              <div 
                key={img.id}
                onClick={() => setSelectedImage(img.src)}
                className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer border border-slate-100 transition duration-200 active:scale-95"
              >
                {/* Fallback layout using plain img tags for direct copy-paste convenience */}
                {/* Replace with Next.js <Image /> in production for optimal optimization */}
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                {/* Hover overlay mask */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT SIDE: PDF REPORT VIEWER --- */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-[#364153] font-medium leading-4 text-sm font-roboto">
            PDF Report
          </div>

          {/* Interactive Report Card Container */}
          <div className="bg-[#5E65FF0D] border border-[#5E65FF33] rounded-2xl p-3 flex flex-col justify-between min-h-[140px] space-y-4">
            
            {/* Top metadata row */}
            <div className="flex items-start gap-3 justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#5E65FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#5E65FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 9H8" stroke="#5E65FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 13H8" stroke="#5E65FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 17H8" stroke="#5E65FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-normal text-[#101828] leading-5 font-sora truncate pr-2 max-w-[240px] sm:max-w-xs md:max-w-md lg:max-w-[200px] xl:max-w-xs">
                    {REPORT_INFO.fileName}
                  </h4>
                  <p className="text-xs text-[#4A5565] font-normal leading-4 mt-0.5">
                    Uploaded: {REPORT_INFO.uploadDate}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span className="shrink-0 bg-white border border-slate-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-[#364153] ">
                {REPORT_INFO.status}
              </span>
            </div>

            {/* Bottom action row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button 
                onClick={handleViewReport}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl  hover:bg-slate-50 active:bg-slate-100 transition duration-150 cursor-pointer"
              >
                <EyeIcon className="w-4 h-4 text-slate-500" />
                View Report
              </button>

              <button 
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 transition duration-150 cursor-pointer"
              >
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* --- IMAGE INTERACTION MODAL OVERLAY --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="relative bg-white max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Image Preview</span>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition"
              >
                <BookMarked className="w-5 h-5" />
              </button>
            </div>
            {/* Preview image */}
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