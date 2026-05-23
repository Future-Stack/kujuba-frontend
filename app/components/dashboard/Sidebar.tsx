import React from 'react';
import LogoIcon from '../icon/LogoIcon';
import DashboardIcon from '../icon/DashboardIcon';
import { UsersIcon } from '../icon/UsersIcon';
import { InspectorIcon } from '../icon/InspectorIcon';
import { InspectionIcon } from '../icon/InspectionsIcon';
import { PaymentsIcon } from '../icon/PaymentsIcon';
import { ReportsIcon } from '../icon/ReportsIcon';
import { ReviewsIcon } from '../icon/ReviewsIcon';
import { NotificationsIcon } from '../icon/NotificationIcons';
import { SupportIcon } from '../icon/SupportIcon';
import { SettingsIcon } from '../icon/SettingsIcon';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface MenuItem {
  name: string;
  icon: (isActive: boolean) => React.ReactElement;
   path: string;
  isActive?: boolean;
}

const Sidebar: React.FC = () => {
    const pathname = usePathname()

  const menuItems: MenuItem[] = [
    { name: 'Dashboard',     icon: (isActive) => <DashboardIcon isActive={isActive} />,     path: '/dashboard' },
    { name: 'Users',         icon: (isActive) => <UsersIcon isActive={isActive} />,         path: '/dashboard/users' },
    { name: 'Inspectors',    icon: (isActive) => <InspectorIcon isActive={isActive} />,     path: '/dashboard/inspectors' },
    { name: 'Inspections',   icon: (isActive) => <InspectionIcon isActive={isActive} />,    path: '/dashboard/inspections' },
    { name: 'Payments',      icon: (isActive) => <PaymentsIcon isActive={isActive} />,      path: '/dashboard/payments' },
    { name: 'Reports',       icon: (isActive) => <ReportsIcon isActive={isActive} />,       path: '/dashboard/reports' },
    { name: 'Reviews',       icon: (isActive) => <ReviewsIcon isActive={isActive} />,       path: '/dashboard/reviews' },
    { name: 'Notifications', icon: (isActive) => <NotificationsIcon isActive={isActive} />, path: '/dashboard/notifications' },
    { name: 'FAQ & Support', icon: (isActive) => <SupportIcon isActive={isActive} />,       path: '/dashboard/support' },
    { name: 'Settings',      icon: (isActive) => <SettingsIcon isActive={isActive} />,      path: '/dashboard/settings' },
  ];


  return (
    <aside className="w-64 bg-white h-screen flex flex-col  select-none">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-50">
       <LogoIcon/>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 shadow-sm custom-scrollbar  rounded-r-[20px] bg-white shadow-[82px_0_23px_0_rgba(224,224,224,0),53px_0_21px_0_rgba(224,224,224,0.01),30px_0_18px_0_rgba(224,224,224,0.05),13px_0_13px_0_rgba(224,224,224,0.09),3px_0_7px_0_rgba(224,224,224,0.10)]">
  {menuItems.map((item, idx) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={idx}
              href={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base md:text-lg font-semibold font-sora transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#EAEBFF] text-primaryColor'
                  : 'text-[#B5BCC8] hover:bg-slate-50 hover:text-primaryColor'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-md" />
              )}
            <span>{item.icon(isActive)}</span> 
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;