'use client';

import StatCard from '../../reusabledCard/StateCard';
import { useGetReportStatsQuery } from '@/app/redux/features/reportsApi';
// ⚠️ adjust the import path above to wherever your reportsApi slice actually lives

// ─── Icons (60x60, same construction style as your existing Total Reports icon) ──

const TotalReportsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
    <g clipPath="url(#clip0_689_19308)">
      <path d="M43.6183 13.163H53.9445L43.0762 2.4884V12.6216C43.0762 12.9199 43.3192 13.163 43.6183 13.163Z" fill="#4D55F5"/>
      <path d="M43.6189 16.5687C41.4424 16.5687 39.6714 14.7981 39.6714 12.6216V1.5H11.3539C7.85021 1.5 5 4.35021 5 7.85379V53.2712C5 56.7748 7.85021 59.625 11.3539 59.625H48.5973C52.1013 59.625 54.9511 56.7748 54.9511 53.2712V16.5686L43.6189 16.5687ZM39.7263 45.5478H17.7929C16.8524 45.5478 16.09 44.7854 16.09 43.845C16.09 42.9045 16.8524 42.1421 17.7929 42.1421H39.7263C40.6672 42.1421 41.4292 42.9045 41.4292 43.845C41.4292 44.7854 40.6672 45.5478 39.7263 45.5478ZM16.09 37.0334C16.09 36.093 16.8524 35.3306 17.7929 35.3306H37.3654C38.3063 35.3306 39.0683 36.093 39.0683 37.0334C39.0683 37.9739 38.3055 38.7363 37.3654 38.7363H17.7929C16.8524 38.7363 16.09 37.9739 16.09 37.0334ZM41.7971 31.9248H17.7929C16.8524 31.9248 16.09 31.1624 16.09 30.2219C16.09 29.2815 16.8524 28.519 17.7929 28.519H41.7971C42.7376 28.519 43.5 29.2815 43.5 30.2219C43.5 31.1624 42.7376 31.9248 41.7971 31.9248Z" fill="#4D55F5"/>
    </g>
    <defs>
      <clipPath id="clip0_689_19308">
        <rect width="60" height="60" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// Started → in-progress / clock
const StartedReportsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
    <path d="M30 9C18.402 9 9 18.402 9 30C9 41.598 18.402 51 30 51C41.598 51 51 41.598 51 30C51 18.402 41.598 9 30 9ZM30 47.5938C20.3621 47.5938 12.4062 39.6379 12.4062 30C12.4062 20.3621 20.3621 12.4062 30 12.4062C39.6379 12.4062 47.5938 20.3621 47.5938 30C47.5938 39.6379 39.6379 47.5938 30 47.5938Z" fill="#F5A623"/>
    <path d="M31.7031 18.75H28.2969V31.7031L39.0586 38.1602L40.7812 35.3203L31.7031 29.9648V18.75Z" fill="#F5A623"/>
  </svg>
);

// Completed → check circle
const CompletedReportsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
    <path d="M30 5C16.1929 5 5 16.1929 5 30C5 43.8071 16.1929 55 30 55C43.8071 55 55 43.8071 55 30C55 16.1929 43.8071 5 30 5ZM30 51.5938C18.1543 51.5938 8.40625 41.8457 8.40625 30C8.40625 18.1543 18.1543 8.40625 30 8.40625C41.8457 8.40625 51.5938 18.1543 51.5938 30C51.5938 41.8457 41.8457 51.5938 30 51.5938Z" fill="#22C55E"/>
    <path d="M25.7344 36.7148L18.9219 29.9023L16.4844 32.3398L25.7344 41.5898L43.5156 23.8086L41.0781 21.3711L25.7344 36.7148Z" fill="#22C55E"/>
  </svg>
);

// Archived → storage box
const ArchivedReportsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
    <path d="M53 14H7C5.89543 14 5 14.8954 5 16V21C5 22.1046 5.89543 23 7 23H53C54.1046 23 55 22.1046 55 21V16C55 14.8954 54.1046 14 53 14Z" fill="#94A3B8"/>
    <path d="M9 26V46C9 48.7614 11.2386 51 14 51H46C48.7614 51 51 48.7614 51 46V26H46.5V46C46.5 46.2761 46.2761 46.5 46 46.5H14C13.7239 46.5 13.5 46.2761 13.5 46V26H9Z" fill="#94A3B8"/>
    <path d="M24 30H36C37.1046 30 38 30.8954 38 32C38 33.1046 37.1046 34 36 34H24C22.8954 34 22 33.1046 22 32C22 30.8954 22.8954 30 24 30Z" fill="#94A3B8"/>
  </svg>
);

export default function ReportsCard() {
  const { data, isLoading } = useGetReportStatsQuery();

  type ReportsCardStats = {
    total_reports?: number;
    total_started_reports?: number;
    total_completed_reports?: number;
    total_archived_reports?: number;
  };

  const reportStats = data as ReportsCardStats | undefined;

  const stats = [
    {
      value: String(reportStats?.total_reports ?? 0),
      label: 'Total Reports',
      valueColor: 'text-primaryColor',
      icon: TotalReportsIcon,
    },
    {
      value: String(reportStats?.total_started_reports ?? 0),
      label: 'Started Reports',
      valueColor: 'text-[#F5A623]',
      icon: StartedReportsIcon,
    },
    {
      value: String(reportStats?.total_completed_reports ?? 0),
      label: 'Completed Reports',
      valueColor: 'text-[#22C55E]',
      icon: CompletedReportsIcon,
    },
    {
      value: String(reportStats?.total_archived_reports ?? 0),
      label: 'Archived Reports',
      valueColor: 'text-[#94A3B8]',
      icon: ArchivedReportsIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {isLoading
        ? [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
          ))
        : stats.map((stat, i) => <StatCard key={i} {...stat} />)}
    </div>
  );
}