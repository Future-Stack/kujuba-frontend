
"use client";

import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/Header";
import ProtectedLayout from "../ProtectedRoute";

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-[#FFFFFF] flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
          />
        )}

        {/* Mobile Sidebar Sliding Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Main Content Viewport View */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <DashboardHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {children}
          </main>
        </div>

      </div>
    </ProtectedLayout>
  );
};

export default DashboardLayout;



// "use client";


// import { useState } from "react";
// import DashboardHeader from "../components/dashboard/Header";
// import Sidebar from "../components/dashboard/Sidebar";


// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col bg-[#001F3F] p-4">
//         <div className="bg-[#F8F1E9] p-3 md:p-5 rounded-3xl">
//         <DashboardHeader onMenuClick={() => setSidebarOpen(true)}/>
//         <main className="">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }