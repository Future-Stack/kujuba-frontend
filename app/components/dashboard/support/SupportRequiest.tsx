/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import SupportCard from "./SupportCard";
import ReplyModal from "./ReplyModal";
import { useGetSupportTicketsQuery, useReplySupportTicketMutation } from "@/app/redux/features/supportApi";
import { toast } from "react-toastify";
export type UserRole = "Home owner" | "HVAC Inspector";

export interface SupportRequest {
  id: string;
  user: {
    name: string;
    role: UserRole;
    avatar: string;
  };
  question: string;
  date: string;
  replied?: boolean;
  answer?: string;
}

const SupportSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="p-5 border rounded-2xl bg-white space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="p-5 border rounded-2xl bg-white space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

export default function SupportRequests() {

  const [activeRequest, setActiveRequest] = useState<SupportRequest | null>(null);

  const { data, isLoading } = useGetSupportTicketsQuery();

  const [replySupport] = useReplySupportTicketMutation();

  const rawList = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.result)
    ? data.result
    : Array.isArray(data)
    ? data
    : [];

  const requests: SupportRequest[] = rawList.map((item: any) => {
    const userName = item.user?.name || item.user?.full_name || item.name || "User";
    const rawRole = item.user?.user_type || item.user_type || item.role || item.user?.role || "";
    const userRole: UserRole =
      String(rawRole).toLowerCase().includes("inspector")
        ? "HVAC Inspector"
        : "Home owner";

    const userAvatar =
      item.user?.image ||
      item.user?.avatar ||
      item.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;

    const questionText =
      item.explanation ||
      item.question ||
      item.message ||
      item.description ||
      item.subject ||
      "";

    const dateStr = item.created_at
      ? String(item.created_at).split("T")[0]
      : item.createdAt
      ? String(item.createdAt).split("T")[0]
      : item.date || "";

    const isReplied = Boolean(item.reply || item.is_replied || item.replied);
    const answerText = item.reply || item.answer || item.reply_message || "";

    return {
      id: String(item.id || item._id),
      user: {
        name: userName,
        role: userRole,
        avatar: userAvatar,
      },
      question: questionText,
      date: dateStr,
      replied: isReplied,
      answer: answerText,
    };
  });

  const handleSend = async (
    id: string,
    answer: string
  ) => {
    try {
      await replySupport({
        id: Number(id),
        reply: answer,
      }).unwrap();

      toast.success("Reply sent successfully");

      setActiveRequest(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to send reply"
      );
    }
  };

  const pending = requests.filter((r: SupportRequest) => !r.replied);
  const replied = requests.filter((r: SupportRequest) => r.replied);

  const ownerPending = pending.filter((r: SupportRequest) => r.user.role === "Home owner");
  const inspectorPending = pending.filter((r: SupportRequest) => r.user.role === "HVAC Inspector");
  const ownerReplied = replied.filter((r: SupportRequest) => r.user.role === "Home owner");
  const inspectorReplied = replied.filter((r: SupportRequest) => r.user.role === "HVAC Inspector");

  if (isLoading) {
    return (
      <main className="py-6">
        <SupportSkeleton />
      </main>
    );
  }

  return (
    <main className="py-2">
      <div className="">
        {requests.length === 0 ? (
          <div className="bg-white border border-[#F1F1F1] rounded-2xl p-12 flex flex-col items-center justify-center text-center my-4">
            <div className="w-14 h-14 bg-indigo-50 text-primaryColor rounded-full flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#111827] font-sora mb-1">
              No Support Requests
            </h3>
            <p className="text-sm text-[#5C6470] font-roboto max-w-sm">
              There are currently no support requests to display.
            </p>
          </div>
        ) : (
          <>
            {/* Pending */}
            {pending.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <p className="text-xs font-normal text-[#5C6470] font-roboto leading-5 ">
                    Home owner
                  </p>
                  <p className="text-xs  font-normal text-[#5C6470] font-roboto leading-5  hidden sm:block">
                    Inspector
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {ownerPending.map((r: SupportRequest) => (
                      <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-normal text-[#5C6470] font-roboto leading-5  sm:hidden">
                      Inspector
                    </p>
                    {inspectorPending.map((r: SupportRequest) => (
                      <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Replied */}
            {replied.length > 0 && (
              <div>
                <h2 className="text-base font-normal text-[#090909] leading-5 mb-4">Replied</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <p className="text-xs font-normal text-[#5C6470] font-roboto leading-5 ">
                    Home owner
                  </p>
                  <p className="text-xs  font-normal text-[#5C6470] font-roboto leading-5  hidden sm:block">
                    Inspector
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {ownerReplied.map((r: SupportRequest) => (
                      <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-normal text-[#5C6470] font-roboto leading-5  sm:hidden">
                      Inspector
                    </p>
                    {inspectorReplied.map((r: SupportRequest) => (
                      <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ReplyModal
        request={activeRequest}
        onClose={() => setActiveRequest(null)}
        onSend={handleSend}
      />
    </main>
  );
}