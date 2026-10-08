import React, { useState } from 'react';
import { UserAccount } from '../types/index.ts';
import { GraduationCap, ArrowRight, UserPlus, Users, Sparkles, BookOpen } from 'lucide-react';

interface LoginPortalProps {
  onLoginOrRegister: (user: UserAccount, isNewAccount: boolean) => void;
  existingAccounts: UserAccount[];
  currentUser: UserAccount | null;
  onClose?: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginOrRegister,
  existingAccounts,
  currentUser,
  onClose,
}) => {
  // Fresh empty form inputs so the user doesn't see prefilled names
  const [name, setName] = useState('');
  const [gradYear, setGradYear] = useState('2027 (IBDP Y-2)');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'learner' | 'tutor'>('learner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Check if account already exists by email
    const existing = existingAccounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      const updatedUser: UserAccount = {
        ...existing,
        name: name.trim(),
        gradYear,
        currentMode: role,
        isTutorRegistered: role === 'tutor' ? true : existing.isTutorRegistered,
      };
      onLoginOrRegister(updatedUser, false);
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      gradYear,
      email: email.trim(),
      currentMode: role,
      isTutorRegistered: role === 'tutor',
      tutorProfile:
        role === 'tutor'
          ? {
              subjects: [
                {
                  subjectId: 'math-aa',
                  subjectName: 'Mathematics: Analysis and Approaches',
                  groupName: 'Mathematics',
                  level: 'HL',
                  gradeScore: 7,
                  scoreBadge: 'IB Grade 7',
                },
              ],
              availableBlocks: ['berry-red', 'blue', 'green', 'lunch-block'],
              capacity: 2,
              notes: 'Peer tutoring on core IB concepts, past paper walkthroughs and IA guidance.',
            }
          : undefined,
      createdAt: new Date().toISOString(),
    };

    onLoginOrRegister(newUser, true);
  };

  const handleSelectExisting = (acc: UserAccount) => {
    onLoginOrRegister(acc, false);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-7 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Student Access Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Ullens School IBDP Peer Tutoring Network • IBDP Y-1 & Y-2
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Students with IB Grade 5, 6, or 7 can tutor</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              ✕ Close
            </button>
          )}
        </div>

        {/* Form Body: Name, Graduation Year, Email, and Role */}
        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          {/* 1. Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>

          {/* 2. Graduation Year (Strictly Y-1 and Y-2) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              IBDP Cohort / Class
            </label>
            <select
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            >
              <option value="2027 (IBDP Y-2)">Class of 2027 (IBDP Y-2)</option>
              <option value="2028 (IBDP Y-1)">Class of 2028 (IBDP Y-1)</option>
            </select>
          </div>

          {/* 3. Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              School Email
            </label>
            <input
              type="email"
              required
              placeholder="student@ullens.edu.np"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>

          {/* 4. Role: Learner or Tutor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('learner')}
                className={`py-3 px-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  role === 'learner'
                    ? 'border-slate-900 bg-slate-50 font-bold text-slate-900 ring-1 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Learner</span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Find peer tutors
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('tutor')}
                className={`py-3 px-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  role === 'tutor'
                    ? 'border-slate-900 bg-slate-50 font-bold text-slate-900 ring-1 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Peer Tutor</span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  IB Grades 5, 6, or 7
                </div>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 text-center">
              * Tutors can switch to Learner Mode anytime to get help in other subjects.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enter Peer Tutor Network</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Switch with Existing Pre-Configured Accounts */}
        <div className="p-5 bg-slate-50 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Quick sign-in to demo IBDP student accounts (Class of 2027 & 2028):
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {existingAccounts
              .filter(
                (acc) =>
                  Boolean(acc) &&
                  (String(acc.gradYear || '').includes('2027') || String(acc.gradYear || '').includes('2028')) &&
                  !String(acc.name || '').toLowerCase().includes('diya')
              )
              .map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectExisting(acc)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    currentUser && acc.id === currentUser.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {acc.name || 'Student'} ({acc.gradYear || 'IBDP'})
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
