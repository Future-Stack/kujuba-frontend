
import Card from "../components/dashboard/dasboardRoute/Card";
import FinanceInsights from "../components/dashboard/dasboardRoute/FinaceInsights";
import UserTable from "../components/dashboard/dasboardRoute/Users";
import TopInspector from "../components/dashboard/dasboardRoute/TopInspector";
import RequestApproval from "../components/dashboard/dasboardRoute/RequestApproval";
import InspectionStatistics from "../components/dashboard/dasboardRoute/InspectionStatistics";
import TopCategory from "../components/dashboard/dasboardRoute/TopCategory";
import RecentInspection from "../components/dashboard/dasboardRoute/RecentInspection";
import InspectionGaugeWithCalendar from "../components/dashboard/dasboardRoute/InspectionGaugeWithCalendar";
import RecentActivity from "../components/dashboard/dasboardRoute/RecentActivity";

export default function dashboard() {
  return (
    <div className="">
    <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Good morning, Admin 👋 </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Here&apos;s what&apos;s happening on your platform today.</p>
      <div>
        <Card/>
      </div>
<div className="py-6 md:py-9 grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
  
  <div className="h-full">
    <FinanceInsights />
  </div>

  <div className="h-full">
    <UserTable />
  </div>

</div>
<div className="flex flex-col 2xl:flex-row w-full gap-8 items-stretch">

  <div className="flex flex-col lg:flex-row gap-8 flex-1 items-stretch">
    
    <div className="flex-1 flex">
      <TopInspector />
    </div>

    <div className="flex-1 flex">
      <RequestApproval />
    </div>

  </div>

  <div className="flex-1 flex">
    <InspectionStatistics />
  </div>

</div>

<div className="flex flex-col 2xl:flex-row w-full gap-8 items-stretch my-8">

  <div className="flex-1 flex">
    <TopCategory />
  </div>

  <div className="flex-1 flex">
    <RecentInspection />
  </div>

  <div className="flex-1 flex">
    <InspectionGaugeWithCalendar />
  </div>

  <div className="flex-1 flex">
    <RecentActivity />
  </div>

</div>
    </div>
  );
}