import NotificationCenter from "@/app/components/dashboard/notification/NotificationCenter";


export default function Notifications() {
  return (
    <div className="">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Notification Center </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Send announcements and manage platform alerts</p>
      <div>
     <NotificationCenter/>
      </div>
      <div>
        
      </div>
    </div>
  );
}