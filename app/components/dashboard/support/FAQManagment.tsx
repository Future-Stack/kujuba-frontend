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

  // Add new FAQ
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

  return (
    <main className="min-h-screen py-6">
      <div className="space-y-3 mb-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <FAQSkeleton key={i} />)
        ) : (
          faqs.map((faq: FAQ, i: number) => (
            <FAQCard
              key={faq.id}
              faq={faq}
              index={i + 1}
              onEdit={(f) => setEditingFaq(f)}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
      </div>

      {/* Always visible Add form */}
      <div id="faq-form">
        <FAQForm
          index={faqs.length + 1}
          onPublish={handleAdd}
          loading={isAdding}
        />
      </div>

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