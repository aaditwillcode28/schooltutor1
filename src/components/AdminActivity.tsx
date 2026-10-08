import React, { useState, useEffect } from 'react';
import { UserAccount, Appointment, ActivityLogItem } from '../types/index.ts';
import { FREE_BLOCKS } from '../data/ibdpData.ts';
import { 
  Activity, 
  Users, 
  Clock, 
  CalendarCheck, 
  AlertCircle, 
  Download, 
  Check, 
  Trash2, 
  Play, 
  Square, 
  Filter, 
  Search,
  Sparkles,
  Award,
  GraduationCap
} from 'lucide-react';

interface AdminActivityProps {
  accounts: UserAccount[];
  appointments: Appointment[];
  activityLogs: ActivityLogItem[];
  onConfirmAppointment: (aptId: string) => void;
  onRemoveAppointment: (aptId: string) => void;
  onStartSession: (aptId: string) => void;
  onEndSession: (aptId: string) => void;
  onBack?: () => void;
}

// Live timer component for active sessions in admin monitor
function AdminLiveTimer({ startedAt }: { startedAt: string }) {
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
    <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
      <span>{hrs > 0 ? `${pad(hrs)}:` : ''}{pad(mins)}:{pad(secs)}</span>
    </span>
  );
}

export const AdminActivity: React.FC<AdminActivityProps> = ({
  accounts,
  appointments,
  activityLogs,
  onConfirmAppointment,
  onRemoveAppointment,
  onStartSession,
  onEndSession,
  onBack,
}) => {
  const [logFilter, setLogFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metrics
  const totalUsers = accounts.length;
  const totalTutors = accounts.filter((a) => a.isTutorRegistered).length;
  const totalLearners = accounts.filter((a) => !a.isTutorRegistered).length;

  const ibdpY1Tutors = accounts.filter(
    (a) => a.isTutorRegistered && a.gradYear.includes('2028')
  ).length;

  const ibdpY2Tutors = accounts.filter(
    (a) => a.isTutorRegistered && a.gradYear.includes('2027')
  ).length;

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const inProgressCount = appointments.filter((a) => a.status === 'in_progress').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  // Cumulative tutoring time
  const totalTutoringSeconds = appointments
    .filter((a) => a.status === 'completed' && a.durationSeconds)
    .reduce((acc, cur) => acc + (cur.durationSeconds || 0), 0);

  const totalTutoringHours = Math.floor(totalTutoringSeconds / 3600);
  const totalTutoringMins = Math.floor((totalTutoringSeconds % 3600) / 60);

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        apt.tutorName.toLowerCase().includes(q) ||
        apt.learnerName.toLowerCase().includes(q) ||
        apt.subjectName.toLowerCase().includes(q) ||
        apt.blockName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered Activity Logs
  const filteredLogs = activityLogs.filter((log) => {
    if (logFilter === 'all') return true;
    if (logFilter === 'sessions') {
      return log.type === 'session_started' || log.type === 'session_completed';
    }
    if (logFilter === 'bookings') {
      return (
        log.type === 'booking_requested' ||
        log.type === 'booking_confirmed' ||
        log.type === 'booking_cancelled'
      );
    }
    if (logFilter === 'tutors') {
      return log.type === 'tutor_posted' || log.type === 'account_created';
    }
    return true;
  });

  // Export JSON Report
  const handleExportData = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      school: 'Ullens School IBDP Peer Tutoring Network',
      summary: {
        totalStudents: totalUsers,
        totalTutors,
        totalLearners,
        ibdpY1Tutors,
        ibdpY2Tutors,
        totalSessionsCompleted: completedCount,
        totalTutoredSeconds: totalTutoringSeconds,
        totalTutoredFormatted: `${totalTutoringHours}h ${totalTutoringMins}m`,
      },
      appointments,
      activityLogs,
      registeredUsers: accounts.map((u) => ({
        id: u.id,
        name: u.name,
        gradYear: u.gradYear,
        email: u.email,
        currentMode: u.currentMode,
        isTutor: u.isTutorRegistered,
        subjectsCount: u.tutorProfile?.subjects.length || 0,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ullens-tutoring-activity-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Administrative Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Peer Tutoring Activity & Session Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Live telemetry, active session timers, confirmation management, and audit logs for Ullens IBDP (2028 Y-1 & 2027 Y-2).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>← Back to Tutors</span>
            </button>
          )}

          <button
            onClick={handleExportData}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
            title="Download complete activity audit report"
          >
            <Download className="w-4 h-4 text-indigo-200" />
            <span>Export School Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Registered */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Students
            </span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalUsers}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <strong>{totalTutors}</strong> tutors • <strong>{totalLearners}</strong> learners
          </div>
        </div>

        {/* Metric 2: Cohort Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              IBDP Cohorts
            </span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900">
            Y-2: {ibdpY2Tutors} • Y-1: {ibdpY1Tutors}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            2027 (Y-2) & 2028 (Y-1) Tutors
          </div>
        </div>

        {/* Metric 3: Active Live Sessions */}
        <div className={`rounded-2xl border p-4.5 shadow-xs transition-all ${
          inProgressCount > 0 
            ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Sessions
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{inProgressCount}</span>
            {inProgressCount > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Live Timers Running
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Currently underway
          </div>
        </div>

        {/* Metric 4: Pending Confirmations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Requests
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Awaiting tutor confirmation
          </div>
        </div>

        {/* Metric 5: Tracked Tutoring Hours */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tutoring Logged
            </span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalTutoringHours > 0 ? `${totalTutoringHours}h ` : ''}{totalTutoringMins}m
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {completedCount} completed sessions
          </div>
        </div>
      </div>

      {/* Main Grid: Master Sessions & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Master Sessions Manager */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-indigo-600" />
                <span>Master Session Dispatch & Monitoring</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect all bookings across the school, monitor live session timers, confirm requests, or cancel slots.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'confirmed', label: 'Confirmed' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'completed', label: 'Completed' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === pill.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search box inside table */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student, tutor, subject, or timetable block..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Sessions List */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No sessions found matching your criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((apt) => {
                const block = FREE_BLOCKS.find((b) => b.id === apt.blockId);
                const tutorUser = accounts.find((a) => a.id === apt.tutorId);

                return (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                      apt.status === 'in_progress'
                        ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20'
                        : apt.status === 'pending'
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {apt.subjectName} ({apt.level})
                          </span>
                          {block && (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${block.bgClass} ${block.textClass}`}
                            >
                              {block.name}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>
                            Learner: <strong className="text-slate-900">{apt.learnerName}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Tutor: <strong className="text-slate-900">{apt.tutorName}</strong> {tutorUser ? `(${tutorUser.gradYear})` : ''}
                          </span>
                          <span>•</span>
                          <span>
                            Date: <strong className="text-slate-900">{apt.date}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Status & Live Timer */}
                      <div className="flex items-center gap-2 shrink-0">
                        {apt.status === 'in_progress' && apt.startedAt && (
                          <AdminLiveTimer startedAt={apt.startedAt} />
                        )}

                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
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
                    </div>

                    {apt.notes && (
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                        <strong className="text-slate-700">Learner Focus Topic:</strong> {apt.notes}
                      </div>
                    )}

                    {/* Duration Display if completed */}
                    {apt.status === 'completed' && apt.durationSeconds !== undefined && (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 font-medium">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Tracked Session Length: <strong>{Math.floor(apt.durationSeconds / 60)} minutes {apt.durationSeconds % 60} seconds</strong>
                        </span>
                      </div>
                    )}

                    {/* Admin Action Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">
                        ID: {apt.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {apt.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => onConfirmAppointment(apt.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold flex items-center gap-1 cursor-pointer"
                            title="Confirm this student booking on behalf of tutor"
                          >
                            <Check className="w-3 h-3" />
                            <span>Confirm</span>
                          </button>
                        )}

                        {apt.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => onStartSession(apt.id)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold flex items-center gap-1 cursor-pointer"
                            title="Activate session timer"
                          >
                            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                            <span>Start Timer</span>
                          </button>
                        )}

                        {apt.status === 'in_progress' && (
                          <button
                            type="button"
                            onClick={() => onEndSession(apt.id)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-bold flex items-center gap-1 cursor-pointer"
                            title="End session and record duration"
                          >
                            <Square className="w-3 h-3 fill-white" />
                            <span>End & Record Duration</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onRemoveAppointment(apt.id)}
                          className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          title="Remove booking from system"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Real-Time Audit Log & Tutor Roster */}
        <div className="lg:col-span-4 space-y-6">
          {/* Audit Activity Stream */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Activity Audit</span>
              </h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'sessions', label: 'Timers' },
                { id: 'bookings', label: 'Bookings' },
                { id: 'tutors', label: 'Tutors' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setLogFilter(chip.id)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                    logFilter === chip.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Feed items */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => {
                const dateStr = new Date(log.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-600 uppercase tracking-wider">
                        {log.actorName}
                      </span>
                      <span>{dateStr}</span>
                    </div>
                    <div className="text-slate-800 font-medium">
                      {log.message}
                    </div>
                    {log.details && (
                      <div className="text-[11px] text-indigo-700 bg-indigo-50/70 px-2 py-0.5 rounded inline-block">
                        {log.details}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roster of Registered Tutors */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Active Peer Tutors Roster ({totalTutors})</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                IBDP Y-1 (2028) & Y-2 (2027) • IB Grades 5, 6, 7
              </p>
            </div>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 text-xs">
              {accounts
                .filter((a) => a.isTutorRegistered && a.tutorProfile)
                .map((tutor) => (
                  <div
                    key={tutor.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {tutor.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {tutor.gradYear}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {tutor.tutorProfile?.subjects.length} subject{tutor.tutorProfile?.subjects.length === 1 ? '' : 's'} • Capacity: {tutor.tutorProfile?.capacity}
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {tutor.tutorProfile?.subjects.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700 font-semibold"
                        >
                          {s.subjectName.split(':')[0]} ({s.level})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
