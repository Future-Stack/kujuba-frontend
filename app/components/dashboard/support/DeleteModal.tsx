"use client";

interface DeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ open, onConfirm, onCancel }: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fef2f2] mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="#ef4444" strokeWidth="1.8">
            <path d="M6 2h8M4 5h12M5 5l1 12a1 1 0 001 1h6a1 1 0 001-1l1-12" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[#1a1d23] text-center mb-1.5">Delete this FAQ?</h3>
        <p className="text-sm text-[#6b7280] text-center mb-6">
          This action cannot be undone. The question and answer will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-medium text-[#374151] cursor-pointer border border-[#e2e5eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-semibold text-white cursor-pointer bg-[#ef4444] hover:bg-[#dc2626] rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}