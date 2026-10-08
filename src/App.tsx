import React, { useState, useEffect, useMemo } from 'react';
import { UserAccount, FreeBlockId, SubjectLevel, Appointment, ActivityLogItem } from './types/index.ts';
import { INITIAL_USERS, INITIAL_APPOINTMENTS, INITIAL_ACTIVITY_LOGS } from './data/initialData.ts';
import { Header } from './components/Header.tsx';
import { FreeBlockSelector } from './components/FreeBlockSelector.tsx';
import { SearchAndFilters } from './components/SearchAndFilters.tsx';
import { TutorCard } from './components/TutorCard.tsx';
import { ScheduleModal } from './components/ScheduleModal.tsx';
import { TutorStation } from './components/TutorStation.tsx';
import { LearnerAppointments } from './components/LearnerAppointments.tsx';
import { SyllabusDirectory } from './components/SyllabusDirectory.tsx';
import { LoginPortal } from './components/LoginPortal.tsx';
import { AdminActivity } from './components/AdminActivity.tsx';
import { Award, Clock, CheckCircle2, X, Play, Square, Activity } from 'lucide-react';

const STORAGE_KEYS = {
  ACCOUNTS: 'ullens_ibdp_accounts_v5',
  CURRENT_USER_ID: 'ullens_ibdp_cur_user_v5',
  APPOINTMENTS: 'ullens_ibdp_apts_v5',
  SELECTED_BLOCKS: 'ullens_ibdp_blocks_v5',
  ACTIVITY_LOGS: 'ullens_ibdp_logs_v5',
};

// Strict sanitizer: strips out any legacy middle school accounts or Diya Bhattarai
function sanitizeAccounts(list: unknown): UserAccount[] {
  if (!Array.isArray(list) || list.length === 0) return INITIAL_USERS;
  const filtered = list.filter((u): u is UserAccount => {
    if (!u || typeof u !== 'object') return false;
    const name = String(u.name || '');
    const grad = String(u.gradYear || '');
    if (!name.trim()) return false;
    const nameLower = name.toLowerCase();
    if (nameLower.includes('diya') || (u.email && String(u.email).toLowerCase().includes('diya'))) {
      return false;
    }
    const gradLower = grad.toLowerCase();
    if (
      gradLower.includes('grade 5') ||
      gradLower.includes('grade 6') ||
      gradLower.includes('grade 7') ||
      gradLower.includes('grade 8') ||
      gradLower.includes('middle')
    ) {
      return false;
    }
    // Strictly must be Class of 2027 (Y-2) or Class of 2028 (Y-1)
    return grad.includes('2027') || grad.includes('2028');
  });
  return filtered.length > 0 ? filtered : INITIAL_USERS;
}

