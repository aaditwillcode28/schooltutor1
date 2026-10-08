import React from 'react';
import { UserAccount } from '../types/index.ts';
import { ArrowLeftRight, LogIn, LogOut, User, Calendar } from 'lucide-react';

interface HeaderProps {
  currentUser: UserAccount | null;
  activeView: 'browse' | 'appointments' | 'tutor-station' | 'syllabus' | 'portal' | 'admin';
  setActiveView: (view: 'browse' | 'appointments' | 'tutor-station' | 'syllabus' | 'portal' | 'admin') => void;
  onToggleMode: () => void;
  onOpenPortal: () => void;
  onSignOut: () => void;
  appointmentCount: number;
  liveSessionCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeView,
  setActiveView,
  onToggleMode,
  onOpenPortal,
  onSignOut,
  appointmentCount,
  liveSessionCount = 0,
}) => {
  const isTutorMode = currentUser?.currentMode === 'tutor';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView(isTutorMode ? 'tutor-station' : 'browse')}
            className="text-left cursor-pointer group flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              U
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                Ullens IBDP Tutors
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                IBDP Y-1 & Y-2
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean & Professional, Admin moved to bottom footer) */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveView('browse')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeView === 'browse' ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Find Peer Tutors
          </button>

          {/* Tutor Station (visible in tutor mode) */}
          {isTutorMode && (
            <button
              type="button"
              onClick={() => setActiveView('tutor-station')}
              className={`transition-colors hover:text-slate-900 cursor-pointer ${
                activeView === 'tutor-station' ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Tutor Station
            </button>
          )}

          {/* My Appointments (Always accessible in BOTH Tutor Mode and Learner Mode) */}
          <button
            type="button"
            onClick={() => setActiveView('appointments')}
            className={`transition-colors hover:text-slate-900 flex items-center gap-1.5 cursor-pointer ${
              activeView === 'appointments' ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2' : ''
            }`}
            title={isTutorMode ? 'View students scheduled with you & session schedule' : 'View your scheduled tutoring sessions'}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>My Appointments</span>
            {appointmentCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                {appointmentCount}
              </span>
            )}
            {liveSessionCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-0.5" title="Live session running" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('syllabus')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeView === 'syllabus' ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Subject Offerings
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <>
              {/* Dual Mode Switcher Button */}
              <button
                type="button"
                onClick={onToggleMode}
                title={
                  isTutorMode
                    ? 'Switch to Learner Mode to book sessions in other subjects'
                    : 'Switch to Tutor Mode to offer sessions in subjects you got a 7 in'
                }
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer
                  ${isTutorMode
                    ? 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }
                `}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Mode: {isTutorMode ? 'Tutor' : 'Learner'}</span>
              </button>

              {/* Account Dropdown / Switch */}
              <button
                type="button"
                onClick={onOpenPortal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                title="Switch account in Student Portal"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">
                  {currentUser.name.split(' ')[0]} ({currentUser.gradYear.replace(' (IBDP Y-2)', '').replace(' (IBDP Y-1)', '')})
                </span>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenPortal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 bg-slate-50 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveView('browse')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            activeView === 'browse' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          Find Tutors
        </button>

        {isTutorMode && (
          <button
            type="button"
            onClick={() => setActiveView('tutor-station')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              activeView === 'tutor-station' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            Tutor Station
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveView('appointments')}
          className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
            activeView === 'appointments' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <span>Appointments</span>
          {appointmentCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center">
              {appointmentCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveView('syllabus')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            activeView === 'syllabus' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          Subjects
        </button>

        <button
          type="button"
          onClick={onOpenPortal}
          className="px-2.5 py-1 rounded-lg shrink-0 text-slate-500"
        >
          {currentUser ? 'Portal' : 'Sign In'}
        </button>
      </div>
    </header>
  );
};
