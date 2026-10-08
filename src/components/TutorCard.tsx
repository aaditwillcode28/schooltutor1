import React from 'react';
import { UserAccount, FreeBlockId } from '../types/index.ts';
import { FREE_BLOCKS } from '../data/ibdpData.ts';
import { Calendar, Users, Award, ArrowRight } from 'lucide-react';

interface TutorCardProps {
  tutor: UserAccount;
  selectedLearnerBlocks: FreeBlockId[];
  onBookAppointment: (tutor: UserAccount) => void;
}

export const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  selectedLearnerBlocks,
  onBookAppointment,
}) => {
  const profile = tutor.tutorProfile;
  if (!profile) return null;

  // Mutual free blocks
  const mutualBlocks = profile.availableBlocks.filter((b) =>
    selectedLearnerBlocks.includes(b)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {tutor.name}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {tutor.gradYear}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {tutor.email}
            </div>
          </div>

          {/* IB Score Grade Badge */}
          {(() => {
            const maxGrade = Math.max(...profile.subjects.map((s) => s.gradeScore || 7), 5);
            return (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold shrink-0">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>IB Grade {maxGrade} Tutor</span>
              </div>
            );
          })()}
        </div>

        {/* Subjects Offered */}
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Subjects Offered
          </div>
          <div className="space-y-1.5">
            {profile.subjects.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      sub.level === 'HL'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sub.level}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {sub.subjectName}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] font-medium">
                  {sub.scoreBadge || 'Grade 7'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Description / Notes */}
        {profile.notes && (
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Class Notes & Approach
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/70">
              "{profile.notes}"
            </p>
          </div>
        )}

        {/* Available Free Blocks */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <span>Available Free Blocks</span>
            {mutualBlocks.length > 0 && (
              <span className="text-emerald-700 font-bold lowercase normal-case tracking-normal">
                {mutualBlocks.length} matching your schedule
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.availableBlocks.map((blockId) => {
              const block = FREE_BLOCKS.find((b) => b.id === blockId);
              if (!block) return null;
              const isMutual = selectedLearnerBlocks.includes(blockId);

              return (
                <span
                  key={blockId}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all
                    ${block.bgClass} ${block.textClass} ${block.borderClass} border
                    ${isMutual ? 'ring-2 ring-emerald-500 ring-offset-1' : 'opacity-90'}
                  `}
                  title={`${block.name}`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-black/20"
                    style={{ backgroundColor: block.hexCode }}
                  />
                  <span>{block.name}</span>
                  {isMutual && (
                    <span className="text-[10px] bg-white/25 px-1 rounded font-bold">
                      Match
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer details & Action */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Capacity: Max {profile.capacity} student{profile.capacity > 1 ? 's' : ''}/session</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onBookAppointment(tutor)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Appointment</span>
          <ArrowRight className="w-3.5 h-3.5 ml-auto" />
        </button>
      </div>
    </div>
  );
};