export default function App() {
  // One-time cleanup of legacy localStorage keys
  useEffect(() => {
    try {
      const legacyKeys = [
        'ullens_tutor_accounts_v1',
        'ullens_tutor_accounts_v2',
        'ullens_tutor_accounts_v3',
        'ullens_tutor_accounts_v4',
        'ullens_tutor_cur_user_v4',
        'ullens_tutor_apts_v4',
        'ullens_tutor_logs_v4',
        'ullens_tutor_blocks_v4',
      ];
      legacyKeys.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Accounts state
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        const clean = sanitizeAccounts(parsed);
        if (clean.length > 0) return clean;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  // Current user state (defaults to Aadit Thapa)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (stored && stored !== 'null' && stored !== 'undefined' && !stored.toLowerCase().includes('diya')) {
        return stored;
      }
    } catch (e) {
      console.error(e);
    }
    return 'user-aadit-thapa';
  });

  const currentUser = useMemo(() => {
    if (!currentUserId) return accounts[0] || null;
    const found = accounts.find((a) => a.id === currentUserId);
    return found || accounts[0] || null;
  }, [accounts, currentUserId]);

  // Appointments state (scrubbing any legacy appointments with Diya)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(
            (a) =>
              a &&
              !String(a.learnerName || '').toLowerCase().includes('diya') &&
              !String(a.tutorName || '').toLowerCase().includes('diya')
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPOINTMENTS;
  });

  // Activity logs state (scrubbing any logs with Diya)
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(
            (l) =>
              l &&
              !String(l.actorName || '').toLowerCase().includes('diya') &&
              !String(l.message || '').toLowerCase().includes('diya')
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Selected free blocks (defaulting to 2 demo blocks)
  const [selectedBlocks, setSelectedBlocks] = useState<FreeBlockId[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_BLOCKS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return ['berry-red', 'blue'];
  });

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All Groups');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | SubjectLevel>('ALL');

  // Navigation view
  const [activeView, setActiveView] = useState<
    'browse' | 'appointments' | 'tutor-station' | 'syllabus' | 'portal' | 'admin'
  >('browse');

  // Booking modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [targetTutor, setTargetTutor] = useState<UserAccount | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
    } catch (e) {
      console.error(e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SELECTED_BLOCKS,
        JSON.stringify(selectedBlocks)
      );
    } catch (e) {
      console.error(e);
    }
  }, [selectedBlocks]);

  // Helper to add log
  const logEvent = (
    type: ActivityLogItem['type'],
    actorName: string,
    message: string,
    details?: string
  ) => {
    const newLog: ActivityLogItem = {
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      type,
      actorName,
      message,
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Free block handlers
  const handleToggleBlock = (blockId: FreeBlockId) => {
    setSelectedBlocks((prev) =>
      prev.includes(blockId)
        ? prev.filter((b) => b !== blockId)
        : [...prev, blockId]
    );
  };

  const handleClearBlocks = () => {
    setSelectedBlocks([]);
  };

  // Toggle Mode (Learner <-> Tutor)
  const handleToggleMode = () => {
    if (!currentUser) {
      setActiveView('portal');
      notify('Please sign in or create an account to switch modes.');
      return;
    }

    const nextMode: 'learner' | 'tutor' =
      currentUser.currentMode === 'tutor' ? 'learner' : 'tutor';

    const updated: UserAccount[] = accounts.map((acc) => {
      if (acc.id === currentUser.id) {
        return {
          ...acc,
          currentMode: nextMode,
          isTutorRegistered: nextMode === 'tutor' ? true : acc.isTutorRegistered,
          tutorProfile:
            nextMode === 'tutor' && !acc.tutorProfile
              ? {
                  subjects: [
                    {
                      subjectId: 'math-aa',
                      subjectName: 'Mathematics: Analysis and Approaches',
                      groupName: 'Mathematics',
                      level: 'HL',
                      gradeScore: 7,
                      scoreBadge: 'Grade 7',
                    },
                  ],
                  availableBlocks: ['berry-red', 'blue', 'green'],
                  capacity: 2,
                  notes: 'Scored 7; focusing on core IB concepts, past paper practice and IA guidance.',
                }
              : acc.tutorProfile,
        };
      }
      return acc;
    });

    setAccounts(updated);
    notify(`Switched to ${nextMode === 'tutor' ? 'Tutor' : 'Learner'} Mode`);

    if (nextMode === 'tutor') {
      setActiveView('tutor-station');
    } else {
      setActiveView('browse');
    }
  };

  // Sign out
  const handleSignOut = () => {
    setCurrentUserId(null);
    notify('Successfully signed out.');
    setActiveView('browse');
  };

  // Login Portal handler
  const handleLoginOrRegister = (user: UserAccount, isNewAccount: boolean) => {
    const exists = accounts.some((a) => a.id === user.id);
    if (exists) {
      setAccounts((prev) => prev.map((a) => (a.id === user.id ? user : a)));
    } else {
      setAccounts((prev) => [user, ...prev]);
    }
    setCurrentUserId(user.id);

    if (isNewAccount) {
      logEvent('account_created', user.name, `${user.name} created an account as ${user.currentMode} (${user.gradYear})`);
      notify(`Account created successfully! Welcome, ${user.name}.`);
    } else {
      notify(`Signed in as ${user.name} (${user.currentMode === 'tutor' ? 'Tutor' : 'Learner'}).`);
    }

    if (user.currentMode === 'tutor') {
      setActiveView('tutor-station');
    } else {
      setActiveView('browse');
    }
  };

  // Update tutor profile
  const handleUpdateTutorProfile = (
    updatedProfile: NonNullable<UserAccount['tutorProfile']>
  ) => {
    if (!currentUser) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentUser.id
          ? {
              ...acc,
              isTutorRegistered: true,
              tutorProfile: updatedProfile,
            }
          : acc
      )
    );
    logEvent(
      'tutor_posted',
      currentUser.name,
      `${currentUser.name} published updated tutor offerings for ${updatedProfile.subjects.length} subject(s)`,
      `Capacity: ${updatedProfile.capacity} • Blocks: ${updatedProfile.availableBlocks.join(', ')}`
    );
  };

  // Remove / unpublish tutor profile
  const handleRemoveTutorProfile = () => {
    if (!currentUser) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentUser.id
          ? {
              ...acc,
              isTutorRegistered: false,
              tutorProfile: undefined,
            }
          : acc
      )
    );
    logEvent(
      'tutor_posted',
      currentUser.name,
      `${currentUser.name} unpublished their tutor post from the network`
    );
    notify('Tutor post successfully removed.');
  };

  // Appointment handlers
  const handleBookAppointment = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
    logEvent(
      'booking_requested',
      newAppointment.learnerName,
      `${newAppointment.learnerName} requested session with ${newAppointment.tutorName} for ${newAppointment.subjectName}`,
      `Block: ${newAppointment.blockName} • Status: Pending Confirmation`
    );
    notify(`Booking request sent to ${newAppointment.tutorName}! Awaiting tutor confirmation.`);
  };

  // Tutor confirms student booking request
  const handleConfirmStudentRequest = (aptId: string) => {
    const apt = appointments.find((a) => a.id === aptId);
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'confirmed' } : a))
    );
    if (apt) {
      logEvent(
        'booking_confirmed',
        apt.tutorName,
        `${apt.tutorName} confirmed booking request from ${apt.learnerName} for ${apt.subjectName}`,
        `Block: ${apt.blockName}`
      );
      notify(`Session with ${apt.learnerName} successfully confirmed!`);
    }
  };

  // Tutor starts session & timer
  const handleStartSession = (aptId: string) => {
    const apt = appointments.find((a) => a.id === aptId);
    const startedAt = new Date().toISOString();
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId ? { ...a, status: 'in_progress', startedAt } : a
      )
    );
    if (apt) {
      logEvent(
        'session_started',
        apt.tutorName,
        `${apt.tutorName} started tutoring session with ${apt.learnerName} (${apt.subjectName})`,
        `Timer activated at ${new Date(startedAt).toLocaleTimeString()}`
      );
      notify('Tutoring session started! Live timer is now recording duration.');
    }
  };

  // Tutor ends session & saves duration
  const handleEndSession = (aptId: string) => {
    const apt = appointments.find((a) => a.id === aptId);
    if (!apt) return;

    const endedAt = new Date().toISOString();
    const startMs = apt.startedAt ? new Date(apt.startedAt).getTime() : Date.now();
    const durationSeconds = Math.max(1, Math.floor((Date.now() - startMs) / 1000));

    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const formattedDuration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId
          ? {
              ...a,
              status: 'completed',
              endedAt,
              durationSeconds,
            }
          : a
      )
    );

    logEvent(
      'session_completed',
      apt.tutorName,
      `${apt.tutorName} completed session with ${apt.learnerName} (${apt.subjectName})`,
      `Tracked Duration: ${formattedDuration}`
    );

    notify(`Session ended! Recorded duration: ${formattedDuration}. Saved to activity logs.`);
  };

  // Remove or cancel appointment
  const handleRemoveAppointment = (aptId: string) => {
    const apt = appointments.find((a) => a.id === aptId);
    setAppointments((prev) => prev.filter((a) => a.id !== aptId));
    if (apt) {
      logEvent(
        'booking_cancelled',
        currentUser?.name || 'User',
        `Booking request for ${apt.subjectName} (${apt.learnerName} & ${apt.tutorName}) was removed`,
        `Slot: ${apt.blockName}`
      );
    }
    notify('Booking request removed.');
  };

  const handleOpenBooking = (tutor: UserAccount) => {
    setTargetTutor(tutor);
    setIsScheduleModalOpen(true);
  };

  // Filter tutors (strictly Class of 2027 Y-2 and Class of 2028 Y-1 IBDP students)
  const registeredTutors = useMemo(() => {
    if (!Array.isArray(accounts)) return [];
    return accounts.filter(
      (u) =>
        Boolean(u) &&
        Boolean(u.isTutorRegistered) &&
        Boolean(u.tutorProfile) &&
        Array.isArray(u.tutorProfile?.subjects) &&
        (u.tutorProfile?.subjects?.length || 0) > 0 &&
        (String(u.gradYear || '').includes('2027') || String(u.gradYear || '').includes('2028')) &&
        !String(u.name || '').toLowerCase().includes('diya')
    );
  }, [accounts]);

  const filteredTutors = useMemo(() => {
    return registeredTutors.filter((tutor) => {
      const profile = tutor.tutorProfile;
      if (!profile || !Array.isArray(profile.subjects)) return false;

      // 1. Free block matching
      if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
        const availableBlocks = Array.isArray(profile.availableBlocks) ? profile.availableBlocks : [];
        const hasMutualBlock = availableBlocks.some((b) =>
          selectedBlocks.includes(b)
        );
        if (!hasMutualBlock) return false;
      }

      // 2. Group filter
      if (selectedGroup !== 'All Groups') {
        const groupMatch = profile.subjects.some(
          (s) =>
            s &&
            (s.groupName === selectedGroup ||
              selectedGroup.includes(s.groupName || '') ||
              String(s.groupName || '').toLowerCase().includes(selectedGroup.toLowerCase()))
        );
        if (!groupMatch) return false;
      }

      // 3. Level filter
      if (selectedLevel !== 'ALL') {
        const levelMatch = profile.subjects.some((s) => s && s.level === selectedLevel);
        if (!levelMatch) return false;
      }

      // 4. Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = String(tutor.name || '').toLowerCase().includes(q);
        const matchesNotes = String(profile.notes || '').toLowerCase().includes(q);
        const matchesGrad = String(tutor.gradYear || '').toLowerCase().includes(q);
        const matchesSubjects = profile.subjects.some(
          (s) =>
            s &&
            (String(s.subjectName || '').toLowerCase().includes(q) ||
              String(s.groupName || '').toLowerCase().includes(q))
        );
        if (!matchesName && !matchesNotes && !matchesSubjects && !matchesGrad) return false;
      }

      return true;
    });
  }, [registeredTutors, selectedBlocks, selectedGroup, selectedLevel, searchQuery]);

  const activeAppointmentCount = useMemo(() => {
    if (!currentUser) return 0;
    if (currentUser.currentMode === 'tutor') {
      return appointments.filter(
        (a) =>
          a.tutorId === currentUser.id &&
          (a.status === 'confirmed' || a.status === 'pending' || a.status === 'in_progress')
      ).length;
    }
    return appointments.filter(
      (a) =>
        a.learnerId === currentUser.id &&
        (a.status === 'confirmed' || a.status === 'pending' || a.status === 'in_progress')
    ).length;
  }, [appointments, currentUser]);

  const activeLiveSession = useMemo(() => {
    return appointments.find((a) => a.status === 'in_progress') || null;
  }, [appointments]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white relative">
      {/* Top Banner Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Persistent Live Session Banner (if any session timer is active) */}
      {activeLiveSession && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-3xl truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
            <span>
              <strong>Active Session in Progress:</strong> {activeLiveSession.subjectName} ({activeLiveSession.level}) — Tutor: {activeLiveSession.tutorName} with {activeLiveSession.learnerName}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView(currentUser?.currentMode === 'tutor' ? 'appointments' : 'appointments')}
              className="px-2.5 py-1 bg-white text-emerald-800 rounded-md text-[11px] font-bold hover:bg-emerald-50 cursor-pointer"
            >
              View Timer
            </button>
            <button
              onClick={() => handleEndSession(activeLiveSession.id)}
              className="px-2.5 py-1 bg-emerald-950 text-white rounded-md text-[11px] font-bold hover:bg-black cursor-pointer"
            >
              End Session
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <Header
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onToggleMode={handleToggleMode}
        onOpenPortal={() => setActiveView('portal')}
        onSignOut={handleSignOut}
        appointmentCount={activeAppointmentCount}
        liveSessionCount={activeLiveSession ? 1 : 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* SEPARATE LOGIN PORTAL */}
        {activeView === 'portal' ? (
          <LoginPortal
            onLoginOrRegister={handleLoginOrRegister}
            existingAccounts={accounts}
            currentUser={currentUser}
            onClose={() =>
              setActiveView(currentUser?.currentMode === 'tutor' ? 'tutor-station' : 'browse')
            }
          />
        ) : activeView === 'admin' ? (
          /* ADMIN ACTIVITY MONITOR */
          <AdminActivity
            accounts={accounts}
            appointments={appointments}
            activityLogs={activityLogs}
            onConfirmAppointment={handleConfirmStudentRequest}
            onRemoveAppointment={handleRemoveAppointment}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            onBack={() => setActiveView(currentUser?.currentMode === 'tutor' ? 'tutor-station' : 'browse')}
          />
        ) : activeView === 'tutor-station' && currentUser ? (
          /* TUTOR STATION: 1) Available Free Blocks, 2) Ullens Subject Table with HL/SL, 3) Capacity & Notes, 4) Post, 5) My Posts Preview & Bookings */
          <TutorStation
            currentUser={currentUser}
            appointments={appointments}
            onUpdateTutorProfile={handleUpdateTutorProfile}
            onRemoveTutorProfile={handleRemoveTutorProfile}
            onConfirmAppointment={handleConfirmStudentRequest}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            onRemoveAppointment={handleRemoveAppointment}
            onSwitchMode={(mode) => {
              if (mode === 'learner') {
                handleToggleMode();
              }
            }}
            onNotify={notify}
          />
        ) : activeView === 'appointments' ? (
          /* MY APPOINTMENTS & TUTORING SCHEDULE */
          <LearnerAppointments
            currentUser={currentUser}
            appointments={appointments}
            onCancelAppointment={handleRemoveAppointment}
            onConfirmAppointment={handleConfirmStudentRequest}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            onBrowseTutors={() => setActiveView('browse')}
            onGoToTutorStation={() => setActiveView('tutor-station')}
          />
        ) : activeView === 'syllabus' ? (
          /* ULLENS IBDP SUBJECTS DIRECTORY */
          <SyllabusDirectory
            onSelectSubjectFilter={(subName) => {
              setSearchQuery(subName);
              setActiveView('browse');
            }}
          />
        ) : (
          /* PRIMARY BROWSE FLOW */
          <div className="space-y-6">
            {/* Banner (Clean and professional - admin link moved to bottom page) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Ullens School IBDP Peer Tutoring • Y-1 & Y-2</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
                    Find Your IBDP Peer Tutor
                  </h1>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
                    Select your free timetable blocks below to view matching peer tutors from <strong>Class of 2027 (IBDP Y-2)</strong> and <strong>Class of 2028 (IBDP Y-1)</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setActiveView('portal')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {currentUser ? 'Switch Account' : 'Sign In / Register'}
                  </button>
                  <button
                    onClick={handleToggleMode}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                  >
                    {currentUser?.currentMode === 'tutor' ? 'Go to Tutor Station' : 'I Want to Tutor'}
                  </button>
                </div>
              </div>
            </div>

            {/* 1. SELECT YOUR FREE BLOCK (Clean pure colors, with selected blocks display directly below) */}
            <FreeBlockSelector
              selectedBlocks={selectedBlocks}
              onToggleBlock={handleToggleBlock}
              onClearBlocks={handleClearBlocks}
            />

            {/* 2. SEARCH & FILTERS */}
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGroup={selectedGroup}
              onGroupChange={setSelectedGroup}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
              totalMatches={filteredTutors.length}
            />

            {/* 3. AUTOMATIC MATCHING TUTORS DISPLAY */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Matching Peer Tutors
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredTutors.length} tutor{filteredTutors.length === 1 ? '' : 's'} available
                </span>
              </div>

              {filteredTutors.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    No tutors match your selected free blocks and search
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try selecting different free blocks or clearing your search filters to see all tutors across IBDP Y-1 (Class of 2028) and Y-2 (Class of 2027).
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={handleClearBlocks}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                    >
                      Clear selected blocks
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGroup('All Groups');
                        setSelectedLevel('ALL');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTutors.map((tutor) => (
                    <TutorCard
                      key={tutor.id}
                      tutor={tutor}
                      selectedLearnerBlocks={selectedBlocks}
                      onBookAppointment={handleOpenBooking}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer with professional discreet Admin Portal link */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Ullens IBDP Peer Tutoring Network</span>
            <span>·</span>
            <span>Class of 2027 (IBDP Y-2) & Class of 2028 (IBDP Y-1)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveView('syllabus')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Subject Offerings
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('portal')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Student Portal
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('admin')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer text-[11px]"
              title="School Administration Portal"
            >
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Schedule Appointment Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        tutor={targetTutor}
        currentUser={currentUser}
        selectedLearnerBlocks={selectedBlocks}
        onConfirmAppointment={handleBookAppointment}
      />
    </div>
  );
}
