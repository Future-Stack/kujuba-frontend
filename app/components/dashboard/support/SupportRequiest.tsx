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


export default function SupportRequests() {

  const [activeRequest, setActiveRequest] = useState<SupportRequest | null>(null);

  const { data, isLoading } = useGetSupportTicketsQuery();

const [replySupport] = useReplySupportTicketMutation();

const requests =
  data?.data?.map((item: any) => ({
    id: String(item.id),

    user: {
      name: item.user?.name,
      role:
        item.user?.user_type === "inspector"
          ? "HVAC Inspector"
          : "Home owner",

      avatar:
        item.user?.image ||
        "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(item.user?.name),
    },

    question: item.explanation,
    date: item.created_at?.split("T")[0],

    replied: !!item.reply,
    answer: item.reply,
  })) || [];

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

  const pending = requests.filter((r:any) => !r.replied);
  const replied = requests.filter((r:any) => r.replied);

  const ownerPending = pending.filter((r:any) => r.user.role === "Home owner");
  const inspectorPending = pending.filter((r:any) => r.user.role === "HVAC Inspector");
  const ownerReplied = replied.filter((r:any) => r.user.role === "Home owner");
  const inspectorReplied = replied.filter((r:any) => r.user.role === "HVAC Inspector");

  if (isLoading) {
  return (
    <div className="p-6">
      Loading...
    </div>
  );
}

  return (
    <main className="min-h-screen  py-6 ">
      <div className="">

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
                {ownerPending.map((r:any) => (
                  <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-xs font-normal text-[#5C6470] font-roboto leading-5  sm:hidden">
                  Inspector
                </p>
                {inspectorPending.map((r:any) => (
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
                {ownerReplied.map((r:any) => (
                  <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-xs font-normal text-[#5C6470] font-roboto leading-5  sm:hidden">
                  Inspector
                </p>
                {inspectorReplied.map((r:any) => (
                  <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                ))}
              </div>
            </div>
          </div>
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