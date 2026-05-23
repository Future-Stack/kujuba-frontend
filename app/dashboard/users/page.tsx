import UserCard from "@/app/components/dashboard/Users/UserCard";
import UserGridDashboard from "@/app/components/dashboard/Users/UsersGrid";


export default function Users() {
  return (
    <div className="">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">User Management </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Manage User status, inspections, and Payments</p>
      <div>
        <UserCard/>
      </div>
      <div>
        <UserGridDashboard/>
      </div>
    </div>
  );
}