/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import React, { useState } from 'react';
import {
  useGetReviewsQuery,
  useToggleReviewStatusMutation,
  useSuspendInspectorFromReviewMutation,
} from '@/app/redux/features/reviewsApi';
import { toast } from 'react-toastify';



type FilterType = 'all' | 'positive' | 'low' | 'flagged';

interface Review {
  id: number;          // review id
  inspectorId: number; // inspector id — suspend er jonno
  inspectorName: string;
  inspectorAvatar: string;
  reviewedBy: string;
  date: string;
  comment: string;
  inspectionType: string;
  rating: number;
  isFlagged: boolean;
  isSuspended: boolean;
}

// ─── Normalize API response → Review ─────────────────────────────────────────

const normalizeReview = (r: any): Review => {
  const inspector = r.inspection_assign?.inspector;
  const homeowner = r.homeowner;
  const types: any[] = r.inspection_assign?.inspection_booking?.inspection_types ?? [];

  const firstName = inspector?.first_name ?? '';
  const lastName = inspector?.last_name ?? '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Inspector';
  const initials = ((firstName[0] ?? '') + (lastName[0] ?? '')).toUpperCase() || '??';

  return {
    id: r.id,                                    // review id
    inspectorId: inspector?.id ?? 0,             // inspector id
    inspectorName: fullName,
    inspectorAvatar: initials,
    reviewedBy: `${homeowner?.first_name ?? ''} ${homeowner?.last_name ?? ''}`.trim() || 'Unknown',
    date: r.created_at ? r.created_at.split('T')[0] : '',
    comment: r.description ?? '',
    inspectionType: types.map((t) => t.title).join(', ') || 'N/A',
    rating: parseFloat(r.rating ?? '0'),
    isFlagged: r.status === 'flagged',
    isSuspended: r.suspendInspector === 1,
  };
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar: React.FC<{ initials: string }> = ({ initials }) => (
  <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
    <span className="text-sm font-semibold text-orange-500">{initials}</span>
  </div>
);

// ─── ReviewCard ───────────────────────────────────────────────────────────────

interface ReviewCardProps {
  review: Review;
  onFlag: (reviewId: number) => void;
  onSuspend: (reviewId: number) => void;
  isToggling: boolean;
  isSuspending: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onFlag,
  onSuspend,
  isToggling,
  isSuspending,
}) => {
  const { isFlagged, isSuspended } = review;

  return (
    <div
      className={`relative rounded-2xl p-5 flex flex-col gap-3 border hover:shadow-sm ${
        isFlagged ? 'border-red-300 bg-[#FFF8F8] shadow-red-100' : 'border-[#F1F1F1]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar initials={review.inspectorAvatar} />
          <div>
            <p className="text-sm font-semibold text-[#111827] font-sora leading-5">
              {review.inspectorName}
            </p>
            <p className="text-xs text-[#9CA3AF] font-normal font-roboto leading-4">
              Reviewed by {review.reviewedBy}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isFlagged && (
            <span className="text-xs font-semibold text-red-500 border border-red-300 rounded-full px-2.5 py-0.5 bg-red-50">
              Flagged
            </span>
          )}
          {isSuspended && (
            <span className="text-xs font-semibold text-gray-400 border border-gray-200 rounded-full px-2.5 py-0.5 bg-gray-50">
              Suspended
            </span>
          )}
          <span className="text-xs text-[#5C6470] font-normal font-roboto leading-4">
            {review.date}
          </span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-[#4B5563] font-normal font-roboto leading-relaxed">
        {review.comment}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <span className="text-xs font-normal text-[#4B5563] font-roboto rounded-md px-3 py-1 bg-[#F9F9FF]">
          {review.inspectionType}
        </span>

        {isFlagged ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onFlag(review.id)}
              disabled={isToggling}
              className="text-xs font-normal text-red-500 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-50 cursor-pointer font-roboto transition-colors disabled:opacity-50"
            >
              {isToggling ? 'Dismising...' : 'Dismiss Flag'}
            </button>
            {!isSuspended && (
              <button
                onClick={() => onSuspend(review.id)}
                disabled={isSuspending}
                className="text-xs font-normal text-white bg-red-500 rounded-lg px-3 py-1.5 hover:bg-red-600 cursor-pointer font-roboto transition-colors disabled:opacity-50"
              >
                {isSuspending ? 'Suspending...' : 'Suspend Inspector'}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onFlag(review.id)}
            disabled={isToggling}
            className="text-xs font-normal text-red-400 border font-roboto border-red-200 rounded-lg px-4 py-1.5 hover:bg-red-50 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isToggling ? 'Flaging...' : 'Flag'}
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

const FilterTab: React.FC<FilterTabProps> = ({
  label, count, active, onClick,
  badgeColor, badgeTextColor, textColor,
}) => (
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

// ─── Main Component ───────────────────────────────────────────────────────────

const ReviewList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { data, isLoading, isFetching } = useGetReviewsQuery('all');

  const [toggleReviewStatus, { isLoading: isToggling }] = useToggleReviewStatusMutation();
  const [suspendInspector, { isLoading: isSuspending }] = useSuspendInspectorFromReviewMutation();

  const allReviews: Review[] = (data?.data ?? []).map(normalizeReview);

  // Client-side filter
  const filtered = allReviews.filter((r) => {
    if (activeFilter === 'positive') return r.rating >= 3.5;
    if (activeFilter === 'low') return r.rating < 3.5;
    if (activeFilter === 'flagged') return r.isFlagged;
    return true;
  });

  const counts = {
    all: allReviews.length,
    positive: allReviews.filter((r) => r.rating >= 3.5).length,
    low: allReviews.filter((r) => r.rating < 3.5).length,
    flagged: allReviews.filter((r) => r.isFlagged).length,
  };

  // Flag toggle — review id pathao
const handleFlag = async (reviewId: number) => {
  try {
    const res = await toggleReviewStatus(reviewId).unwrap();

    const isFlagged = res?.data?.status === "flagged";

    toast.success(
      isFlagged
        ? "Review flagged successfully"
        : "Flag removed successfully"
    );
  } catch (err) {
    console.error("Toggle flag error:", err);
    toast.error("Failed to update review status");
  }
};

  // Suspend — review id pathao (backend response-e review_id ache)
  const handleSuspend = async (reviewId: number) => {
    try {
      await suspendInspector(reviewId).unwrap();
      toast.success("Suspend successfully")
    } catch (err) {
      console.error('Suspend error:', err);
    }
  };

  const filters: {
    key: FilterType;
    label: string;
    badgeColor: string;
    badgeTextColor: string;
    textColor: string;
  }[] = [
    { key: 'all',      label: 'All',                      badgeColor: 'bg-slate-200',  badgeTextColor: 'text-slate-700',  textColor: 'text-slate-600'  },
    { key: 'positive', label: 'Positive Ratings (≥3.5★)', badgeColor: 'bg-green-100',  badgeTextColor: 'text-green-700',  textColor: 'text-[#10B981]'  },
    { key: 'low',      label: 'Low Ratings (<3.5★)',       badgeColor: 'bg-red-100',    badgeTextColor: 'text-red-600',    textColor: 'text-red-500'    },
    { key: 'flagged',  label: 'Flagged',                   badgeColor: 'bg-yellow-100', badgeTextColor: 'text-yellow-700', textColor: 'text-yellow-600' },
  ];

  const busy = isLoading || isFetching;

  return (
    <div className="min-h-screen my-6 md:my-12">
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

      {/* Content */}
      {busy ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[...Array(4)].map((_, index) => (
      <div
        key={index}
        className="border border-[#E5E7EB] rounded-xl p-5 animate-pulse"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>

          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>

        {/* Rating */}
        <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>

        {/* Review text */}
        <div className="space-y-2 mb-5">
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="h-9 flex-1 bg-gray-200 rounded-lg"></div>
          <div className="h-9 flex-1 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-slate-400 py-20 text-sm">No reviews found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onFlag={handleFlag}
              onSuspend={handleSuspend}
              isToggling={isToggling}
              isSuspending={isSuspending}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;

// 




// 'use client';

// import React, { useState } from 'react';

// // ─── Types ───────────────────────────────────────────────────────────────────

// type FilterType = 'all' | 'positive' | 'low' | 'flagged';

// interface Review {
//   id: number;
//   inspectorName: string;
//   inspectorAvatar: string;
//   reviewedBy: string;
//   date: string;
//   comment: string;
//   inspectionType: string;
//   rating: number;
//   isFlagged: boolean;
// }

// // ─── Mock Data ────────────────────────────────────────────────────────────────

// const REVIEWS: Review[] = [
//   {
//     id: 1,
//     inspectorName: 'Marcus Johnson',
//     inspectorAvatar: 'MJ',
//     reviewedBy: 'Gregory Holt',
//     date: '2026-05-14',
//     comment:
//       '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
//     inspectionType: 'Four Point Inspection',
//     rating: 3.5,
//     isFlagged: false,
//   },
//   {
//     id: 2,
//     inspectorName: 'Marcus Johnson',
//     inspectorAvatar: 'MJ',
//     reviewedBy: 'Gregory Holt',
//     date: '2026-05-14',
//     comment:
//       '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
//     inspectionType: 'Four Point Inspection',
//     rating: 3.5,
//     isFlagged: false,
//   },
//   {
//     id: 3,
//     inspectorName: 'Marcus Johnson',
//     inspectorAvatar: 'MJ',
//     reviewedBy: 'Gregory Holt',
//     date: '2026-05-14',
//     comment:
//       '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
//     inspectionType: 'Four Point Inspection',
//     rating: 3.5,
//     isFlagged: false,
//   },
//   {
//     id: 4,
//     inspectorName: 'Marcus Johnson',
//     inspectorAvatar: 'MJ',
//     reviewedBy: 'Gregory Holt',
//     date: '2026-05-14',
//     comment:
//       '"Arrived over an hour late with no communication. The report was incomplete and had to be redone. Very disappointing experience."',
//     inspectionType: 'Four Point Inspection',
//     rating: 1.5,
//     isFlagged: true,
//   },
//   {
//     id: 5,
//     inspectorName: 'Marcus Johnson',
//     inspectorAvatar: 'MJ',
//     reviewedBy: 'Gregory Holt',
//     date: '2026-05-14',
//     comment:
//       '"Absolutely professional and thorough. Marcus was on time, explained every finding clearly, and delivered the report same day. Highly recommend!"',
//     inspectionType: 'Four Point Inspection',
//     rating: 5,
//     isFlagged: true,
//   },
//   {
//     id: 6,
//     inspectorName: 'Marcus Johnson',
//     inspectorAvatar: 'MJ',
//     reviewedBy: 'Gregory Holt',
//     date: '2026-05-14',
//     comment:
//       '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
//     inspectionType: 'Four Point Inspection',
//     rating: 3.5,
//     isFlagged: false,
//   },
//   {
//     id: 7,
//     inspectorName: 'Marcus Johnson',
//     inspectorAvatar: 'MJ',
//     reviewedBy: 'Gregory Holt',
//     date: '2026-05-14',
//     comment:
//       '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
//     inspectionType: 'Four Point Inspection',
//     rating: 2.0,
//     isFlagged: false,
//   },
//   {
//     id: 8,
//     inspectorName: 'Marcus Johnson',
//     inspectorAvatar: 'MJ',
//     reviewedBy: 'Gregory Holt',
//     date: '2026-05-14',
//     comment:
//       '"Average experience. Inspector was knowledgeable but communication could be much better. Report had a few errors that needed correction."',
//     inspectionType: 'Four Point Inspection',
//     rating: 4.5,
//     isFlagged: false,
//   },
// ];

// // ─── Avatar ───────────────────────────────────────────────────────────────────

// const Avatar: React.FC<{ initials: string }> = ({ initials }) => (
//   <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center shrink-0 overflow-hidden">
//     <span className="text-sm font-semibold text-orange-500">{initials}</span>
//   </div>
// );

// // ─── ReviewCard ───────────────────────────────────────────────────────────────

// interface ReviewCardProps {
//   review: Review;
//   onFlag: (id: number) => void;
//   onDismissFlag: (id: number) => void;
//   onSuspend: (id: number) => void;
// }

// const ReviewCard: React.FC<ReviewCardProps> = ({ review, onFlag, onDismissFlag, onSuspend }) => {
//   const isFlagged = review.isFlagged;

//   return (
//     <div
//       className={`relative  rounded-2xl p-5 flex flex-col gap-3 border hover:shadow-sm ${
//         isFlagged ? 'border-red-300 bg-[#FFF8F8]  shadow-red-100' : 'border-[#F1F1F1] '
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-start justify-between gap-2">
//         <div className="flex items-center gap-3">
//           <Avatar initials={review.inspectorAvatar} />
//           <div>
//             <p className="text-sm font-semibold text-[#111827] font-sora leading-5">{review.inspectorName}</p>
//             <p className="text-xs text-[#9CA3AF] font-normal font-roboto leading-4">Reviewed by {review.reviewedBy}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 shrink-0">
//           {isFlagged && (
//             <span className="text-xs font-semibold text-red-500 border border-red-300 rounded-full px-2.5 py-0.5 bg-red-50">
//               Flagged
//             </span>
//           )}
//           <span className="text-xs text-[#5C6470] font-normal font-roboto leading-4">{review.date}</span>
//         </div>
//       </div>

//       {/* Comment */}
//       <p className="text-sm text-[#4B5563] font-normal font-roboto  leading-relaxed">{review.comment}</p>

//       {/* Footer */}
//       <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
//         <span className="text-xs font-normal leading-5.5 text-[#4B5563]  font-roboto rounded-md px-3 py-1 bg-[#F9F9FF]">
//           {review.inspectionType}
//         </span>

//         {isFlagged ? (
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => onDismissFlag(review.id)}
//               className="text-xs font-normal text-red-500 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-50 cursor-pointer font-roboto leading-5.5 transition-colors"
//             >
//               Dismiss Flag
//             </button>
//             <button
//               onClick={() => onSuspend(review.id)}
//               className="text-xs font-normal text-white bg-red-500 rounded-lg px-3 py-1.5 hover:bg-red-600 cursor-pointer font-roboto leading-5.5 transition-colors"
//             >
//               Suspend Inspector
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={() => onFlag(review.id)}
//             className="text-xs font-normal leading-5.5 text-red-400 border font-roboto border-red-200 rounded-lg px-4 py-1.5 hover:bg-red-50 cursor-pointer transition-colors"
//           >
//             Flag
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // ─── Filter Tab ───────────────────────────────────────────────────────────────

// interface FilterTabProps {
//   label: string;
//   count: number;
//   active: boolean;
//   onClick: () => void;
//   badgeColor: string;
//   badgeTextColor: string;
//   textColor: string;
// }

// const FilterTab: React.FC<FilterTabProps> = ({ label, count, active, onClick, badgeColor, badgeTextColor, textColor }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-1.5 text-sm font-normal leading-5 px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
//       active ? 'bg-slate-900 text-white' : `${textColor} hover:bg-slate-100`
//     }`}
//   >
//     {label}
//     <span
//       className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
//         active ? 'bg-white text-slate-900' : `${badgeColor} ${badgeTextColor}`
//       }`}
//     >
//       {count}
//     </span>
//   </button>
// );



// const ReviewList: React.FC = () => {
//   const [activeFilter, setActiveFilter] = useState<FilterType>('all');
//   const [reviews, setReviews] = useState<Review[]>(REVIEWS);

//   const handleFlag = (id: number) => {
//     setReviews((prev) =>
//       prev.map((r) => (r.id === id ? { ...r, isFlagged: true } : r))
//     );
//   };

//   const handleDismissFlag = (id: number) => {
//     setReviews((prev) =>
//       prev.map((r) => (r.id === id ? { ...r, isFlagged: false } : r))
//     );
//   };

//   const handleSuspend = (id: number) => {
//     setReviews((prev) => prev.filter((r) => r.id !== id));
//   };

//   const filtered = reviews.filter((r) => {
//     if (activeFilter === 'positive') return r.rating >= 3.5;
//     if (activeFilter === 'low') return r.rating <= 2.5;
//     if (activeFilter === 'flagged') return r.isFlagged;
//     return true;
//   });

//   const counts = {
//     all: reviews.length,
//     positive: reviews.filter((r) => r.rating >= 3.5).length,
//     low: reviews.filter((r) => r.rating <= 2.5).length,
//     flagged: reviews.filter((r) => r.isFlagged).length,
//   };

//   const filters: { key: FilterType; label: string; badgeColor: string; badgeTextColor: string; textColor: string }[] = [
//     { key: 'all',      label: 'All',                      badgeColor: 'bg-slate-200',  badgeTextColor: 'text-slate-700', textColor: 'text-slate-600' },
//     { key: 'positive', label: 'Positive Ratings (≥3.5★)', badgeColor: 'bg-green-100',  badgeTextColor: 'text-[green-700]', textColor: 'text-[#10B981]' },
//     { key: 'low',      label: 'Low Ratings (≤2.5★)',      badgeColor: 'bg-red-100',    badgeTextColor: 'text-red-600',   textColor: 'text-red-500'   },
//     { key: 'flagged',  label: 'Flagged',                  badgeColor: 'bg-yellow-100', badgeTextColor: 'text-yellow-700',textColor: 'text-yellow-600'},
//   ];

//   return (
//     <div className="min-h-screen my-6 md:my-12 ">
//       {/* Filter Bar */}
//       <div className="flex flex-wrap items-center gap-2 mb-6">
//         {filters.map((f) => (
//           <FilterTab
//             key={f.key}
//             label={f.label}
//             count={counts[f.key]}
//             badgeColor={f.badgeColor}
//             badgeTextColor={f.badgeTextColor}
//             textColor={f.textColor}
//             active={activeFilter === f.key}
//             onClick={() => setActiveFilter(f.key)}
//           />
//         ))}
//       </div>

//       {/* Grid */}
//       {filtered.length === 0 ? (
//         <div className="text-center text-slate-400 py-20 text-sm">No reviews found.</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {filtered.map((review) => (
//             <ReviewCard
//               key={review.id}
//               review={review}
//               onFlag={handleFlag}
//               onDismissFlag={handleDismissFlag}
//               onSuspend={handleSuspend}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewList;