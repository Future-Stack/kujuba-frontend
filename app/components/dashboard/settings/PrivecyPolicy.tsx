/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Eraser,
  FileText,
} from "lucide-react";
import { Page, useCreatePageMutation, useDeletePageMutation, useGetPagesQuery, useUpdatePageMutation } from "@/app/redux/features/pagesApi";
import { toast } from "react-toastify";


type PageStatus = "Active" | "Inactive";

const slugify = (title: string) =>
  "/page/" +
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Backend can send status as 1/0 or "Active"/"Inactive" - normalize it for the UI
const getStatusLabel = (status: Page["status"]): PageStatus =>
  status === 1 || status === "1" || status === "Active" ? "Active" : "Inactive";

export default function DynamicPages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Page | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formStatus, setFormStatus] = useState<PageStatus>("Active");
  const [formContent, setFormContent] = useState("");
const [openStatus, setOpenStatus] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetPagesQuery();
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();
  const [deletePage] = useDeletePageMutation();

  const pages: Page[] = Array.isArray(data?.data)
    ? data.data
    : data?.data
    ? [data.data]
    : [];

  // Load content into the editor whenever the modal opens / target changes
  useEffect(() => {
    if (isModalOpen && editorRef.current) {
      editorRef.current.innerHTML = formContent || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, editingId]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormStatus("Active");
    setFormContent("");
    setIsModalOpen(true);
  };

  const openEditModal = (page: Page) => {
    setEditingId(page.id);
    setFormTitle(page.title);
    setFormStatus(getStatusLabel(page.status));
    setFormContent(page.content);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const syncContent = () => {
    if (editorRef.current) setFormContent(editorRef.current.innerHTML);
  };

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncContent();
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL");
    if (url) exec("createLink", url);
  };

  const insertImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) exec("insertImage", url);
  };

const handleSave = async () => {
  const title = formTitle.trim();
  if (!title) {
    toast.error("Title is required");
    return;
  }

  const payload = {
    title,
    slug: slugify(title),
    content: formContent,
    status: formStatus === "Active" ? 1 : 0,
  };

  try {
    const res =
      editingId !== null
        ? await updatePage({ id: editingId, body: payload }).unwrap()
        : await createPage(payload).unwrap();

    toast.success(res?.message || "Saved successfully");
    setIsModalOpen(false);
  } catch (error: any) {
    toast.error(error?.data?.message || "Something went wrong");
  }
};

