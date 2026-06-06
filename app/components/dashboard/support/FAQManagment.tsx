"use client";

import { useState } from "react";


import FAQCard, { FAQ } from "./FAQCard";
import FAQForm from "./FAQForm";
import DeleteModal from "./DeleteModal";

const INITIAL_FAQS: FAQ[] = [
  {
    id: "1",
    question: "Can I reschedule my inspection?",
    answer: "Yes. Homeowners can reschedule inspections through the app depending on inspector availability.",
    publishedAt: new Date("2024-01-15T09:36:00").toISOString(),
  },
  {
    id: "2",
    question: "What types of inspections are available?",
    answer:
      "The platform offers a variety of home inspection services, including Four-Point Inspections, Full Home Inspections, Roof Inspections, HVAC Inspections, Plumbing Inspections, Electrical Inspections, and Exterior & Interior Property Assessments. Available inspection types may vary based on your location and inspector availability.",
    publishedAt: new Date("2024-01-15T09:46:00").toISOString(),
  },
];

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>(INITIAL_FAQS);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
   const [showForm, setShowForm] = useState(false);

  const handlePublish = (question: string, answer: string) => {
    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editingFaq.id
            ? { ...f, question, answer, publishedAt: new Date().toISOString() }
            : f
        )
      );
      setEditingFaq(null);
      setShowForm(false);
    } else {
      setFaqs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          question,
          answer,
          publishedAt: new Date().toISOString(),
        },
      ]);
      setShowForm(false);
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      setFaqs((prev) => prev.filter((f) => f.id !== deleteId));
      if (editingFaq?.id === deleteId) setEditingFaq(null);
      setDeleteId(null);
    }
  };

  return (
    <main className="min-h-screen  py-8 ">
      <div className="">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d23] tracking-tight">FAQ Manager</h1>
          <p className="text-sm text-[#6b7280] mt-1">
            {faqs.length} {faqs.length === 1 ? "question" : "questions"} published
          </p>
        </div>

       

        <div className="space-y-3 mb-4">
          {faqs.map((faq, i) => (
            <FAQCard
              key={faq.id}
              faq={faq}
              index={i + 1}
              onEdit={(f) => {
                setEditingFaq(f);
                setTimeout(() => {
                  document.getElementById("faq-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
              }}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}

          {faqs.length === 0 && (
            <div className="text-center py-16 text-[#9ca3af]">
              <p className="text-sm">No FAQs yet. Add your first one below.</p>
            </div>
          )}
        </div>

        <div id="faq-form">
          <FAQForm
            index={faqs.length + 1}
            editingFaq={editingFaq}
            onPublish={handlePublish}
            onCancelEdit={() => setEditingFaq(null)}
          />
        </div>
        <div className="mt-6 text-right flex justify-end">
            {!showForm && (
            <button
              onClick={() => {
                setEditingFaq(null);
                setShowForm(true);
                setTimeout(() => {
                  document.getElementById("faq-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primaryColor hover:bg-[#4338ca] cursor-pointer rounded-sm transition-colors shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10 4v12M4 10h12" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Add Question</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
          </div>
      </div>

      <DeleteModal
        open={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </main>
  );
}