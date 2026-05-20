import { Search } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="h-20 bg-white flex items-center justify-between px-4 md:px-8 font-sans w-full sticky top-0 z-30">
      
      {/* Left Area: Mobile Burger Menu & Search Bar */}
      <div className="flex items-center space-x-4 flex-1 max-w-xl">
        {/* Mobile Hamburger Menu (Hidden on Desktop) */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg bg-slate-50 text-slate-600 md:hidden hover:bg-slate-100 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Input Box */}
        <div className="relative w-full hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search/>
          </span>
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-[#F8FAFC] border border-slate-100 rounded-full py-3.5 pl-10 pr-4 text-lg md:text-xl text-slate-600 placeholder-slate-400 focus:outline-none focus:border-indigo-200 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Area: Actions, Badges & Profile */}
      <div className="flex items-center space-x-3 md:space-x-5">
        
        {/* Message Alert Icon */}
        <button className="relative  flex items-center justify-center text transition-colors cursor-pointer">
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M2.2373 10.2492L4.6663 11.7064V8.30554L2.2373 10.2492Z" fill="#5C6470"/>
  <path d="M1.16699 12.3271V23.3334C1.169 23.8531 1.28866 24.3657 1.51699 24.8326L9.20183 17.1501L1.16699 12.3271Z" fill="#5C6470"/>
  <path d="M26.4836 24.8326C26.712 24.3657 26.8316 23.8531 26.8336 23.3334V12.3271L18.7988 17.1501L26.4836 24.8326Z" fill="#5C6470"/>
  <path d="M23.333 8.30554V11.7064L25.762 10.2492L23.333 8.30554Z" fill="#5C6470"/>
  <path d="M21.0492 13.0772C21.024 12.998 21.0076 12.9162 21.0002 12.8334V7.00004C21.0002 6.69062 20.8773 6.39388 20.6585 6.17508C20.4397 5.95629 20.1429 5.83337 19.8335 5.83337H8.16684C7.85742 5.83337 7.56067 5.95629 7.34188 6.17508C7.12309 6.39388 7.00017 6.69062 7.00017 7.00004V12.8334C6.99274 12.9162 6.97631 12.998 6.95117 13.0772L14.0002 17.3064L21.0492 13.0772Z" fill="#5C6470"/>
  <path d="M17.3262 3.5L14.7292 1.42217C14.5222 1.2565 14.2651 1.16623 14 1.16623C13.7349 1.16623 13.4777 1.2565 13.2708 1.42217L10.6738 3.5H17.3262Z" fill="#5C6470"/>
  <path d="M16.7363 18.3855L14.6013 19.6688C14.4198 19.7778 14.2122 19.8354 14.0005 19.8354C13.7888 19.8354 13.5811 19.7778 13.3996 19.6688L11.2646 18.3855L3.16797 26.4833C3.63487 26.7116 4.1474 26.8313 4.66714 26.8333H23.3338C23.8535 26.8313 24.3661 26.7116 24.833 26.4833L16.7363 18.3855Z" fill="#5C6470"/>
</svg>
          <span className="absolute -top-2 -right-2 bg-primaryColor text-white font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            6
          </span>
        </button>

        {/* Notification Alert Icon */}
        <button className="relative  flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M23.3333 19.8333H23.1187C23.2568 19.4597 23.3295 19.065 23.3333 18.6666V12.8333C23.3294 10.7663 22.6402 8.75902 21.3735 7.12565C20.1068 5.49228 18.3343 4.32508 16.3333 3.80679V3.49996C16.3333 2.88112 16.0875 2.28763 15.6499 1.85004C15.2123 1.41246 14.6188 1.16663 14 1.16663C13.3812 1.16663 12.7877 1.41246 12.3501 1.85004C11.9125 2.28763 11.6667 2.88112 11.6667 3.49996V3.80679C9.66574 4.32508 7.89317 5.49228 6.6265 7.12565C5.35983 8.75902 4.67058 10.7663 4.66667 12.8333V18.6666C4.67053 19.065 4.74316 19.4597 4.88133 19.8333H4.66667C4.35725 19.8333 4.0605 19.9562 3.84171 20.175C3.62292 20.3938 3.5 20.6905 3.5 21C3.5 21.3094 3.62292 21.6061 3.84171 21.8249C4.0605 22.0437 4.35725 22.1666 4.66667 22.1666H23.3333C23.6428 22.1666 23.9395 22.0437 24.1583 21.8249C24.3771 21.6061 24.5 21.3094 24.5 21C24.5 20.6905 24.3771 20.3938 24.1583 20.175C23.9395 19.9562 23.6428 19.8333 23.3333 19.8333Z" fill="#5C6470"/>
  <path d="M9.98242 24.5C10.3868 25.2088 10.9715 25.7981 11.6771 26.2079C12.3828 26.6178 13.1844 26.8337 14.0004 26.8337C14.8165 26.8337 15.618 26.6178 16.3237 26.2079C17.0294 25.7981 17.614 25.2088 18.0184 24.5H9.98242Z" fill="#5C6470"/>
</svg>
          <span className="absolute -top-2 -right-2 bg-primaryColor text-white font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            4
          </span>
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />

        {/* User Profile Info Card */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100 flex-shrink-0">
            {/* Fallback Initial / Avatar */}
            <span className="w-full h-full flex items-center justify-center font-bold text-slate-500 bg-slate-100">C</span>
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <h4 className="text-base font-semibold text-[#000000] group-hover:text-indigo-600 transition-colors">
              Caryadee
            </h4>
            <span className="text-xs font-bold text-[#8F8F8F]">
              Super Admin
            </span>
          </div>
          <span ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M6 9L12 15L18 9" stroke="#D3D6E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg></span>
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;