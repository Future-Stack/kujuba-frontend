import { Locate, X } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
    cancelViewCard: any;
    setCancelViewCard: React.Dispatch<React.SetStateAction<any>>;
    setAssignAfterAcceptCard: React.Dispatch<React.SetStateAction<any>>;
    setAcceptInspectorId: React.Dispatch<React.SetStateAction<number | null>>;
    setAcceptDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeclineCancelRequest: (id: number) => void;
    declining: boolean;
};
const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
];

function colorFor(idx: number) {
    return avatarColors[idx % avatarColors.length];
}
function initials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function InspectorDisplay({
    name,
    idx,
}: {
    name: string;
    idx: number;
}) {
    const hasInspector = name && name.toLowerCase() !== "not assigned yet";
    if (!hasInspector) {
        return <span className="text-[#B5BCC8] ml-1">Not assigned yet</span>;
    }
    return (
        <div className="flex items-center gap-1.5">
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorFor(idx)}`}
            >
                {initials(name)}
            </div>
            <span className="text-gray-800 font-medium text-sm">{name}</span>
        </div>
    );
}

export default function CancelRequestModal({
    cancelViewCard,
    setCancelViewCard,
    setAssignAfterAcceptCard,
    setAcceptInspectorId,
    setAcceptDropdownOpen,
    handleDeclineCancelRequest,
    declining,
}: Props) {
    if (!cancelViewCard) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                    {/* Close */}
                    <button
                        onClick={() => setCancelViewCard(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <h3 className="font-bold text-gray-900 text-base font-roboto leading-6 mb-2">
                        {cancelViewCard.inspection_types?.join(", ") || "Inspection"}
                    </h3>
                    <div className="flex items-center gap-2 text-base fotn-roboto leading-6 text-gray-600 mb-6">
                        <span>Assigned Inspector:</span>
                        <InspectorDisplay name={cancelViewCard.assigned_inspector} idx={0} />
                    </div>

                    {/* Property info card */}
                    <div className="border border[#EEEEEEEE] rounded-lg p-4 flex gap-3 mb-6 ">
                        {cancelViewCard.property_img ? (
                            <img
                                src={cancelViewCard.property_img}
                                alt="property"
                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
                        )}
                        <div className="text-sm flex flex-col justify-center gap-0.5">
                            <p className="font-semibold text-black text-xs font-sora  leading-5">
                                {cancelViewCard.inspection_types?.[0] || "Inspection"}
                            </p>
                            <p className="flex items-top justify-start  gap-1 text-[#5C6470] text-[10px] font-roboto font-normal leading-4"> <span className="mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M10 5C10 7.4965 7.2305 10.0965 6.3005 10.8995C6.21386 10.9646 6.1084 10.9999 6 10.9999C5.8916 10.9999 5.78614 10.9646 5.6995 10.8995C4.7695 10.0965 2 7.4965 2 5C2 3.93913 2.42143 2.92172 3.17157 2.17157C3.92172 1.42143 4.93913 1 6 1C7.06087 1 8.07828 1.42143 8.82843 2.17157C9.57857 2.92172 10 3.93913 10 5Z" stroke="#5C6470" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5Z" stroke="#5C6470" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" />
                            </svg></span> {cancelViewCard.property_address}</p>
                            <p className="flex items-top justify-start  gap-1 text-[#5C6470] text-[10px] font-roboto font-normal leading-4">
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M4.5 11V6H7.5V11M1.5 4.5L6 1L10.5 4.5V10C10.5 10.2652 10.3946 10.5196 10.2071 10.7071C10.0196 10.8946 9.76522 11 9.5 11H2.5C2.23478 11 1.98043 10.8946 1.79289 10.7071C1.60536 10.5196 1.5 10.2652 1.5 10V4.5Z" stroke="#5C6470" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" />
                                </svg></span>
                                {cancelViewCard.property_type} • {cancelViewCard.property_size}
                            </p>
                        </div>
                    </div>

                    {/* Title */}
                    <p className="font-bold text-gray-900 text-base leading-6 mb-4">Title</p>
                    <div className="border border-[#EAEAEA] rounded-[10px] px-3 py-4 font-normal  text-xs text-[#5C6470] mb-4 ">
                        {cancelViewCard.has_cancel_request?.title || "—"}
                    </div>

                    {/* Problem */}
                    <p className="font-bold text-gray-900 text-base leading-6 mb-4">Explain the Problem</p>
                    <div className="border border-[#EAEAEA] rounded-[10px] px-3 py-4 font-normal  text-xs text-[#5C6470] mb-4 min-h-[80px]">
                        {cancelViewCard.has_cancel_request?.problem || "—"}
                    </div>

                    {/* Decline / Accept */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleDeclineCancelRequest(cancelViewCard.inspection_assign_id)}
                            disabled={declining}
                            className="flex-1 py-2.5 rounded-sm bg-[#EF4444] hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
                        >
                            {declining ? "Declining..." : "Decline"}
                        </button>
                        <button
                            onClick={() => {
                                setAssignAfterAcceptCard(cancelViewCard);
                                setCancelViewCard(null);
                                setAcceptInspectorId(null);
                                setAcceptDropdownOpen(false);
                            }}
                            className="flex-1 py-2.5 rounded-sm bg-primaryColor hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}