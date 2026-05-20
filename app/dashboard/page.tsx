import Image from "next/image";
import Card from "../components/dashboard/dasboardRoute/Card";

export default function dashboard() {
  return (
    <div className="">
    <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Good morning, Admin 👋 </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto">Here&apos;s what&apos;s happening on your platform today.</p>
      <div>
        <Card/>
      </div>
    </div>
  );
}