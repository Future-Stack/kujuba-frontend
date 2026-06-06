/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { FAQ } from "./FAQCard";


interface FAQFormProps {
  index: number;
  editingFaq?: FAQ | null;
  onPublish: (question: string, answer: string) => void;
  onCancelEdit?: () => void;
}

export default function FAQForm({ index, editingFaq, onPublish, onCancelEdit }: FAQFormProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (editingFaq) {
      setQuestion(editingFaq.question);
      setAnswer(editingFaq.answer);
    } else {
      setQuestion("");
      setAnswer("");
    }
  }, [editingFaq]);

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) return;
    onPublish(question.trim(), answer.trim());
    setQuestion("");
    setAnswer("");
  };

  const handleCancel = () => {
    setQuestion("");
    setAnswer("");
    onCancelEdit?.();
  };

  const isEditing = !!editingFaq;

  return (
    <div className="bg-white rounded-3xl border border-[#e2e5eb]  p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base md:text-lg font-sora  font-semibold text-[#090909]">
          {isEditing ? "Edit Question" : "Question :"}
        </h3>
        {isEditing && (
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#fef2f2] text-[#9ca3af] hover:text-[#ef4444] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 border border-[#e2e5eb] p-4 rounded-[16px] focus-within:border-[#F3F3F3] transition-colors">
          <span className="text-lg font-semibold font-sora text-gray-900 flex-shrink-0">{isEditing ? "Q." : `${index}.`}</span>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="write the question here......"
            className="flex-1 text-base text-[#374151] placeholder:text-[#B5BCC8] outline-none bg-transparent py-1"
          />
        </div>
      </div>

      <div className="mb-5">
        <p className="text-lg font-semibold font-sora text-gray-900 mb-2">Ans :</p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="write the answer here....."
          rows={3}
          className="w-full text-base text-[#374151] placeholder:text-[#B5BCC8]  outline-none  border border-[#e2e5eb] rounded-[16px] px-3 py-2.5 resize-none focus:border-[#4f46e5] focus:bg-white transition-colors"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        {isEditing && (
          <button
            onClick={handleCancel}
            className="px-5 py-2 text-base font-medium text-[#6b7280] border border-[#e2e5eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!question.trim() || !answer.trim()}
          className="px-6 py-2 text-base font-semibold text-white bg-primaryColor hover:bg-[#4338ca] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg  cursor-pointer transition-colors"
        >
          {isEditing ? "Update" : "Publish"}
        </button>
      </div>
    </div>
  );
}