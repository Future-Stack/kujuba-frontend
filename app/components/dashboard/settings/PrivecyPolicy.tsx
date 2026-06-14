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

type PageStatus = "Active" | "Inactive";

type DynamicPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: PageStatus;
};

const slugify = (title: string) =>
  "/page/" +
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const initialPages: DynamicPage[] = [
  {
    id: "1",
    title: "Terms & condition",
    slug: "/page/terms-condition",
    content: "<p>Write your terms &amp; conditions here...</p>",
    status: "Active",
  },
];

export default function DynamicPages() {
  const [pages, setPages] = useState<DynamicPage[]>(initialPages);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DynamicPage | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formStatus, setFormStatus] = useState<PageStatus>("Active");
  const [formContent, setFormContent] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);

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

  const openEditModal = (page: DynamicPage) => {
    setEditingId(page.id);
    setFormTitle(page.title);
    setFormStatus(page.status);
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

  const handleSave = () => {
    const title = formTitle.trim();
    if (!title) return;

    if (editingId) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, title, slug: slugify(title), content: formContent, status: formStatus }
            : p
        )
      );
    } else {
      setPages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title,
          slug: slugify(title),
          content: formContent,
          status: formStatus,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setPages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
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
            {pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-14 text-center">
                  <FileText className="mx-auto mb-3 text-[#B5BCC8]" size={32} />
                  <p className="text-[#B5BCC8] font-roboto">No pages yet. Create your first one.</p>
                </td>
              </tr>
            ) : (
              pages.map((page) => (
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
                        page.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(page)}
                        title="Edit page"
                        className="p-2 rounded-lg border border-[#E7E8FF] text-[#5B5EF4] hover:bg-[#E7E8FF] transition-colors cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(page)}
                        title="Delete page"
                        className="p-2 rounded-lg border border-[#E7E8FF] text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
            <div className="mb-6">
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as PageStatus)}
                className="w-full border border-[#E7E8FF] text-gray-600 rounded-[10px] px-4 py-3 text-sm font-roboto outline-none focus:border-primaryColor transition-colors cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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