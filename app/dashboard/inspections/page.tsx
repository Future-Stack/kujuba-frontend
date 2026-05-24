import InspectionCard from "@/app/components/dashboard/inspection/InspectionCard";
import InspectionWorkflowBoard from "@/app/components/dashboard/inspection/InspectionWorkflowBoard";



export default function Users() {
  return (
    <div className="">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Inspection Management </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Track and manage all platform inspections</p>
      <div>
        <InspectionCard/>
      </div>
      <div>
        <InspectionWorkflowBoard/>
      </div>
    </div>
  );
}