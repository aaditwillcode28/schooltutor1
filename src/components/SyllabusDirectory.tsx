import React from 'react';
import { ULLENS_IB_SUBJECTS } from '../data/ibdpData.ts';
import { BookOpen, GraduationCap, CheckCircle } from 'lucide-react';

interface SyllabusDirectoryProps {
  onSelectSubjectFilter: (subjectName: string) => void;
}

export const SyllabusDirectory: React.FC<SyllabusDirectoryProps> = ({
  onSelectSubjectFilter,
}) => {
  // Group subjects by groupNumber
  const grouped = [1, 2, 3, 4, 5, 6].map((grpNum) => {
    const subs = ULLENS_IB_SUBJECTS.filter((s) => s.groupNumber === grpNum);
    return {
      groupNumber: grpNum,
      groupName: subs[0]?.groupName || `Group ${grpNum}`,
      subjects: subs,
    };
  });

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-slate-700" />
              <span>Official Ullens School IBDP Curriculum</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 font-display">
              Subjects Offered at Ullens IBDP — Class of 2027 (Y-2) & Class of 2028 (Y-1)
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Candidates select 6 subjects (3 at Higher Level and 3 at Standard Level) from Groups 1–5, with their 6th choice from Groups 3, 4, or 6. Click any subject to filter available Grade 7 peer tutors.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600 shrink-0">
            <span className="font-bold text-slate-800 block">IBDP Core Requirements:</span>
            <span>Theory of Knowledge (TOK) · Extended Essay (EE) · CAS</span>
          </div>
        </div>

        {/* Group Tables */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {grouped.map((group) => (
            <div
              key={group.groupNumber}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900">
                  Group {group.groupNumber}: {group.groupName}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {group.subjects.length} subject{group.subjects.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2">
                {group.subjects.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => onSelectSubjectFilter(sub.name)}
                    className="p-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-slate-400 hover:shadow-xs cursor-pointer flex items-center justify-between text-xs transition-all"
                  >
                    <span className="font-semibold text-slate-800">
                      {sub.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {sub.allowedLevels.map((lvl) => (
                        <span
                          key={lvl}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            lvl === 'HL'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
