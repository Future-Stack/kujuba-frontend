/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import FAQCard, { FAQ } from "./FAQCard";
import FAQForm from "./FAQForm";

import DeleteModal from "./DeleteModal";
import { useAddFaqMutation, useDeleteFaqMutation, useGetFaqsQuery, useUpdateFaqMutation } from "@/app/redux/features/faqApi";
import { toast } from "react-toastify";
import FAQEditModal from "./FaqEditModal";

const FAQSkeleton = () => (
  <div className="p-4 border rounded-xl animate-pulse space-y-3 bg-white">
    <div className="flex justify-between">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-6 w-6 bg-gray-200 rounded"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-full"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    <div className="h-2 bg-gray-200 rounded w-1/3 ml-auto"></div>
  </div>
);

export default function FAQManagement() {
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetFaqsQuery();
  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 10;

  const faqs =
    data?.data
      ?.slice()
      .sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .map((item: any) => ({
        id: String(item.id),
        question: item.question,
        answer: item.answers,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })) || [];


  const handleAdd = async (question: string, answer: string) => {
    try {
      await addFaq({ question, answers: answer, status: true }).unwrap();
      toast.success("FAQ added successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Update FAQ from modal
  const handleUpdate = async (question: string, answer: string) => {
    if (!editingFaq) return;
    try {
      await updateFaq({
        id: editingFaq.id,
        data: { question, answers: answer, status: true },
      }).unwrap();
      toast.success("FAQ updated successfully");
      setEditingFaq(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteFaq(Number(deleteId)).unwrap();
      toast.success("FAQ deleted successfully");
      if (editingFaq?.id === deleteId) setEditingFaq(null);
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  const totalPages = Math.ceil(faqs.length / ITEMS_PER_PAGE);
const paginatedFaqs = faqs.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

  return (
    <main className="min-h-screen py-6">
       {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold font-sora text-gray-900">FAQ Management</h1>
    <button
      onClick={() => setIsAddModalOpen(true)}
      className="px-5 py-2.5 bg-primaryColor hover:bg-[#4338ca] text-white font-semibold text-sm rounded-lg cursor-pointer transition-colors"
    >
      + Add FAQ
    </button>
  </div>
      <div className="space-y-3 mb-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <FAQSkeleton key={i} />)
        ) : (
          faqs.map((faq: FAQ, i: number) => (
            <FAQCard
              key={faq.id}
              faq={faq}
              index={(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
              onEdit={(f) => setEditingFaq(f)}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
      </div>

      {/* Always visible Add form */}
{/* Add FAQ Modal */}
{isAddModalOpen && (
  <div  onClick={() => setIsAddModalOpen(false)}  className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div  onClick={(e) => e.stopPropagation()}  className="bg-white rounded-3xl w-full max-w-xl shadow-xl">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h2 className="text-lg font-bold font-sora text-gray-900">Add New FAQ</h2>
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <FAQForm
        index={faqs.length + 1}
        onPublish={async (q, a) => {
          await handleAdd(q, a);
          setIsAddModalOpen(false);
        }}
        loading={isAdding}
      />
    </div>
  </div>
)}

      {/* Edit Modal */}
      {editingFaq && (
        <FAQEditModal
          faq={editingFaq}
          loading={isUpdating}
          onUpdate={handleUpdate}
          onClose={() => setEditingFaq(null)}
        />
      )}

      <DeleteModal
        open={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {totalPages > 1 && (
  <div className="flex items-center justify-center gap-1.5 my-6">
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage <= 1}
            className={`px-3 py-1 border rounded transition ${
    currentPage === 1
      ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
      : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
  }`}
    >
     Prev
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce<(number | "...")[]>((acc, p, i, arr) => {
        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
        acc.push(p);
        return acc;
      }, [])
      .map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => setCurrentPage(p as number)}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-primaryColor text-white border border-primaryColor"
                : "border border-primaryColor cursor-pointer text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
      )}
    <button
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage >= totalPages}
           className={`px-3 py-1 border rounded transition ${
    currentPage === totalPages
      ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
      : "cursor-pointer hover:bg-blue-50 text-gray-500 border-primaryColor"
  }`}
    >
      Next
    </button>
  </div>
)}
    </main>
  );
}




// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";


// import FAQCard, { FAQ } from "./FAQCard";
// import FAQForm from "./FAQForm";
// import DeleteModal from "./DeleteModal";
// import { useAddFaqMutation, useDeleteFaqMutation, useGetFaqsQuery, useUpdateFaqMutation } from "@/app/redux/features/faqApi";
// import { toast } from "react-toastify";


// const FAQSkeleton = () => {
//   return (
//     <div className="p-4 border rounded-xl animate-pulse space-y-3 bg-white">
//       <div className="flex justify-between">
//         <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//         <div className="h-6 w-6 bg-gray-200 rounded"></div>
//       </div>

//       <div className="h-3 bg-gray-200 rounded w-full"></div>
//       <div className="h-3 bg-gray-200 rounded w-5/6"></div>

//       <div className="h-2 bg-gray-200 rounded w-1/3 ml-auto"></div>
//     </div>
//   );
// };


// export default function FAQManagement() {

//   const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//    const [showForm, setShowForm] = useState(false);

//    const { data, isLoading } = useGetFaqsQuery();

// const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
// const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
// const [deleteFaq] = useDeleteFaqMutation();

// const faqs =
//   data?.data
//     ?.slice()
//     .sort(
//       (a: any, b: any) =>
//         new Date(a.created_at).getTime() -
//         new Date(b.created_at).getTime()
//     )
//     .map((item: any) => ({
//       id: String(item.id),
//       question: item.question,
//       answer: item.answers,
//       createdAt: item.created_at,
//     updatedAt: item.updated_at,
//     })) || [];

// const handlePublish = async (
//   question: string,
//   answer: string
// ) => {
//   try {
//     if (editingFaq) {
//       await updateFaq({
//         id: editingFaq.id,
//         data: {
//           question,
//           answers: answer,
//           status: true,
//         },
//       }).unwrap();

//       toast.success("FAQ updated successfully");
//       setEditingFaq(null);
//     } else {
//       await addFaq({
//         question,
//         answers: answer,
//         status: true,
//       }).unwrap();

//       toast.success("FAQ added successfully");
//     }

//     setShowForm(false);
//   } catch (error: any) {
//     toast.error(
//       error?.data?.message || "Something went wrong"
//     );
//   }
// };

// const confirmDelete = async () => {
//   if (!deleteId) return;

//   try {
//     await deleteFaq(Number(deleteId)).unwrap();

//     toast.success("FAQ deleted successfully");

//     if (editingFaq?.id === deleteId) {
//       setEditingFaq(null);
//     }

//     setDeleteId(null);
//   } catch (error: any) {
//     toast.error(
//       error?.data?.message || "Delete failed"
//     );
//   }
// };

//   return (
//     <main className="min-h-screen  py-6 ">
//       <div className="">
    
//         <div className="space-y-3 mb-4">
//      {isLoading ? (
//   <>
//     {Array.from({ length: 5 }).map((_, i) => (
//       <FAQSkeleton key={i} />
//     ))}
//   </>
// ) : (faqs.map((faq: FAQ, i: number) => (
//   <FAQCard
//     key={faq.id}
//     faq={faq}
//     index={i + 1}
//     onEdit={(f) => setEditingFaq(f)}
//     onDelete={(id) => setDeleteId(id)}
//   />
// )))}

//           {/* {faqs.length === 0 && (
//             <div className="text-center py-16 text-[#9ca3af]">
//               <p className="text-sm">No FAQs yet. Add your first one below.</p>
//             </div>
//           )} */}
//         </div>

//         <div id="faq-form">
//           <FAQForm
//             index={faqs.length + 1}
//             editingFaq={editingFaq}
//             onPublish={handlePublish}
//             onCancelEdit={() => setEditingFaq(null)}
//              loading={isAdding || isUpdating}
//           />
//         </div>
//         {/* <div className="mt-6 text-right flex justify-end">
//             {!showForm && (
//             <button
//               onClick={() => {
//                 setEditingFaq(null);
//                 setShowForm(true);
//                 setTimeout(() => {
//                   document.getElementById("faq-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
//                 }, 50);
//               }}
//               className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primaryColor hover:bg-[#4338ca] cursor-pointer rounded-sm transition-colors shadow-sm"
//             >
//               <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <path d="M10 4v12M4 10h12" strokeLinecap="round" />
//               </svg>
//               <span className="hidden sm:inline">Add Question</span>
//               <span className="sm:hidden">Add</span>
//             </button>
//           )}
//           </div> */}
//       </div>

//       <DeleteModal
//         open={!!deleteId}
//         onConfirm={confirmDelete}
//         onCancel={() => setDeleteId(null)}
//       />
//     </main>
//   );
// }