import React from 'react';

interface MatchSkeletonProps {
  layout?: 'grid' | 'list';
  count?: number;
}

export const MatchSkeleton: React.FC<MatchSkeletonProps> = ({ layout = 'grid', count = 4 }) => {
  return (
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
          : 'flex flex-col gap-4'
      }
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-white dark:bg-[#1A0F12] rounded-2xl border border-[#EFE6DA] dark:border-stone-800 overflow-hidden animate-pulse ${
            layout === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col'
          }`}
        >
          {/* Photo area skeleton */}
          <div
            className={`bg-stone-200 dark:bg-stone-800 shrink-0 ${
              layout === 'list' ? 'w-full md:w-56 h-64 md:h-auto' : 'w-full h-64'
            }`}
          />

          {/* Details area skeleton */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-40 bg-stone-200 dark:bg-stone-800 rounded-md" />
                <div className="h-6 w-20 bg-amber-100 dark:bg-stone-800 rounded-full" />
              </div>
              <div className="h-3 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-4 bg-stone-100 dark:bg-stone-800/60 rounded" />
                <div className="h-4 bg-stone-100 dark:bg-stone-800/60 rounded" />
                <div className="h-4 bg-stone-100 dark:bg-stone-800/60 rounded" />
                <div className="h-4 bg-stone-100 dark:bg-stone-800/60 rounded" />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-20 bg-stone-200 dark:bg-stone-800 rounded-xl" />
                <div className="h-8 w-24 bg-stone-200 dark:bg-stone-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
