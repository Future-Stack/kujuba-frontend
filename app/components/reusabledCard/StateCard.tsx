


import React from 'react';

interface StatCardProps {
  value: React.ReactNode;
  label: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  valueColor?: string;
   labelColor?: string;   
  changeColor?: string;
}

const BlobBackground = () => (
  <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden rounded-2xl">
    
    <svg
      className="absolute right-0 top-0 h-full"
      viewBox="0 0 266 167"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMin meet"
    >
    
      <g transform="translate(266, 0) scale(-1, 1)">

        {/* Blob 6 — largest */}
        <path
          d="M413.787 126.035C463.443 265.669 336.873 306.44 267.381 309.372C137.168 311.401 189.118 240.367 81.8441 195.04C-25.43 149.713 81.8441 128.064 100.06 61.7655C118.277 -4.53343 -30.1528 29.2925 6.27996 -91.8045C42.7127 -212.902 274.128 -220.343 187.094 -64.7437C100.06 90.8558 351.716 -48.5072 413.787 126.035Z"
          stroke="#CEFFB7"
          strokeWidth="0.5"
          opacity="0.5"
        />
        {/* Blob 5 */}
        <path
          d="M350.344 116.343C392.378 234.291 285.237 268.73 226.413 271.207C116.188 272.921 160.164 212.918 69.3573 174.631C-21.4492 136.344 69.3573 118.057 84.7774 62.0546C100.197 6.05205 -25.447 34.6247 5.39297 -67.6656C36.2329 -169.956 232.124 -176.242 158.451 -44.8074C84.7774 86.6271 297.802 -31.0925 350.344 116.343Z"
          stroke="#CEFFB7"
          strokeWidth="0.6"
          opacity="0.6"
        />
        {/* Blob 4 */}
        <path
          d="M295.964 108.068C331.464 207.504 240.977 236.539 191.296 238.626C98.2054 240.072 135.345 189.486 58.6537 157.208C-18.0379 124.93 58.6537 109.514 71.6768 62.3008C84.6999 15.0879 -21.4142 39.1761 4.63201 -47.0597C30.6782 -133.295 196.12 -138.595 133.898 -27.7891C71.6768 83.0166 251.589 -16.2268 295.964 108.068Z"
          stroke="#CEFFB7"
          strokeWidth="0.7"
          opacity="0.7"
        />
        {/* Blob 3 */}
        <path
          d="M257.898 102.395C288.824 189.137 209.996 214.465 166.716 216.286C85.6179 217.547 117.973 173.42 51.1619 145.262C-15.6492 117.104 51.1619 103.656 62.5072 62.4704C73.8525 21.2847 -18.5905 42.2978 4.10005 -32.9292C26.7906 -108.156 170.918 -112.779 116.712 -16.1187C62.5072 80.5416 219.24 -6.03237 257.898 102.395Z"
          stroke="#CEFFB7"
          strokeWidth="0.8"
          opacity="0.8"
        />
        {/* Blob 2 */}
        <path
          d="M212.581 95.5396C238.063 166.943 173.113 187.792 137.452 189.291C70.6322 190.329 97.291 154.005 42.2424 130.826C-12.8062 107.648 42.2424 96.5774 51.5903 62.6746C60.9382 28.7717 -15.2297 46.0691 3.46606 -15.8555C22.1618 -77.7802 140.914 -81.5856 96.2523 -2.01766C51.5903 77.5503 180.729 6.28509 212.581 95.5396Z"
          stroke="#CEFFB7"
          strokeWidth="0.9"
          opacity="0.9"
        />
        {/* Blob 1 — smallest */}
        <path
          d="M212.581 95.5396C238.063 166.943 173.113 187.792 137.452 189.291C70.6322 190.329 97.291 154.005 42.2424 130.826C-12.8062 107.648 42.2424 96.5774 51.5903 62.6746C60.9382 28.7717 -15.2297 46.0691 3.46606 -15.8555C22.1618 -77.7802 140.914 -81.5856 96.2523 -2.01766C51.5903 77.5503 180.729 6.28509 212.581 95.5396Z"
          stroke="#CEFFB7"
          strokeWidth="1"
          opacity="1"
        />

      </g>
    </svg>
  </div>
);
const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  change,
  isPositive,
  icon,
  valueColor = 'text-secondaryColor',
  labelColor = 'text-primaryColor',
  changeColor,
}) => {
  const resolvedChangeColor = changeColor ?? (isPositive ? 'text-green-500' : 'text-red-500');
  return (
     <div className="relative overflow-hidden bg-white rounded-[20px] py-6  px-[20px] flex-1 min-w-[200px] hover:shadow-md py-8 border border-gray-200">

      {/* Layered blob background */}
      <BlobBackground />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className={`text-2xl md:text-3xl font-extrabold font-sora mb-4 ${valueColor}`}>
            {value}
          </span>

          <span className={`text-lg md:text-xl font-bold font-roboto whitespace-nowrap ${labelColor}`}>
            {label}
          </span>

          <span className={`text-sm md:text-base font-semibold mt-1 ${resolvedChangeColor}`}>
            {change}
          </span>
        </div>

        <div className="mt-1 shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;