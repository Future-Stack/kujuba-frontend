"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FAQ } from "./FAQCard";

interface FAQEditModalProps {
  faq: FAQ;
  loading?: boolean;
  onUpdate: (question: string, answer: string) => void;
  onClose: () => void;
}

export default function FAQEditModal({ faq, loading, onUpdate, onClose }: FAQEditModalProps) {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
  }, [faq]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) return;
    onUpdate(question.trim(), answer.trim());
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#e2e5eb] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base md:text-lg font-sora font-semibold text-[#090909]">
            Edit Question
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#fef2f2] text-[#9ca3af] hover:text-[#ef4444] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Question input */}
        <div className="mb-4">
          <p className="text-lg font-semibold font-sora text-gray-900 mb-2">Q.</p>
          <div className="flex items-center gap-2 border border-[#e2e5eb] p-4 rounded-[16px] focus-within:border-[#4f46e5] transition-colors">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Write the question here..."
              className="flex-1 text-base text-[#374151] placeholder:text-[#B5BCC8] outline-none bg-transparent py-1"
            />
          </div>
        </div>

        {/* Answer textarea */}
        <div className="mb-6">
          <p className="text-lg font-semibold font-sora text-gray-900 mb-2">Ans :</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write the answer here..."
            rows={4}
            className="w-full text-base text-[#374151] placeholder:text-[#B5BCC8] outline-none border border-[#e2e5eb] rounded-[16px] px-3 py-2.5 resize-none focus:border-[#4f46e5] transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-base font-medium text-[#6b7280] border border-[#e2e5eb] rounded-lg hover:bg-[#f9fafb] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!question.trim() || !answer.trim() || loading}
            className="px-6 py-2 text-base font-semibold text-white bg-primaryColor hover:bg-[#4338ca] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}