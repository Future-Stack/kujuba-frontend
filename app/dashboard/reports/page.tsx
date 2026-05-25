import ReportsCard from "@/app/components/dashboard/reports/ReportsCard";
import ReportsTable from "@/app/components/dashboard/reports/ReportsTable";



export default function Reports() {
  return (
    <div className="">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Reports Management </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">View, download, and archive inspection reports</p>
      <div>
       <ReportsCard/>
      </div>
      <div>
        <ReportsTable/>
      </div>
    </div>
  );
}