import React from 'react';
import { CompatibilityScore } from '../../types';
import { Sparkles, Info } from 'lucide-react';

interface CompatibilityBadgeProps {
  score?: CompatibilityScore;
  simpleScore?: number;
  showBreakdown?: boolean;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  score,
  simpleScore = 90,
  showBreakdown = false
}) => {
  const total = score?.total || simpleScore;

  const getColorClass = (val: number) => {
    if (val >= 92) return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/50';
    if (val >= 85) return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50';
    return 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700';
  };

  return (
    <div className="inline-flex flex-col gap-1.5">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold tracking-wide ${getColorClass(total)} shadow-sm`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>{total}% Match</span>
      </div>

      {showBreakdown && score && (
        <div className="p-3 bg-stone-50 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 font-medium">
            <span>Lifestyle & Values</span>
            <span className="font-semibold text-stone-900 dark:text-stone-200">{score.lifestyle}%</span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${score.lifestyle}%` }} />
          </div>

          <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 font-medium">
            <span>Education & Profession</span>
            <span className="font-semibold text-stone-900 dark:text-stone-200">{score.education}%</span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${score.education}%` }} />
          </div>

          <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 font-medium">
            <span>Native & Location</span>
            <span className="font-semibold text-stone-900 dark:text-stone-200">{score.location}%</span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${score.location}%` }} />
          </div>

          {score.reasons && score.reasons.length > 0 && (
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="font-semibold text-amber-800 dark:text-amber-400 block mb-1">
                Why this match:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-stone-600 dark:text-stone-400 text-[11px]">
                {score.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
