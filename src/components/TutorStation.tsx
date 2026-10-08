import React, { useState, useEffect } from 'react';
import { UserAccount, FreeBlockId, SubjectLevel, Appointment, TutorSubjectOffering } from '../types/index.ts';
import { ULLENS_IB_SUBJECTS, FREE_BLOCKS } from '../data/ibdpData.ts';
import { 
  Check, 
  ArrowLeftRight, 
  Send, 
  Users, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Eye, 
  Calendar, 
  Clock, 
  Play, 
  Square, 
  Trash2, 
  XCircle,
  Award
} from 'lucide-react';

interface TutorStationProps {
  currentUser: UserAccount;
  appointments: Appointment[];
  onUpdateTutorProfile: (updatedProfile: NonNullable<UserAccount['tutorProfile']>) => void;
  onRemoveTutorProfile?: () => void;
  onConfirmAppointment: (aptId: string) => void;
  onStartSession: (aptId: string) => void;
  onEndSession: (aptId: string) => void;
  onRemoveAppointment: (aptId: string) => void;
  onSwitchMode: (mode: 'learner' | 'tutor') => void;
  onNotify: (msg: string) => void;
}

// Live Session Timer Sub-component
function SessionTimer({ startedAt }: { startedAt: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startMs = new Date(startedAt).getTime();
    const update = () => {
      const now = Date.now();
      setElapsed(Math.max(0, Math.floor((now - startMs) / 1000)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const hrs = Math.floor(elapsed / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-800 shadow-inner">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      <span>Session Timer: {hrs > 0 ? `${pad(hrs)}:` : ''}{pad(mins)}:{pad(secs)}</span>
    </div>
  );
}

export const TutorStation: React.FC<TutorStationProps> = ({
  currentUser,
  appointments,
  onUpdateTutorProfile,
  onRemoveTutorProfile,
  onConfirmAppointment,
  onStartSession,
  onEndSession,
  onRemoveAppointment,
  onSwitchMode,
  onNotify,
}) => {
  const profile = currentUser.tutorProfile || {
    subjects: [
      {
        subjectId: 'math-aa',
        subjectName: 'Mathematics: Analysis and Approaches',
        groupName: 'Mathematics',
        level: 'HL',
        gradeScore: 7,
        scoreBadge: 'Grade 7',
      }
    ],
    availableBlocks: ['berry-red', 'blue', 'green'],
    capacity: 2,
    notes: 'Focus on core concepts, past paper walk-throughs and IA tips.',
    publishedAt: new Date().toISOString(),
  };

  // 1. Available Free Blocks state
  const [selectedBlocks, setSelectedBlocks] = useState<FreeBlockId[]>(
    profile.availableBlocks
  );

  // 2. Selected subjects state: subjectId -> { isSelected, level, gradeScore }
  const [subjectSelections, setSubjectSelections] = useState<
    Record<string, { isSelected: boolean; level: SubjectLevel; gradeScore: number }>
  >(() => {
    const map: Record<string, { isSelected: boolean; level: SubjectLevel; gradeScore: number }> = {};

    ULLENS_IB_SUBJECTS.forEach((sub) => {
      const existing = profile.subjects.find((s) => s.subjectId === sub.id);
      map[sub.id] = {
        isSelected: !!existing,
        level: existing ? existing.level : sub.allowedLevels[0],
        gradeScore: existing ? existing.gradeScore || 7 : 7,
      };
    });

    return map;
  });

  // 3. Capacity & Notes state
  const [capacity, setCapacity] = useState<number>(profile.capacity || 2);
  const [notes, setNotes] = useState<string>(profile.notes || '');
  const [postedSuccess, setPostedSuccess] = useState(false);

  // Toggle Free Block
  const toggleBlock = (blockId: FreeBlockId) => {
    setSelectedBlocks((prev) =>
      prev.includes(blockId) ? prev.filter((b) => b !== blockId) : [...prev, blockId]
    );
  };

  // Toggle Subject selection
  const toggleSubject = (subId: string) => {
    setSubjectSelections((prev) => ({
      ...prev,
      [subId]: {
        ...prev[subId],
        isSelected: !prev[subId]?.isSelected,
      },
    }));
  };

  // Toggle HL / SL
  const toggleLevel = (subId: string, allowedLevels: SubjectLevel[]) => {
    if (allowedLevels.length <= 1) return;
    setSubjectSelections((prev) => {
      const current = prev[subId]?.level || 'HL';
      const nextLevel: SubjectLevel = current === 'HL' ? 'SL' : 'HL';
      return {
        ...prev,
        [subId]: {
          ...prev[subId],
          level: nextLevel,
        },
      };
    });
  };

  // Change Grade Score (5, 6, 7)
  const setSubjectGrade = (subId: string, grade: number) => {
    setSubjectSelections((prev) => ({
      ...prev,
      [subId]: {
        ...prev[subId],
        gradeScore: grade,
      },
    }));
  };

  // Capacity increments
  const handleIncrementCapacity = () => setCapacity((prev) => prev + 1);
  const handleDecrementCapacity = () => setCapacity((prev) => (prev > 1 ? prev - 1 : 1));

  // Post offerings
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();

    const offeredSubjects: TutorSubjectOffering[] = [];

    ULLENS_IB_SUBJECTS.forEach((sub) => {
      const state = subjectSelections[sub.id];
      if (state && state.isSelected) {
        offeredSubjects.push({
          subjectId: sub.id,
          subjectName: sub.name,
          groupName: sub.groupName,
          level: state.level,
          gradeScore: state.gradeScore,
          scoreBadge: `Grade ${state.gradeScore}`,
        });
      }
    });

    if (offeredSubjects.length === 0) {
      alert('Please check at least one subject to offer.');
      return;
    }

    if (selectedBlocks.length === 0) {
      alert('Please select at least one free block when you are available.');
      return;
    }

    const updatedProfile = {
      subjects: offeredSubjects,
      availableBlocks: selectedBlocks,
      capacity,
      notes: notes.trim() || 'Ready for peer tutoring sessions.',
      publishedAt: new Date().toISOString(),
    };

    onUpdateTutorProfile(updatedProfile);
    setPostedSuccess(true);
    onNotify('Successfully posted your tutor offerings to the network!');
    setTimeout(() => setPostedSuccess(false), 4000);
  };

  // Table Groups
  const groups = [
    { number: 1, name: 'Studies in Language and Literature' },
    { number: 2, name: 'Language acquisition' },
    { number: 3, name: 'Individuals and Societies' },
    { number: 4, name: 'Sciences' },
    { number: 5, name: 'Mathematics' },
    { number: 6, name: 'the Arts' },
  ];

  // Sessions booked with me
  const incomingAppointments = appointments.filter((apt) => apt.tutorId === currentUser.id);

  // My personal bookings as learner
  const myBookedAppointments = appointments.filter((apt) => apt.learnerId === currentUser.id);

  return (
    <div className="space-y-8">
      {/* Top Banner with Dual Mode Switcher */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Tutor Station
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome, {currentUser.name} ({currentUser.gradYear})
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            IBDP Y-1 and Y-2 peer tutors! Students with IB grades 5, 6, and 7 can tutor. Manage your offerings, confirm bookings, track live session timers, or switch to Learner Mode.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {incomingAppointments.length > 0 && (
            <a
              href="#tutor-incoming-sessions"
              className="px-3.5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-xl text-xs font-bold text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>{incomingAppointments.length} Student Session{incomingAppointments.length === 1 ? '' : 's'}</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              onSwitchMode('learner');
              onNotify('Switched to Learner Mode');
            }}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeftRight className="w-4 h-4 text-emerald-300" />
            <span>Switch to Learner Mode</span>
          </button>
        </div>
      </div>

      {postedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Your tutor offerings and free blocks have been successfully posted! Learners can now find and book you.</span>
        </div>
      )}

      {/* "MY POSTS" / LIVE PREVIEW */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                My Active Post
              </h2>
              <p className="text-xs text-slate-500">
                Live preview of your card on the school directory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live on Search</span>
            </span>

            {onRemoveTutorProfile && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to remove your tutor post from the school directory?')) {
                    onRemoveTutorProfile();
                    onNotify('Your tutor offerings have been removed from the directory.');
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 cursor-pointer transition-colors"
                title="Remove your tutor post"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Post</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Post Card */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900/10 bg-slate-50/60 max-w-2xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">
                  {currentUser.name}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  {currentUser.gradYear}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentUser.email}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {Array.from(new Set(profile.subjects.map((s) => s.gradeScore || 7))).map((g) => (
                <span key={g} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  Grade {g} Tutor
                </span>
              ))}
            </div>
          </div>

          {/* Offered subjects */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Subjects Offered:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.subjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      sub.level === 'HL'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sub.level}
                  </span>
                  <span>{sub.subjectName}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                    Gr {sub.gradeScore || 7}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Free blocks in card */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Available Free Blocks:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.availableBlocks.map((blockId) => {
                const b = FREE_BLOCKS.find((item) => item.id === blockId);
                if (!b) return null;
                return (
                  <span
                    key={blockId}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border ${b.bgClass} ${b.textClass} ${b.borderClass}`}
                  >
                    {b.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-slate-600">
            Capacity: <strong>Max {profile.capacity} student{profile.capacity > 1 ? 's' : ''}/session</strong>
          </div>

          {profile.notes && (
            <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200/80">
              "{profile.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Main Post Form */}
      <form onSubmit={handlePost} className="space-y-8">
        {/* 1. Free Blocks */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              1. Available Free Blocks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select all free blocks during the week when you are available to host tutoring sessions:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
            {FREE_BLOCKS.map((block) => {
              const isSelected = selectedBlocks.includes(block.id);

              return (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => toggleBlock(block.id)}
                  className={`
                    group relative flex flex-col items-center justify-center py-5 px-3 rounded-xl border-2 transition-all duration-150 cursor-pointer text-center
                    ${block.bgClass} ${block.textClass} ${block.borderClass}
                    ${isSelected 
                      ? 'ring-4 ring-offset-2 ring-slate-900 shadow-md scale-[1.03]' 
                      : 'opacity-40 hover:opacity-80'
                    }
                  `}
                >
                  {isSelected && (
                    <div
                      className={`
                        absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px]
                        ${block.id === 'white' || block.id === 'yellow'
                          ? 'bg-slate-900 text-white' 
                          : 'bg-white text-slate-900'
                        }
                      `}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <span className="text-sm font-extrabold capitalize tracking-tight">
                    {block.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Selected: <span className="font-bold text-slate-800">{selectedBlocks.length}</span> free block{selectedBlocks.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* 2. Subjects Offered (Exact Ullens IBDP sheet table + HL/SL toggle + Grade 5,6,7 selection) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              2. Subjects Offered at Ullens IBDP
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Check subjects, toggle between <strong>HL</strong> and <strong>SL</strong>, and select your achieved or predicted IB grade (IB Grades 5, 6, and 7 can tutor!):
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 w-1/4 border-r border-slate-200">GROUPS</th>
                    <th className="py-3 px-4 w-5/12 border-r border-slate-200">SUBJECTS</th>
                    <th className="py-3 px-4 w-1/6 border-r border-slate-200">LEVEL</th>
                    <th className="py-3 px-4 w-1/6">YOUR GRADE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {groups.map((grp) => {
                    const groupSubjects = ULLENS_IB_SUBJECTS.filter(
                      (s) => s.groupNumber === grp.number
                    );

                    return groupSubjects.map((sub, index) => {
                      const selection = subjectSelections[sub.id] || {
                        isSelected: false,
                        level: sub.allowedLevels[0],
                        gradeScore: 7,
                      };
                      const canToggle = sub.allowedLevels.length > 1;

                      return (
                        <tr
                          key={sub.id}
                          className={`transition-colors ${
                            selection.isSelected
                              ? 'bg-slate-50 font-semibold'
                              : 'hover:bg-slate-50/60 text-slate-700'
                          }`}
                        >
                          {index === 0 ? (
                            <td
                              rowSpan={groupSubjects.length}
                              className="py-3 px-4 font-bold text-slate-900 border-r border-slate-200 align-top bg-slate-50/50"
                            >
                              <div className="font-extrabold">Group {grp.number}</div>
                              <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                                {grp.name}
                              </div>
                            </td>
                          ) : null}

                          {/* Subject selection checkbox */}
                          <td className="py-3 px-4 border-r border-slate-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selection.isSelected}
                                onChange={() => toggleSubject(sub.id)}
                                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                              />
                              <span
                                className={`text-xs ${
                                  selection.isSelected
                                    ? 'text-slate-900 font-bold'
                                    : 'text-slate-700'
                                }`}
                              >
                                {sub.name}
                              </span>
                            </label>
                          </td>

                          {/* Level HL / SL */}
                          <td className="py-3 px-4 border-r border-slate-200">
                            {canToggle ? (
                              <button
                                type="button"
                                onClick={() => toggleLevel(sub.id, sub.allowedLevels)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                                  selection.level === 'HL'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-emerald-600 text-white shadow-xs'
                                }`}
                                title="Click to toggle between HL and SL"
                              >
                                <span>{selection.level}</span>
                                <span className="text-[9px] opacity-75 font-normal">⇄</span>
                              </button>
                            ) : (
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block ${
                                  sub.allowedLevels[0] === 'HL'
                                    ? 'bg-indigo-100 text-indigo-900'
                                    : 'bg-emerald-100 text-emerald-900'
                                }`}
                              >
                                {sub.allowedLevels[0]}
                              </span>
                            )}
                          </td>

                          {/* Grade Score: 7, 6, or 5 */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              {[7, 6, 5].map((g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => setSubjectGrade(sub.id, g)}
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                    selection.gradeScore === g
                                      ? 'bg-slate-900 text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                  title={`Grade ${g}`}
                                >
                                  {g}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Capacity (with Increments) & Description */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            3. Capacity & Notes for Learners
          </h2>

          <div className="space-y-4 max-w-xl">
            {/* Incremental Capacity Stepper */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Session Capacity (Students per block)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrementCapacity}
                  disabled={capacity <= 1}
                  className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-slate-700 transition-all cursor-pointer"
                  title="Decrease capacity"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center px-6 py-2 border border-slate-200 rounded-xl font-bold text-base text-slate-900 bg-white min-w-[120px]">
                  {capacity} {capacity === 1 ? 'Student' : 'Students'}
                </div>

                <button
                  type="button"
                  onClick={handleIncrementCapacity}
                  className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition-all cursor-pointer"
                  title="Increase capacity"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <span className="text-xs text-slate-500">
                  {capacity === 1 ? '(1-on-1 tutoring)' : `(Small study group up to ${capacity})`}
                </span>
              </div>
            </div>

            {/* Description / Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Description / Notes for Classes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explain what topics you specialize in, past paper walkthroughs, IA tips..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* POST BUTTON */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Posting updates your live listings across the school network immediately.
            </span>

            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Post Offerings</span>
            </button>
          </div>
        </div>
      </form>

      {/* DUAL BOOKINGS SECTION: Incoming Sessions & My Learner Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Sessions Booked with Me (As Tutor) with Confirmation & Live Timer */}
        <div id="tutor-incoming-sessions" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Sessions Booked with Me ({incomingAppointments.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm incoming requests and activate session timer when meeting
              </p>
            </div>
          </div>

          {incomingAppointments.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No learner bookings yet.
            </div>
          ) : (
            <div className="space-y-4">
              {incomingAppointments.map((apt) => {
                const block = FREE_BLOCKS.find((b) => b.id === apt.blockId);

                return (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                      apt.status === 'in_progress'
                        ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-400/30'
                        : apt.status === 'pending'
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          {apt.learnerName}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          {apt.learnerEmail}
                        </div>
                      </div>

                      {/* Status Badges */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          apt.status === 'in_progress'
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : apt.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'completed'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {apt.status === 'in_progress' ? 'Session In Progress' : apt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-800 font-bold">
                        {apt.level}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {apt.subjectName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Date: <strong className="text-slate-700">{apt.date}</strong></span>
                      {block && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${block.bgClass} ${block.textClass}`}
                        >
                          {block.name}
                        </span>
                      )}
                    </div>

                    {apt.notes && (
                      <div className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                        <strong>Topic: </strong> {apt.notes}
                      </div>
                    )}

                    {/* LIVE TIMER DISPLAY if in_progress */}
                    {apt.status === 'in_progress' && apt.startedAt && (
                      <div className="pt-1">
                        <SessionTimer startedAt={apt.startedAt} />
                      </div>
                    )}

                    {/* COMPLETED DURATION if completed */}
                    {apt.status === 'completed' && apt.durationSeconds !== undefined && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium bg-slate-100 p-2 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Logged Session Duration: <strong>{Math.floor(apt.durationSeconds / 60)} mins {apt.durationSeconds % 60}s</strong></span>
                      </div>
                    )}

                    {/* ACTION CONTROLS */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/50">
                      <div className="text-[10px] text-slate-400">
                        ID: {apt.id}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* 1. Pending: Tutor can confirm or decline */}
                        {apt.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                onConfirmAppointment(apt.id);
                                onNotify(`Confirmed tutoring session with ${apt.learnerName}!`);
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm Booking</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onRemoveAppointment(apt.id);
                                onNotify('Declined booking request.');
                              }}
                              className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {/* 2. Confirmed: Tutor can Start Session with Timer */}
                        {apt.status === 'confirmed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                onStartSession(apt.id);
                                onNotify('Session timer started!');
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                              <span>Start Session & Timer</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onRemoveAppointment(apt.id);
                                onNotify('Booking request removed.');
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                              title="Cancel / Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {/* 3. In Progress: Tutor can End Session */}
                        {apt.status === 'in_progress' && (
                          <button
                            type="button"
                            onClick={() => {
                              onEndSession(apt.id);
                              onNotify('Session ended and duration recorded!');
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <Square className="w-3.5 h-3.5 fill-white" />
                            <span>End Session & Save Duration</span>
                          </button>
                        )}

                        {/* 4. Completed or Cancelled: Can remove from list */}
                        {(apt.status === 'completed' || apt.status === 'cancelled') && (
                          <button
                            type="button"
                            onClick={() => {
                              onRemoveAppointment(apt.id);
                              onNotify('Removed booking record.');
                            }}
                            className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove from list</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. My Bookings with Other Tutors (As Learner) - with Remove Option */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>My Bookings with Other Tutors ({myBookedAppointments.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sessions you scheduled to learn from peer tutors
              </p>
            </div>
          </div>

          {myBookedAppointments.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              You haven't booked any tutoring sessions with other tutors yet.
            </div>
          ) : (
            <div className="space-y-3">
              {myBookedAppointments.map((apt) => {
                const block = FREE_BLOCKS.find((b) => b.id === apt.blockId);

                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          Tutor: {apt.tutorName}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          {apt.tutorEmail}
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          apt.status === 'in_progress'
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'completed'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {apt.status === 'in_progress' ? 'Session In Progress' : apt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-800 font-bold">
                        {apt.level}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {apt.subjectName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Date: <strong className="text-slate-700">{apt.date}</strong></span>
                      {block && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${block.bgClass} ${block.textClass}`}
                        >
                          {block.name}
                        </span>
                      )}
                    </div>

                    {apt.durationSeconds !== undefined && apt.status === 'completed' && (
                      <div className="text-[11px] text-slate-600 bg-slate-100 p-2 rounded-lg">
                        Session Length: {Math.floor(apt.durationSeconds / 60)} mins
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          onRemoveAppointment(apt.id);
                          onNotify('Removed booking request.');
                        }}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove / Cancel Request</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
