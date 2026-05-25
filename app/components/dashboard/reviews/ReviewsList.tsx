'use client';

import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'positive' | 'low' | 'flagged';

interface Review {
  id: number;
  inspectorName: string;
  inspectorAvatar: string;
  reviewedBy: string;
  date: string;
  comment: string;
  inspectionType: string;
  rating: number;
  isFlagged: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const REVIEWS: Review[] = [
  {
    id: 1,
    inspectorName: 'Marcus Johnson',
    inspectorAvatar: 'MJ',
    reviewedBy: 'Gregory Holt',
    date: '2026-05-14',
    comment:
      '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
    inspectionType: 'Four Point Inspection',
    rating: 3.5,
    isFlagged: false,
  },
  {
    id: 2,
    inspectorName: 'Marcus Johnson',
    inspectorAvatar: 'MJ',
    reviewedBy: 'Gregory Holt',
    date: '2026-05-14',
    comment:
      '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
    inspectionType: 'Four Point Inspection',
    rating: 3.5,
    isFlagged: false,
  },
  {
    id: 3,
    inspectorName: 'Marcus Johnson',
    inspectorAvatar: 'MJ',
    reviewedBy: 'Gregory Holt',
    date: '2026-05-14',
    comment:
      '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
    inspectionType: 'Four Point Inspection',
    rating: 3.5,
    isFlagged: false,
  },
  {
    id: 4,
    inspectorName: 'Marcus Johnson',
    inspectorAvatar: 'MJ',
    reviewedBy: 'Gregory Holt',
    date: '2026-05-14',
    comment:
      '"Arrived over an hour late with no communication. The report was incomplete and had to be redone. Very disappointing experience."',
    inspectionType: 'Four Point Inspection',
    rating: 1.5,
    isFlagged: true,
  },
  {
    id: 5,
    inspectorName: 'Marcus Johnson',
    inspectorAvatar: 'MJ',
    reviewedBy: 'Gregory Holt',
    date: '2026-05-14',
    comment:
      '"Absolutely professional and thorough. Marcus was on time, explained every finding clearly, and delivered the report same day. Highly recommend!"',
    inspectionType: 'Four Point Inspection',
    rating: 5,
    isFlagged: true,
  },
  {
    id: 6,
    inspectorName: 'Marcus Johnson',
    inspectorAvatar: 'MJ',
    reviewedBy: 'Gregory Holt',
    date: '2026-05-14',
    comment:
      '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
    inspectionType: 'Four Point Inspection',
    rating: 3.5,
    isFlagged: false,
  },
  {
    id: 7,
    inspectorName: 'Marcus Johnson',
    inspectorAvatar: 'MJ',
    reviewedBy: 'Gregory Holt',
    date: '2026-05-14',
    comment:
      '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
    inspectionType: 'Four Point Inspection',
    rating: 2.0,
    isFlagged: false,
  },
  {
    id: 8,
    inspectorName: 'Marcus Johnson',
    inspectorAvatar: 'MJ',
    reviewedBy: 'Gregory Holt',
    date: '2026-05-14',
    comment:
      '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
    inspectionType: 'Four Point Inspection',
    rating: 4.5,
    isFlagged: false,
  },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar: React.FC<{ initials: string }> = ({ initials }) => (
  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 overflow-hidden">
    <span className="text-sm font-semibold text-orange-500">{initials}</span>
  </div>
);

// ─── ReviewCard ───────────────────────────────────────────────────────────────

interface ReviewCardProps {
  review: Review;
  onFlag: (id: number) => void;
  onDismissFlag: (id: number) => void;
  onSuspend: (id: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onFlag, onDismissFlag, onSuspend }) => {
  const isFlagged = review.isFlagged;

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 flex flex-col gap-3 border transition-shadow hover:shadow-md ${
        isFlagged ? 'border-red-300 bg-red-200 shadow-sm shadow-red-100' : 'border-slate-100 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar initials={review.inspectorAvatar} />
          <div>
            <p className="text-sm font-semibold text-[#111827] font-sora leading-5">{review.inspectorName}</p>
            <p className="text-xs text-[#9CA3AF] font-normal font-roboto leading-4">Reviewed by {review.reviewedBy}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isFlagged && (
            <span className="text-xs font-semibold text-red-500 border border-red-300 rounded-full px-2.5 py-0.5 bg-red-50">
              Flagged
            </span>
          )}
          <span className="text-xs text-[#5C6470] font-normal font-roboto leading-4">{review.date}</span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-[#4B5563] font-normal font-roboto  leading-relaxed">{review.comment}</p>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <span className="text-xs font-normal leading-5.5 text-[#4B5563]  font-roboto rounded-md px-3 py-1 bg-[#F9F9FF]">
          {review.inspectionType}
        </span>

        {isFlagged ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDismissFlag(review.id)}
              className="text-xs font-normal text-red-500 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-50 cursor-pointer font-roboto leading-5.5 transition-colors"
            >
              Dismiss Flag
            </button>
            <button
              onClick={() => onSuspend(review.id)}
              className="text-xs font-normal text-white bg-red-500 rounded-lg px-3 py-1.5 hover:bg-red-600 cursor-pointer font-roboto leading-5.5 transition-colors"
            >
              Suspend Inspector
            </button>
          </div>
        ) : (
          <button
            onClick={() => onFlag(review.id)}
            className="text-xs font-normal leading-5.5 text-red-400 border font-roboto border-red-200 rounded-lg px-4 py-1.5 hover:bg-red-50 cursor-pointer transition-colors"
          >
            Flag
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Filter Tab ───────────────────────────────────────────────────────────────

interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  badgeColor: string;
  badgeTextColor: string;
  textColor: string;
}

const FilterTab: React.FC<FilterTabProps> = ({ label, count, active, onClick, badgeColor, badgeTextColor, textColor }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 text-sm font-normal leading-5 px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
      active ? 'bg-slate-900 text-white' : `${textColor} hover:bg-slate-100`
    }`}
  >
    {label}
    <span
      className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
        active ? 'bg-white text-slate-900' : `${badgeColor} ${badgeTextColor}`
      }`}
    >
      {count}
    </span>
  </button>
);



const ReviewList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);

  const handleFlag = (id: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFlagged: true } : r))
    );
  };

  const handleDismissFlag = (id: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFlagged: false } : r))
    );
  };

  const handleSuspend = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = reviews.filter((r) => {
    if (activeFilter === 'positive') return r.rating >= 3.5;
    if (activeFilter === 'low') return r.rating <= 2.5;
    if (activeFilter === 'flagged') return r.isFlagged;
    return true;
  });

  const counts = {
    all: reviews.length,
    positive: reviews.filter((r) => r.rating >= 3.5).length,
    low: reviews.filter((r) => r.rating <= 2.5).length,
    flagged: reviews.filter((r) => r.isFlagged).length,
  };

  const filters: { key: FilterType; label: string; badgeColor: string; badgeTextColor: string; textColor: string }[] = [
    { key: 'all',      label: 'All',                      badgeColor: 'bg-slate-200',  badgeTextColor: 'text-slate-700', textColor: 'text-slate-600' },
    { key: 'positive', label: 'Positive Ratings (≥3.5★)', badgeColor: 'bg-green-100',  badgeTextColor: 'text-[green-700]', textColor: 'text-[#10B981]' },
    { key: 'low',      label: 'Low Ratings (≤2.5★)',      badgeColor: 'bg-red-100',    badgeTextColor: 'text-red-600',   textColor: 'text-red-500'   },
    { key: 'flagged',  label: 'Flagged',                  badgeColor: 'bg-yellow-100', badgeTextColor: 'text-yellow-700',textColor: 'text-yellow-600'},
  ];

  return (
    <div className="min-h-screen my-6 md:my-12 ">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filters.map((f) => (
          <FilterTab
            key={f.key}
            label={f.label}
            count={counts[f.key]}
            badgeColor={f.badgeColor}
            badgeTextColor={f.badgeTextColor}
            textColor={f.textColor}
            active={activeFilter === f.key}
            onClick={() => setActiveFilter(f.key)}
          />
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-slate-400 py-20 text-sm">No reviews found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onFlag={handleFlag}
              onDismissFlag={handleDismissFlag}
              onSuspend={handleSuspend}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;