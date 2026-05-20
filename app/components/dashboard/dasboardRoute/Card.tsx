
import { UsersIcon } from '../../icon/UsersIcon';
import { NotificationsIcon } from '../../icon/NotificationIcons';
import { InspectorIcon } from '../../icon/InspectorIcon';
import StatCard from '../../reusabledCard/StateCard';

const stats = [
  {
    value: '1.28M',
    label: 'Total Revenue',
    change: '+4%',
    isPositive: true,
    valueColor: 'text-amber-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
        {/* your wallet icon SVG paths here */}
        <circle cx="22" cy="22" r="22" fill="#FFF7ED" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="18">💰</text>
      </svg>
    ),
  },
  {
    value: '9,825',
    label: 'Total Users',
    change: '+9%',
    isPositive: true,
    valueColor: 'text-slate-800',
    icon: <UsersIcon isActive={false} />,
  },
  {
    value: '653',
    label: 'Total Inspectors',
    change: '-2%',
    isPositive: false,
    valueColor: 'text-slate-800',
    icon: <InspectorIcon isActive={false} />,
  },
  {
    value: '06',
    label: 'Pending Approvals',
    change: '+.02%',
    isPositive: true,
    valueColor: 'text-slate-800',
    icon: <NotificationsIcon isActive={false} />,
  },
];

export default function Card() {
  return (
    <div className="flex gap-4 flex-wrap">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}