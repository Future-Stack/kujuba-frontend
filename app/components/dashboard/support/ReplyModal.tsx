/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useState, useEffect } from "react";
import { SupportRequest } from "./SupportRequiest";



interface ReplyModalProps {
  request: SupportRequest | null;
  onClose: () => void;
  onSend: (id: string, answer: string) => void;
}

export default function ReplyModal({ request, onClose, onSend }: ReplyModalProps) {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (request) setAnswer("");
  }, [request]);

  if (!request) return null;

  const handleSend = () => {
    if (!answer.trim()) return;
    onSend(request.id, answer.trim());
    setAnswer("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50 " onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3">
            <img src={request.user.avatar} alt={request.user.name}
              className="w-9 h-9 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-semibold text-[#111827] leading-5 font-sora">{request.user.name}</p>
              <p className="text-xs font-normal leading-4 text-primaryColor">{request.user.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5C6470] font-normal font-roboto leading-4 ">{request.date}</span>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#f3f4f6] text-[#9ca3af] hover:text-[#374151] transition-colors">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="px-5 pt-4">
          <p className="text-base font-normal font-roboto leading-5 text-[#1D1D1D]">{request.question}</p>
        </div>

        {/* Answer input */}
        <div className="px-5 pt-3 pb-5">
          <div className="border border-[#e2e5eb] flex items-start gap-2 rounded-lg px-4 py-3 focus-within:border-[#4f46e5] transition-colors">
            <span className="text-base font-normal font-roboto text-[#1a1d23]">Ans: </span>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="write your ans here ......."
              rows={3}
              className="w-full mt-0.5 text-sm text-[#374151] placeholder:text-[#B5BCC8] outline-none resize-none bg-transparent "
            />
          </div>
        </div>

        {/* Send */}
        <div className="px-5 pb-5">
          <button
            onClick={handleSend}
            disabled={!answer.trim()}
            className="w-full py-3 text-sm font-semibold text-white bg-primaryColor hover:bg-[#4338ca] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}