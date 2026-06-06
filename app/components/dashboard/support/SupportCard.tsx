"use client";

import { SupportRequest } from "./SupportRequiest";



interface SupportCardProps {
  request: SupportRequest;
  onReply: (request: SupportRequest) => void;
}

export default function SupportCard({ request, onReply }: SupportCardProps) {
  return (
    <div className="bg-white border border-[#F1F1F1] rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={request.user.avatar}
            alt={request.user.name}
            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-[#111827] leading-5 font-sora">{request.user.name}</p>
            <p className="text-xs font-normal leading-4 text-primaryColor">{request.user.role}</p>
          </div>
        </div>
        <span className="text-xs text-[#5C6470] font-normal font-roboto leading-4 flex-shrink-0 mt-1">{request.date}</span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[#4B5563] font-normal font-roboto leading-relaxed flex-1">
          {request.replied
            ? <span className="text-base font-normal font-roboto leading-5 text-[#1D1D1D]">{request.question}</span>
            : <span>&quot;{request.question}&quot;</span>
          }
        </p>
        {!request.replied && (
          <button
            onClick={() => onReply(request)}
            className="flex-shrink-0 px-2 py-1.5 text-base font-medium text-white bg-primaryColor hover:bg-[#4338ca] rounded-sm cursor-pointer transition-colors"
          >
            Reply
          </button>
        )}
      </div>

      {request.replied && request.answer && (
        <p className="mt-3 text-base text-[#090909] font-normal font-roboto leading-relaxed">
        Ans :
          {request.answer}
        </p>
      )}
    </div>
  );
}