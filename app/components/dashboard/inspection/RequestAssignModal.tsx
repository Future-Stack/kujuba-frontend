import { ChevronDown, X } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
    assignAfterAcceptCard: any;
    setAssignAfterAcceptCard: React.Dispatch<React.SetStateAction<any>>;
    acceptInspectorId: number | null;
    setAcceptInspectorId: React.Dispatch<React.SetStateAction<number | null>>;
    acceptDropdownOpen: boolean;
    setAcceptDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    availableInspectors: any[];
    handleAcceptCancelRequest: () => void;
    accepting: boolean;
};

export default function AssignInspectorModal({
    assignAfterAcceptCard,
    setAssignAfterAcceptCard,
    acceptInspectorId,
    setAcceptInspectorId,
    acceptDropdownOpen,
    setAcceptDropdownOpen,
    availableInspectors,
    handleAcceptCancelRequest,
    accepting,
}: Props) {
    if (!assignAfterAcceptCard) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                    {/* Close */}
                    <button
                        onClick={() => {
                            setAssignAfterAcceptCard(null);
                            setAcceptInspectorId(null);
                            setAcceptDropdownOpen(false);
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <h3 className="font-bold text-gray-900 text-base leading-6 mb-2">
                        {assignAfterAcceptCard.inspection_types?.join(", ") || "Inspection"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-normal font-rooto mb-5">
                        <span>Assigned Inspector:</span>
                        <span className="text-[#B5BCC8]">Not assigned yet</span>
                    </div>
                    
                    <div className="">

                  
                    {/* Assign Inspector dropdown */}
                    <div className="flex items-center gap-3 mb-6">
                        <p className="text-gray-900 text-sm font-semibold whitespace-nowrap">
                            Assign Inspector
                        </p>
                        <div className="relative w-full">
                            <button
                                type="button"
                                onClick={() => setAcceptDropdownOpen((v) => !v)}
                                className="w-full flex items-center justify-between border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-400 bg-white cursor-pointer hover:border-gray-300 transition-colors"
                            >
                                <span className={acceptInspectorId ? "text-gray-800 font-medium" : ""}>
                                    {acceptInspectorId
                                        ? availableInspectors.find((i) => i.id === acceptInspectorId)?.name || "Select Inspector"
                                        : "Select Inspector"}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                            {acceptDropdownOpen && (
                                <div className="absolute left-0 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg z-30 max-h-40 overflow-y-auto">
                                    {availableInspectors.length === 0 && (
                                        <p className="px-3 py-2 text-sm text-gray-400">No inspectors available</p>
                                    )}
                                    {availableInspectors.map((insp) => (
                                        <button
                                            key={insp.id}
                                            type="button"
                                            onClick={() => {
                                                setAcceptInspectorId(insp.id);
                                                setAcceptDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            {insp.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment info */}
                    <div className="grid grid-cols-3 gap-3 text-center mb-6">
                        <div className="flex flex-col items-center">
                            <span className={`text-xs mb-1 block w-full truncate ${!assignAfterAcceptCard.user_payment ? "text-[#B5BCC8]" : "text-gray-600 font-medium"}`}>
                                User Payment
                            </span>
                            <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
                                {assignAfterAcceptCard.user_payment ?? ""}
                            </span>
                            <div className={`w-full h-[2px] mt-2 ${assignAfterAcceptCard.user_payment ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`text-xs mb-1 block w-full truncate ${!assignAfterAcceptCard.inspection_report ? "text-[#B5BCC8]" : "text-gray-600 font-medium"}`}>
                                Inspection Report
                            </span>
                            <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
                                {assignAfterAcceptCard.inspection_report ?? ""}
                            </span>
                            <div className={`w-full h-[2px] mt-2 ${assignAfterAcceptCard.inspection_report ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`text-xs mb-1 block w-full truncate ${!assignAfterAcceptCard.ins_payment ? "text-[#B5BCC8]" : "text-gray-600 font-medium"}`}>
                                Ins. Payment
                            </span>
                            <span className="text-[11px] font-extrabold text-gray-800 min-h-[16px] block">
                                {assignAfterAcceptCard.ins_payment ?? ""}
                            </span>
                            <div className={`w-full h-[2px] mt-2 ${assignAfterAcceptCard.ins_payment ? "bg-[#A3E635]" : "bg-[#B5BCC8]"}`} />
                        </div>
                    </div>
                    </div>
                    {/* Decline / Accept */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setAssignAfterAcceptCard(null);
                                setAcceptInspectorId(null);
                                setAcceptDropdownOpen(false);
                            }}
                            className="flex-1 py-2.5 rounded-sm bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors cursor-pointer"
                        >
                            Decline
                        </button>
                        <button
                            onClick={handleAcceptCancelRequest}
                            disabled={accepting || !acceptInspectorId}
                            className="flex-1 py-2.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
                        >
                            {accepting ? "Accepting..." : "Accept"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}