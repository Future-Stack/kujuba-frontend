"use client";

import { useState } from "react";
import SupportCard from "./SupportCard";
import ReplyModal from "./ReplyModal";
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

const AVATAR_OWNER = "https://randomuser.me/api/portraits/men/32.jpg";
const AVATAR_INSPECTOR = "https://randomuser.me/api/portraits/men/45.jpg";

const INITIAL_REQUESTS: SupportRequest[] = [
  {
    id: "1",
    user: { name: "Marcus Johnson", role: "Home owner", avatar: AVATAR_OWNER },
    question: "What types of inspections are available?",
    date: "2026-05-14",
    replied: false,
  },
  {
    id: "2",
    user: { name: "Marcus Johnson", role: "HVAC Inspector", avatar: AVATAR_INSPECTOR },
    question: "What types of inspections are available?",
    date: "2026-05-14",
    replied: false,
  },
  {
    id: "3",
    user: { name: "Marcus Johnson", role: "Home owner", avatar: AVATAR_OWNER },
    question: "What types of inspections are available?",
    date: "2026-05-14",
    replied: false,
  },
  {
    id: "4",
    user: { name: "Marcus Johnson", role: "HVAC Inspector", avatar: AVATAR_INSPECTOR },
    question: "What types of inspections are available?",
    date: "2026-05-14",
    replied: false,
  },
  {
    id: "5",
    user: { name: "Marcus Johnson", role: "Home owner", avatar: AVATAR_OWNER },
    question: "What types of inspections are available?",
    date: "2026-05-14",
    replied: false,
  },
  {
    id: "6",
    user: { name: "Marcus Johnson", role: "HVAC Inspector", avatar: AVATAR_INSPECTOR },
    question: "What types of inspections are available?",
    date: "2026-05-14",
    replied: false,
  },
  {
    id: "7",
    user: { name: "Marcus Johnson", role: "Home owner", avatar: AVATAR_OWNER },
    question: "What types of inspections are available?",
    date: "2026-05-14",
    replied: true,
    answer:
      "The platform offers a variety of home inspection services, including Four-Point Inspections, Full Home Inspections, Roof Inspections, HVAC Inspections, Plumbing Inspections, Electrical Inspections, and Exterior & Interior Property Assessments. Available inspection types may vary based on your location and inspector availability.",
  },
  {
    id: "8",
    user: { name: "Marcus Johnson", role: "HVAC Inspector", avatar: AVATAR_INSPECTOR },
    question: "What types of inspections are available?",
    date: "2026-05-14",
    replied: true,
    answer:
      "The platform offers a variety of home inspection services, including Four-Point Inspections, Full Home Inspections, Roof Inspections, HVAC Inspections, Plumbing Inspections, Electrical Inspections, and Exterior & Interior Property Assessments. Available inspection types may vary based on your location and inspector availability.",
  },
];

export default function SupportRequests() {
  const [requests, setRequests] = useState<SupportRequest[]>(INITIAL_REQUESTS);
  const [activeRequest, setActiveRequest] = useState<SupportRequest | null>(null);

  const handleSend = (id: string, answer: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, replied: true, answer } : r))
    );
  };

  const pending = requests.filter((r) => !r.replied);
  const replied = requests.filter((r) => r.replied);

  const ownerPending = pending.filter((r) => r.user.role === "Home owner");
  const inspectorPending = pending.filter((r) => r.user.role === "HVAC Inspector");
  const ownerReplied = replied.filter((r) => r.user.role === "Home owner");
  const inspectorReplied = replied.filter((r) => r.user.role === "HVAC Inspector");

  return (
    <main className="min-h-screen  py-6 ">
      <div className="">

        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d23] tracking-tight">
            Support Requests
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            {pending.length} pending · {replied.length} replied
          </p>
        </div> */}

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
                {ownerPending.map((r) => (
                  <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-xs font-normal text-[#5C6470] font-roboto leading-5  sm:hidden">
                  Inspector
                </p>
                {inspectorPending.map((r) => (
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
                {ownerReplied.map((r) => (
                  <SupportCard key={r.id} request={r} onReply={setActiveRequest} />
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-xs font-normal text-[#5C6470] font-roboto leading-5  sm:hidden">
                  Inspector
                </p>
                {inspectorReplied.map((r) => (
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