import PaymentsCard from "@/app/components/dashboard/payments/PaymentsCard";
import PaymentsTable from "@/app/components/dashboard/payments/PaymentsTable";

export default function Users() {
  return (
    <div className="">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Payments & Revenue </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Transaction history, payouts, and refund management</p>
      <div>
        <PaymentsCard/>
      </div>
      <div>
        <PaymentsTable/>
      </div>
    </div>
  );
}