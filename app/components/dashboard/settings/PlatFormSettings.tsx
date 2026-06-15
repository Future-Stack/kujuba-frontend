"use client";

import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/app/redux/features/settingsApi";

import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import ChangePasswordModal from "./ChangepaswordModal";



export default function PlatformSettings() {
  // ================= API =================
  const { data, isLoading, isFetching } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

const [openPasswordModal, setOpenPasswordModal] = useState(false);


const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [showPassword, setShowPassword] = useState({
  current: false,
  new: false,
  confirm: false,
});

  // ================= UI STATE =================
  const [autoApprove, setAutoApprove] = useState(false);


  const [form, setForm] = useState({
    platformName: "",
    supportEmail: "",
    maxInspectors: "",
    inspectorResponseTime: "",
    urgentBookingLeadTime: "",
    reportDeadline: "",
    commissionRate: "",
    urgentInspectionFee: "",
    lateCancellationPenalty: "",
    lastMinuteCancelPenalty: "",
  });



  const [, startTransition] = useTransition();


  const settings = data?.data;
useEffect(() => {
  if (!settings) return;

  startTransition(() => {
    setForm({
      platformName: settings.platform_name ?? "",
      supportEmail: settings.support_mail ?? "",
      maxInspectors: String(settings.max_inspector_area ?? ""),
      inspectorResponseTime: String(settings.inspector_response_time ?? ""),
      urgentBookingLeadTime: String(settings.urgent_booking_lead ?? ""),
      reportDeadline: String(settings.report_deadline ?? ""),
      commissionRate: String(settings.platform_commission ?? ""),
      urgentInspectionFee: String(settings.urgent_inspection_fee ?? ""),
      lateCancellationPenalty: String(settings.late_cancellation_penalty ?? ""),
      lastMinuteCancelPenalty: String(settings.last_minute_cancel_penalty ?? ""),
    });
  });
}, [settings, startTransition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSaveSettings = async () => {
    setSaveStatus("idle");
    try {
      await updateSettings({
        platform_name: form.platformName,
        support_mail: form.supportEmail,
        max_inspector_area: Number(form.maxInspectors),
        inspector_response_time: Number(form.inspectorResponseTime),
        urgent_booking_lead: Number(form.urgentBookingLeadTime),
        report_deadline: Number(form.reportDeadline),
        platform_commission: Number(form.commissionRate),
        auto_approve: autoApprove,
        urgent_inspection_fee: Number(form.urgentInspectionFee),
        late_cancellation_penalty: Number(form.lateCancellationPenalty),
        last_minute_cancel_penalty: Number(form.lastMinuteCancelPenalty),
      }).unwrap();

      toast.success("Updated Success");
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };



  const isBusy = isLoading || isFetching;

  return (
    <>
      <div className="w-full border border-[#F3F4F6] rounded-[12px] py-[25px] px-[23px]">
        <h2 className="text-sm font-semibold text-[#111827] font-sora leading-5 mb-5">
          Platform Configuration
        </h2>

        {isBusy ? (
         <div className="space-y-5 animate-pulse">
    {/* Title skeleton */}
    <div className="h-4 w-40 bg-gray-200 rounded"></div>

    {/* Row 1 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="h-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>

    {/* Row 2 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="h-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>

    {/* Row 3 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="h-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>

    {/* Toggle skeleton */}
    <div className="h-16 bg-gray-200 rounded-lg"></div>

    {/* Button skeleton */}
    <div className="flex justify-end">
      <div className="h-10 w-44 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
        ) : (
          <div className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Platform Name">
                <Input
                  name="platformName"
                  value={form.platformName}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Support Email">
                <Input
                  name="supportEmail"
                  value={form.supportEmail}
                  onChange={handleChange}
                  type="email"
                />
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Max Inspectors Per Area">
                <Input
                  name="maxInspectors"
                  value={form.maxInspectors}
                  onChange={handleChange}
                  type="number"
                />
              </Field>
              <Field label="Inspector Response Time (min)">
                <Input
                  name="inspectorResponseTime"
                  value={form.inspectorResponseTime}
                  onChange={handleChange}
                  type="number"
                />
              </Field>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Urgent Booking Lead Time (hr)">
                <Input
                  name="urgentBookingLeadTime"
                  value={form.urgentBookingLeadTime}
                  onChange={handleChange}
                  type="number"
                />
              </Field>
              <Field label="Report Deadline (hours)">
                <Input
                  name="reportDeadline"
                  value={form.reportDeadline}
                  onChange={handleChange}
                  type="number"
                />
              </Field>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Platform Commission Rate (%)">
                <Input
                  name="commissionRate"
                  value={form.commissionRate}
                  onChange={handleChange}
                  type="number"
                />
              </Field>
            </div>

            {/* Row 5: Fees & Penalties */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Urgent Inspection Fee ($)">
                <Input
                  name="urgentInspectionFee"
                  value={form.urgentInspectionFee}
                  onChange={handleChange}
                  type="number"
                />
              </Field>
              <Field label="Late Cancellation Penalty - 24h ($)">
                <Input
                  name="lateCancellationPenalty"
                  value={form.lateCancellationPenalty}
                  onChange={handleChange}
                  type="number"
                />
              </Field>
              <Field label="Last-Minute Cancel Penalty - 2h ($)">
                <Input
                  name="lastMinuteCancelPenalty"
                  value={form.lastMinuteCancelPenalty}
                  onChange={handleChange}
                  type="number"
                />
              </Field>
            </div>

            {/* Auto approve */}
            <div className="flex items-center justify-between bg-[#F0F1FF] rounded-[10px] px-5 py-4 mt-7">
              <div>
                <p className="text-sm font-medium text-[#1F2937] font-roboto leading-5">
                  Auto-approve new inspector applications
                </p>
                <p className="text-xs text-[#9CA3AF] font-normal leading-4 mt-0.5">
                  Skip manual review for inspectors who meet all criteria
                </p>
              </div>

              <button
                onClick={() => setAutoApprove(!autoApprove)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                  autoApprove ? "bg-[#5B5EF4]" : "bg-[#D1D5DB]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    autoApprove ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Change password button (NO DESIGN CHANGE, just added action) */}
            <div className="flex items-center justify-between mt-4">
              <div></div>

<button
  onClick={() => setOpenPasswordModal(true)}
  className="text-sm font-semibold cursor-pointer text-primaryColor"
>
  Change Password
</button>
            </div>

            {/* Save */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {saveStatus === "success" && (
                <span className="text-sm text-[#22C55E] font-medium">
                  Settings saved successfully
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-sm text-[#EF4444] font-medium">
                  Failed to save settings
                </span>
              )}

              <button
                onClick={handleSaveSettings}
                disabled={isUpdating}
                className="bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold font-roboto px-6 py-2.5 rounded-lg transition-all cursor-pointer duration-200"
              >
                {isUpdating ? "Saving..." : "Save Platform Settings"}
              </button>
            </div>
          </div>
        )}
      </div>
<ChangePasswordModal
  open={openPasswordModal}
  onClose={() => setOpenPasswordModal(false)}
  form={passwordForm}
  setForm={setPasswordForm}
  showPassword={showPassword}
  setShowPassword={setShowPassword}
 
/>
  
    </>
  );
}

/* ─── Field ─── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-[#6B7280] font-roboto font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Input ─── */
function Input({
  name,
  value,
  onChange,
  type = "text",
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#1F2937] font-medium bg-white
      focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4]
      w-full"
    />
  );
}






// "use client";

// import { Eye, EyeOff } from "lucide-react";
// import { useState } from "react";

// export default function PlatformSettings() {
//   const [autoApprove, setAutoApprove] = useState(false);
//   const [openPasswordModal, setOpenPasswordModal] = useState(false);

//   const [form, setForm] = useState({
//     platformName: "CONNECT TO INSPECT",
//     supportEmail: "support@inspecthub.com",
//     maxInspectors: "25",
//     inspectorResponseTime: "30",
//     urgentBookingLeadTime: "4",
//     reportDeadline: "48",
//     commissionRate: "20",
//   });

//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const [showPassword, setShowPassword] = useState({
//   current: false,
//   new: false,
//   confirm: false,
// });
//   return (
//     <>
//       <div className="w-full border border-[#F3F4F6] rounded-[12px] py-[25px] px-[23px]">
//         <h2 className="text-sm font-semibold text-[#111827] font-sora leading-5 mb-5">
//           Platform Configuration
//         </h2>

//         <div className="space-y-5">
//           {/* Row 1 */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Field label="Platform Name">
//               <Input
//                 name="platformName"
//                 value={form.platformName}
//                 onChange={handleChange}
//               />
//             </Field>
//             <Field label="Support Email">
//               <Input
//                 name="supportEmail"
//                 value={form.supportEmail}
//                 onChange={handleChange}
//                 type="email"
//               />
//             </Field>
//           </div>

//           {/* Row 2 */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Field label="Max Inspectors Per Area">
//               <Input
//                 name="maxInspectors"
//                 value={form.maxInspectors}
//                 onChange={handleChange}
//                 type="number"
//               />
//             </Field>
//             <Field label="Inspector Response Time (min)">
//               <Input
//                 name="inspectorResponseTime"
//                 value={form.inspectorResponseTime}
//                 onChange={handleChange}
//                 type="number"
//               />
//             </Field>
//           </div>

//           {/* Row 3 */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Field label="Urgent Booking Lead Time (hr)">
//               <Input
//                 name="urgentBookingLeadTime"
//                 value={form.urgentBookingLeadTime}
//                 onChange={handleChange}
//                 type="number"
//               />
//             </Field>
//             <Field label="Report Deadline (hours)">
//               <Input
//                 name="reportDeadline"
//                 value={form.reportDeadline}
//                 onChange={handleChange}
//                 type="number"
//               />
//             </Field>
//           </div>

//           {/* Row 4 */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Field label="Platform Commission Rate (%)">
//               <Input
//                 name="commissionRate"
//                 value={form.commissionRate}
//                 onChange={handleChange}
//                 type="number"
//               />
//             </Field>
//           </div>

//           {/* Auto approve */}
//           <div className="flex items-center justify-between bg-[#F0F1FF] rounded-[10px] px-5 py-4 mt-7">
//             <div>
//               <p className="text-sm font-medium text-[#1F2937] font-roboto leading-5">
//                 Auto-approve new inspector applications
//               </p>
//               <p className="text-xs text-[#9CA3AF] font-normal leading-4 mt-0.5">
//                 Skip manual review for inspectors who meet all criteria
//               </p>
//             </div>

//             <button
//               onClick={() => setAutoApprove(!autoApprove)}
//               className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
//                 autoApprove ? "bg-[#5B5EF4]" : "bg-[#D1D5DB]"
//               }`}
//             >
//               <span
//                 className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
//                   autoApprove ? "translate-x-5" : "translate-x-0"
//                 }`}
//               />
//             </button>
//           </div>

//           {/* Change password button (NO DESIGN CHANGE, just added action) */}
//           <div className="flex items-center justify-between mt-4">
//             <div></div>

//             <button
//               onClick={() => setOpenPasswordModal(true)}
//               className="text-sm font-semibold text-primaryColor cursor-pointer"
//             >
//               Change Password
//             </button>
//           </div>

//           {/* Save */}
//           <div className="flex justify-end pt-2">
//             <button className="bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] text-white text-sm font-semibold font-roboto px-6 py-2.5 rounded-lg transition-all cursor-pointer duration-200">
//               Save Platform Settings
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= MODAL ================= */}
//       {openPasswordModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="w-full max-w-md bg-white rounded-xl p-6">
//             <h2 className="text-lg text-gray-900 leading-6 font-semibold mb-5">Change Password</h2>

//             <div className="space-y-4">
//              <Field label="Current Password">
//   <div className="relative">
//     <Input
//       name="currentPassword"
//       type={showPassword.current ? "text" : "password"}
//       value={passwordForm.currentPassword}
//       onChange={(e) =>
//         setPasswordForm({
//           ...passwordForm,
//           currentPassword: e.target.value,
//         })
//       }
//     />

//     <button
//       type="button"
//       onClick={() =>
//         setShowPassword({
//           ...showPassword,
//           current: !showPassword.current,
//         })
//       }
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//     >
//       {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
//     </button>
//   </div>
// </Field>

//               <Field label="New Password">
//   <div className="relative">
//     <Input
//       name="newPassword"
//       type={showPassword.new ? "text" : "password"}
//       value={passwordForm.newPassword}
//       onChange={(e) =>
//         setPasswordForm({
//           ...passwordForm,
//           newPassword: e.target.value,
//         })
//       }
//     />

//     <button
//       type="button"
//       onClick={() =>
//         setShowPassword({
//           ...showPassword,
//           new: !showPassword.new,
//         })
//       }
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//     >
//       {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
//     </button>
//   </div>
// </Field>

//    <Field label="New Password">
//   <div className="relative">
//     <Input
//       name="newPassword"
//       type={showPassword.new ? "text" : "password"}
//       value={passwordForm.newPassword}
//       onChange={(e) =>
//         setPasswordForm({
//           ...passwordForm,
//           newPassword: e.target.value,
//         })
//       }
//     />

//     <button
//       type="button"
//       onClick={() =>
//         setShowPassword({
//           ...showPassword,
//           new: !showPassword.new,
//         })
//       }
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//     >
//       {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
//     </button>
//   </div>
// </Field>
//             </div>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setOpenPasswordModal(false)}
//                 className="px-4 py-2 text-sm text-gray-600 cursor-pointer border rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => {
//                   console.log(passwordForm);
//                   setOpenPasswordModal(false);
//                 }}
//                 className="px-4 py-2 text-sm bg-primaryColor cursor-pointer text-white rounded-lg"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// /* ─── Field ─── */
// function Field({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-sm text-[#6B7280] font-roboto font-semibold">
//         {label}
//       </label>
//       {children}
//     </div>
//   );
// }

// /* ─── Input ─── */
// function Input({
//   name,
//   value,
//   onChange,
//   type = "text",
// }: {
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
// }) {
//   return (
//     <input
//       name={name}
//       value={value}
//       onChange={onChange}
//       type={type}
//       className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#1F2937] font-medium bg-white
//       focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4]
//       w-full"
//     />
//   );
// }




// "use client";

// import { useState } from "react";

// export default function PlatformSettings() {
//   const [autoApprove, setAutoApprove] = useState(false);

//   const [form, setForm] = useState({
//     platformName: "CONNECT TO INSPECT",
//     supportEmail: "support@inspecthub.com",
//     maxInspectors: "25",
//     inspectorResponseTime: "30",
//     urgentBookingLeadTime: "4",
//     reportDeadline: "48",
//     commissionRate: "20",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="w-full border border-[#F3F4F6] rounded-[12px] py-[25px] px-[23px]">
//       <h2 className="text-sm font-semibold text-[#111827] font-sora leading-5 mb-5">
//         Platform Configuration
//       </h2>

//       <div className="space-y-5">
//         {/* Row 1 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <Field label="Platform Name">
//             <Input name="platformName" value={form.platformName} onChange={handleChange} />
//           </Field>
//           <Field label="Support Email">
//             <Input name="supportEmail" value={form.supportEmail} onChange={handleChange} type="email" />
//           </Field>
//         </div>

//         {/* Row 2 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <Field label="Max Inspectors Per Area">
//             <Input name="maxInspectors" value={form.maxInspectors} onChange={handleChange} type="number" />
//           </Field>
//           <Field label="Inspector Response Time (min)">
//             <Input name="inspectorResponseTime" value={form.inspectorResponseTime} onChange={handleChange} type="number" />
//           </Field>
//         </div>

//         {/* Row 3 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <Field label="Urgent Booking Lead Time (hr)">
//             <Input name="urgentBookingLeadTime" value={form.urgentBookingLeadTime} onChange={handleChange} type="number" />
//           </Field>
//           <Field label="Report Deadline (hours)">
//             <Input name="reportDeadline" value={form.reportDeadline} onChange={handleChange} type="number" />
//           </Field>
//         </div>

//         {/* Row 4 — half width */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <Field label="Platform Commission Rate (%)">
//             <Input name="commissionRate" value={form.commissionRate} onChange={handleChange} type="number" />
//           </Field>
//         </div>

                
//         {/* Security Section */}
// {/* <div className="mt-6 border border-[#F3F4F6] rounded-[12px] py-[25px] px-[23px]">
//   <h2 className="text-sm font-semibold text-[#111827] font-sora mb-5">
//     Security
//   </h2>

//   <div className="space-y-5">
//     <Field label="Current Password">
//       <Input name="currentPassword" type="password" value={""} onChange={() => {}} />
//     </Field>

//     <Field label="New Password">
//       <Input name="newPassword" type="password" value={""} onChange={() => {}} />
//     </Field>

//     <Field label="Confirm New Password">
//       <Input name="confirmPassword" type="password" value={""} onChange={() => {}} />
//     </Field>

//     <div className="flex justify-end pt-2">
//       <button className="bg-primaryColor hover:bg-[#4a4dd4] text-white text-sm font-semibold px-6 py-2.5 rounded-lg">
//         Update Password
//       </button>
//     </div>
//   </div>
// </div> */}



//         {/* Auto-approve toggle */}
//         <div className="flex items-center justify-between bg-[#F0F1FF] rounded-[10px] px-5 py-4 mt-7">
//           <div>
//             <p className="text-sm font-medium text-[#1F2937] font-roboto leading-5">
//               Auto-approve new inspector applications
//             </p>
//             <p className="text-xs text-[#9CA3AF] font-normal leading-4 font-normal mt-0.5">
//               Skip manual review for inspectors who meet all criteria
//             </p>
//           </div>
//           <button
//             onClick={() => setAutoApprove(!autoApprove)}
//             className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer flex-shrink-0 ${
//               autoApprove ? "bg-[#5B5EF4]" : "bg-[#D1D5DB]"
//             }`}
//           >
//             <span
//               className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
//                 autoApprove ? "translate-x-5" : "translate-x-0"
//               }`}
//             />
//           </button>
//         </div>



//         {/* Save Button */}
//         <div className="flex justify-end pt-2">
//           <button className="bg-primaryColor hover:bg-[#4a4dd4] active:scale-[0.98] text-white text-sm font-semibold font-roboto px-6 py-2.5 rounded-lg transition-all cursor-pointer duration-200">
//             Save Platform Settings
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Field wrapper ─── */
// function Field({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-sm text-[#6B7280] font-roboto leading-4 font-semibold mb-0.5">{label}</label>
//       {children}
//     </div>
//   );
// }

// /* ─── Input ─── */
// function Input({
//   name,
//   value,
//   onChange,
//   type = "text",
// }: {
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
// }) {
//   return (
//     <input
//       name={name}
//       value={value}
//       onChange={onChange}
//       type={type}
//       className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#1F2937] font-medium font-roboto leading-5 bg-white
//         focus:outline-none focus:ring-2 focus:ring-[#5B5EF4]/20 focus:border-[#5B5EF4]
//         hover:border-[#C4C6F1] transition-all duration-150 w-full"
//     />
//   );
// }