import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  change,
  isPositive,
  icon,
  valueColor = 'text-slate-800',
}) => {
  return (
    <div 
      className="relative overflow-hidden bg-white rounded-2xl p-6 flex-1 min-w-[250px] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all duration-200 select-none"
      style={{
        backgroundImage: "url('/cardBgImg.png')",
        backgroundSize: "contain",         
        backgroundPosition: "right bottom", 
        backgroundRepeat: "no-repeat"       
      }}
    >
      
      {/* Content Inner Grid Layout */}
      <div className="relative z-10 flex items-start justify-between w-full">
        
        {/* Left Side: Text Information */}
        <div className="flex flex-col space-y-1.5">
          {/* Main Numeric Metric */}
          <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${valueColor}`}>
            {value}
          </span>
          
          {/* Label Title */}
          <span className="text-sm font-bold text-slate-500 tracking-wide">
            {label}
          </span>
          
          {/* Percentage Progress Bar */}
          <span className={`text-xs font-bold flex items-center gap-0.5 pt-1 ${
            isPositive ? 'text-[#14A38B]' : 'text-[#EF4444]'
          }`}>
            {isPositive ? '+' : ''}{change} than last month
          </span>
        </div>

        {/* Right Side: Media Icon Badge Wrapper */}
        <div className="shrink-0 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
          {icon}
        </div>
        
      </div>
    </div>
  );
};

export default StatCard;