const confirmDelete = async () => {
  if (!deleteTarget) return;

  try {
    const res = await deletePage(deleteTarget.id).unwrap();

    toast.success(res?.message || "Deleted successfully");
    setDeleteTarget(null);
  } catch (error: any) {
    toast.error(error?.data?.message || "Delete failed");
  }
};

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-[#000000] text-xl md:text-2xl font-semibold font-sora">Pages</h2>
          <p className="text-[#B5BCC8] text-sm md:text-base font-roboto mt-1">
            Manage dynamic pages like Privacy Policy, Terms &amp; Conditions, About, etc.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primaryColor text-white font-sora font-semibold text-sm px-5 py-3 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={18} />
          Create New Page
        </button>
      </div>

      {/* Table */}
      <div className="border border-[#E7E8FF] rounded-[14px] overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="bg-[#F7F7FF] text-[#B5BCC8] font-roboto text-xs uppercase tracking-wider">
              <th className="px-5 py-4 font-medium">Title</th>
              <th className="px-5 py-4 font-medium">Slug</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
         <tbody>
  {isLoading ? (
    [...Array(5)].map((_, i) => (
      <tr key={i} className="border-t border-[#E7E8FF] animate-pulse">
        {/* Title */}
        <td className="px-5 py-4">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </td>

        {/* Slug */}
        <td className="px-5 py-4">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </td>

        {/* Status */}
        <td className="px-5 py-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </td>

        {/* Actions */}
        <td className="px-5 py-4 text-right">
          <div className="flex justify-end gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          </div>
        </td>
      </tr>
    ))
  ) : pages.length === 0 ? (
    <tr>
      <td colSpan={4} className="px-5 py-14 text-center">
        <FileText className="mx-auto mb-3 text-[#B5BCC8]" size={32} />
        <p className="text-[#B5BCC8] font-roboto">
          No pages yet. Create your first one.
        </p>
      </td>
    </tr>
  ) : (
    pages.map((page) => {
      const statusLabel = getStatusLabel(page.status);

      return (
        <tr key={page.id} className="border-t border-[#E7E8FF]">
          <td className="px-5 py-4 font-sora font-semibold text-[#000000] text-sm md:text-base">
            {page.title}
          </td>

          <td className="px-5 py-4 font-mono text-xs md:text-sm text-[#5B5EF4]">
            {page.slug}
          </td>

          <td className="px-5 py-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold font-roboto ${
                statusLabel === "Active"
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {statusLabel}
            </span>
          </td>

          <td className="px-5 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(page)}
                className="p-2 rounded-lg border border-[#E7E8FF] text-[#5B5EF4] hover:bg-[#E7E8FF]"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => setDeleteTarget(page)}
                className="p-2 rounded-lg border border-[#E7E8FF] text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </td>
        </tr>
      );
    })
  )}
</tbody>
        </table>
      </div>

      {/* Create / Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-sora font-bold text-[#000000]">
                {editingId ? "Edit Page" : "Create Page"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[#B5BCC8] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold font-sora text-gray-900 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Terms & Conditions"
                className="w-full border border-[#E7E8FF] placeholder:text-gray-600 text-gray-900 rounded-[10px] px-4 py-3 text-sm font-roboto outline-none focus:border-primaryColor transition-colors"
              />
              {formTitle.trim() && (
                <p className="text-xs text-[#B5BCC8] font-roboto mt-1.5">{slugify(formTitle)}</p>
              )}
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                Content
              </label>
              <div className="border border-[#E7E8FF] rounded-[10px] overflow-hidden">
                <div className="flex items-center gap-1 px-2 py-1.5 border-b border-[#E7E8FF] bg-[#F7F7FF]">
                  <ToolbarButton onClick={() => exec("bold")} title="Bold">
                    <Bold size={16} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => exec("italic")} title="Italic">
                    <Italic size={16} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => exec("underline")} title="Underline">
                    <Underline size={16} />
                  </ToolbarButton>
                  <div className="w-px h-5 bg-[#E7E8FF] mx-1" />
                  <ToolbarButton onClick={() => exec("insertOrderedList")} title="Numbered list">
                    <ListOrdered size={16} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => exec("insertUnorderedList")} title="Bulleted list">
                    <List size={16} />
                  </ToolbarButton>
                  <div className="w-px h-5 bg-[#E7E8FF] mx-1" />
                  <ToolbarButton onClick={insertLink} title="Insert link">
                    <Link2 size={16} />
                  </ToolbarButton>
                  <ToolbarButton onClick={insertImage} title="Insert image">
                    <ImageIcon size={16} />
                  </ToolbarButton>
                  <div className="w-px h-5 bg-[#E7E8FF] mx-1" />
                  <ToolbarButton onClick={() => exec("removeFormat")} title="Clear formatting">
                    <Eraser size={16} />
                  </ToolbarButton>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={syncContent}
                  data-placeholder="Write your content here..."
                  className="min-h-[180px] px-4 py-3 text-sm font-roboto data-placeholder:text-gray-600 outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-[#B5BCC8]"
                />
              </div>
            </div>

            {/* Status */}
      <div className="mb-6 relative">
  <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
    Status
  </label>

  {/* Trigger */}
  <button
    type="button"
    onClick={() => setOpenStatus(!openStatus)}
    className="w-full border border-[#E7E8FF] text-gray-700 rounded-[10px] px-4 py-3 text-sm font-roboto flex justify-between items-center cursor-pointer"
  >
    {formStatus}

    <svg
      className={`w-4 h-4 transition-transform ${openStatus ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  </button>

  {/* Dropdown */}
  {openStatus && (
    <div className="absolute z-50 mt-2 w-full bg-white border border-[#E7E8FF] rounded-[10px] shadow-lg overflow-hidden">
      {["Active", "Inactive"].map((item) => (
        <div
          key={item}
          onClick={() => {
            setFormStatus(item as PageStatus);
            setOpenStatus(false);
          }}
          className="px-4 py-2 text-sm text-gray-800 hover:bg-[#F7F7FF] cursor-pointer"
        >
          {item}
        </div>
      ))}
    </div>
  )}
</div>

            <button
              onClick={handleSave}
              className="w-full bg-primaryColor text-white font-sora font-semibold py-3 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save Page
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
            <h3 className="text-lg font-sora font-bold text-[#000000] mb-2">Delete page?</h3>
            <p className="text-sm text-[#B5BCC8] font-roboto mb-6">
              &quot;{deleteTarget.title}&quot; will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-[#E7E8FF] text-[#000000] font-sora font-semibold py-2.5 rounded-[12px] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white font-sora font-semibold py-2.5 rounded-[12px] hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-md text-[#5B5EF4] hover:bg-[#E7E8FF] transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}