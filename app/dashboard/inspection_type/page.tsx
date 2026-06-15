/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, ImagePlus, ImageOff } from "lucide-react";
import { useAddInspectionTypeMutation, useDeleteInspectionTypeMutation, useGetInspectionTypesQuery, useUpdateInspectionTypeMutation } from "@/app/redux/features/inspectiontypeApi";
import { toast } from "react-toastify";

type InspectionTypeItem = {
  id: number;
  title: string;
  short_desc: string;
  price: number;
  img: string | null; // preview URL (or existing image URL from backend)
  imgFile?: File | null; // newly selected file, for upload
  status: number; // 1 = active, 0 = inactive
};

const initialItems: InspectionTypeItem[] = [

];

export default function InspectionType() {
  const [items, setItems] = useState<InspectionTypeItem[]>(initialItems);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InspectionTypeItem | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formImg, setFormImg] = useState<string | null>(null);
  const [formImgFile, setFormImgFile] = useState<File | null>(null);
  const [formStatus, setFormStatus] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useGetInspectionTypesQuery();
const [deleteInspection] = useDeleteInspectionTypeMutation();
const [addInspection] = useAddInspectionTypeMutation();
const [updateInspection] = useUpdateInspectionTypeMutation();

  const openCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormShortDesc("");
    setFormPrice("");
    setFormImg(null);
    setFormImgFile(null);
    setFormStatus(1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InspectionTypeItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormShortDesc(item.short_desc);
    setFormPrice(String(item.price));
    setFormImg(item.img);
    setFormImgFile(null);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormImgFile(file);
    setFormImg(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFormImg(null);
    setFormImgFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

const handleSave = async () => {
  const title = formTitle.trim();
  const price = parseFloat(formPrice);

  if (!title || isNaN(price)) return;

  const fd = new FormData();

  fd.append("title", title);
  fd.append("short_desc", formShortDesc.trim());
  fd.append("price", String(price));
  fd.append("status", String(formStatus));

  if (formImgFile) {
    fd.append("img", formImgFile);
  }

  try {
    if (editingId) {
      // EDIT
      await updateInspection({
        id: editingId,
        formData: fd,
      }).unwrap();

      toast.success("Inspection updated successfully");
    } else {
      // CREATE
      await addInspection(fd).unwrap();

      toast.success("Inspection added successfully");
    }

    setIsModalOpen(false);

    setFormTitle("");
    setFormShortDesc("");
    setFormPrice("");
    setFormImg(null);
    setFormImgFile(null);
    setFormStatus(1);
    setEditingId(null);

  } catch (error: any) {
    toast.error(
      error?.data?.message ||
      "Something went wrong"
    );
  }
};

const confirmDelete = async () => {
  if (!deleteTarget) return;

  try {
    await deleteInspection(deleteTarget.id).unwrap();

    toast.success("Deleted successfully");
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
          <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-1">
            Inspection Type
          </h1>
          <p className="text-[#B5BCC8] text-base md:text-lg font-normal font-roboto">
            Manage inspection types, pricing, and visibility
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primaryColor text-white font-sora font-semibold text-sm px-5 py-3 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={18} />
          Add Inspection Type
        </button>
      </div>

      {/* Table */}
      <div className="border border-[#E7E8FF] rounded-[14px] overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="bg-[#F7F7FF] text-[#B5BCC8] font-roboto text-xs uppercase tracking-wider">
              <th className="px-5 py-4 font-medium">Image</th>
              <th className="px-5 py-4 font-medium">Title</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
        <tbody>
  {data?.data?.length === 0 ? (
    <tr>
      <td colSpan={5} className="px-5 py-14 text-center">
        <ImageOff className="mx-auto mb-3 text-[#B5BCC8]" size={32} />
        <p className="text-[#B5BCC8] font-roboto">
          No inspection types yet. Add your first one.
        </p>
      </td>
    </tr>
  ) : (
    data?.data?.map((item: any) => (
      <tr key={item.id} className="border-t border-[#E7E8FF]">

        {/* IMAGE */}
        <td className="px-5 py-4">
          {item.img ? (
            <img
              src={item.img}
              alt={item.title}
              className="w-12 h-12 rounded-[10px] object-cover border border-[#E7E8FF]"
            />
          ) : (
            <div className="w-12 h-12 rounded-[10px] bg-[#F7F7FF] border border-[#E7E8FF] flex items-center justify-center text-[#B5BCC8]">
              <ImageOff size={18} />
            </div>
          )}
        </td>

        {/* TITLE */}
        <td className="px-5 py-4">
          <p className="font-sora font-semibold text-[#000000] text-sm md:text-base">
            {item.title}
          </p>
          <p className="text-xs md:text-sm text-[#5C6470] font-roboto mt-1 max-w-sm truncate">
            {item.short_desc}
          </p>
        </td>

        {/* PRICE */}
        <td className="px-5 py-4">
          <span className="text-sm bg-[#F5F6FA] rounded-sm font-semibold text-[#111827] px-3 py-2">
            ${item.price}
          </span>
        </td>

        {/* STATUS */}
        <td className="px-5 py-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold font-roboto ${
              item.status === 1
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {item.status === 1 ? "Active" : "Inactive"}
          </span>
        </td>

        {/* ACTIONS */}
        <td className="px-5 py-4 text-right">
          <div className="flex items-center justify-end gap-2">

            {/* EDIT (same design, just function ready) */}
            <button
              onClick={() => openEditModal(item)}
              title="Edit"
              className="p-2 rounded-lg border border-[#E7E8FF] text-[#5B5EF4] hover:bg-[#E7E8FF] transition-colors cursor-pointer"
            >
              <Pencil size={16} />
            </button>

            {/* DELETE */}
            <button
              onClick={() => setDeleteTarget(item)}
              title="Delete"
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

      {/* Add / Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-sora font-bold text-[#000000]">
                {editingId ? "Edit Inspection Type" : "Add Inspection Type"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[#B5BCC8] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image upload */}
            <div className="mb-4">
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {formImg ? (
                <div className="relative w-full h-40 rounded-[10px] overflow-hidden border border-[#E7E8FF]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formImg} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-full shadow cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-[#E7E8FF] rounded-[10px] flex flex-col items-center justify-center gap-2 text-[#B5BCC8] hover:border-primaryColor hover:text-primaryColor transition-colors cursor-pointer"
                >
                  <ImagePlus size={24} />
                  <span className="text-sm font-roboto">Click to upload an image</span>
                </button>
              )}
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Four Point Inspection"
                className="w-full border border-[#E7E8FF] text-gray-600 rounded-[10px] px-4 py-3 text-sm font-roboto outline-none focus:border-primaryColor transition-colors"
              />
            </div>

            {/* Short description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">
                Short Description
              </label>
              <textarea
                value={formShortDesc}
                onChange={(e) => setFormShortDesc(e.target.value)}
                placeholder="Brief description of this inspection type"
                rows={3}
                className="w-full border border-[#E7E8FF] text-gray-600 rounded-[10px] px-4 py-3 text-sm font-roboto outline-none focus:border-primaryColor transition-colors resize-none"
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-sm font-semibold font-sora text-[#000000] mb-2">Price</label>
              <div className="flex items-center border border-[#E7E8FF] rounded-[10px] px-4 focus-within:border-primaryColor transition-colors">
                <span className="text-sm font-semibold text-[#111827]">$</span>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-2 py-3 text-sm font-roboto text-gray-600 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Status */}
            <div className="mb-6 flex items-center justify-between">
              <label className="text-sm font-semibold font-sora text-[#000000]">Status</label>
              <button
                type="button"
                onClick={() => setFormStatus((s) => (s === 1 ? 0 : 1))}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  formStatus === 1 ? "bg-primaryColor" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formStatus === 1 ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-primaryColor text-white font-sora font-semibold py-3 rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
            <h3 className="text-lg font-sora font-bold text-[#000000] mb-2">Delete inspection type?</h3>
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