import React, { useState, useEffect } from 'react';
import { Appointment, UserAccount } from '../types/index.ts';
import { FREE_BLOCKS } from '../data/ibdpData.ts';
import { Calendar, Mail, Check, Trash2, Play, Square, Clock, Users, BookOpen, ArrowRight } from 'lucide-react';

interface LearnerAppointmentsProps {
  currentUser: UserAccount | null;
  appointments: Appointment[];
  onCancelAppointment: (aptId: string) => void;
  onConfirmAppointment?: (aptId: string) => void;
  onStartSession?: (aptId: string) => void;
  onEndSession?: (aptId: string) => void;
  onBrowseTutors: () => void;
  onGoToTutorStation?: () => void;
}

// Live timer for ongoing sessions
function AppointmentLiveTimer({ startedAt }: { startedAt: string }) {
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
    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      <span>Session in Progress: {hrs > 0 ? `${pad(hrs)}:` : ''}{pad(mins)}:{pad(secs)}</span>
    </div>
  );
}

export const LearnerAppointments: React.FC<LearnerAppointmentsProps> = ({
  currentUser,
  appointments,
  onCancelAppointment,
  onConfirmAppointment,
  onStartSession,
  onEndSession,
  onBrowseTutors,
  onGoToTutorStation,
}) => {
  // 1. Sessions where current user is the TUTOR (students who scheduled with me)
  const sessionsWithMe = currentUser
    ? appointments.filter((apt) => apt.tutorId === currentUser.id)
    : [];

  // 2. Sessions where current user is the LEARNER (sessions I scheduled with other tutors)
  const sessionsIBooked = currentUser
    ? appointments.filter((apt) => apt.learnerId === currentUser.id)
    : [];

  const isTutor = currentUser?.currentMode === 'tutor' || currentUser?.isTutorRegistered;

  // Active tab state: defaults to tutor sessions if user is in tutor mode or has sessions with them
  const [activeTab, setActiveTab] = useState<'tutor-schedule' | 'learner-bookings'>(() => {
    if (currentUser?.currentMode === 'tutor' || sessionsWithMe.length > 0) {
      return 'tutor-schedule';
    }
    return 'learner-bookings';
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Appointments & Tutoring Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser
              ? `Manage student sessions scheduled with you and appointments you booked (${currentUser.name || 'Student'} • ${currentUser.gradYear || 'IBDP'})`
              : 'Sign in to view your scheduled tutoring appointments'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onGoToTutorStation && isTutor && (
            <button
              onClick={onGoToTutorStation}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Tutor Station
            </button>
          )}

          <button
            onClick={onBrowseTutors}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Find Peer Tutors
          </button>
        </div>
      </div>

      {/* Tabs for Tutors (Sessions Booked with Me vs Sessions I Booked) */}
      {(isTutor || sessionsWithMe.length > 0) && (
        <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('tutor-schedule')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tutor-schedule'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Students Scheduled with Me</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
              {sessionsWithMe.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('learner-bookings')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'learner-bookings'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Sessions I Booked (As Learner)</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
              {sessionsIBooked.length}
            </span>
          </button>
        </div>
      )}

      {/* TAB 1: SESSIONS BOOKED WITH ME (WHO HAS SCHEDULED WITH THIS TUTOR) */}
      {activeTab === 'tutor-schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Students Scheduled with You ({sessionsWithMe.length})
            </h2>
            <span className="text-xs text-slate-500">
              Confirm requests, start sessions with live timer, and review notes
            </span>
          </div>

          {sessionsWithMe.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                No students have scheduled sessions with you yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Make sure your subjects and free blocks are published in Tutor Station so learners can find and schedule appointments with you.
              </p>
              {onGoToTutorStation && (
                <button
                  onClick={onGoToTutorStation}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>Go to Tutor Station</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessionsWithMe.map((apt) => {
                const block = FREE_BLOCKS.find((b) => b.id === apt.blockId);

                return (
                  <div
                    key={apt.id}
                    className={`p-5 rounded-2xl border transition-all text-xs space-y-3 flex flex-col justify-between ${
                      apt.status === 'in_progress'
                        ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-400/20'
                        : apt.status === 'pending'
                        ? 'border-amber-300 bg-amber-50/30'
                        : 'border-slate-200 bg-slate-50/40'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Learner Info & Status Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Student Scheduled
                          </span>
                          <h4 className="text-base font-bold text-slate-900">
                            {apt.learnerName}
                          </h4>
                          <div className="text-[11px] text-slate-500">
                            {apt.learnerEmail}
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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

                      {/* Subject & Level */}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">
                          {apt.level}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {apt.subjectName}
                        </span>
                      </div>

                      {/* Timetable Slot & Date */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Timetable Slot
                          </span>
                          {block && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold mt-0.5 ${block.bgClass} ${block.textClass}`}
                            >
                              {block.name}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Scheduled Date
                          </span>
                          <span className="font-semibold text-slate-800 block mt-0.5">
                            {apt.date}
                          </span>
                        </div>
                      </div>

                      {/* Student's Note / Topic */}
                      {apt.notes && (
                        <div className="text-xs text-slate-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/80">
                          <strong className="text-amber-950 font-bold">Learner Topic: </strong>
                          {apt.notes}
                        </div>
                      )}

                      {/* LIVE TIMER if session is in progress */}
                      {apt.status === 'in_progress' && apt.startedAt && (
                        <AppointmentLiveTimer startedAt={apt.startedAt} />
                      )}

                      {/* Completed Duration */}
                      {apt.status === 'completed' && apt.durationSeconds !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 font-medium">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Logged Session Duration: <strong>{Math.floor(apt.durationSeconds / 60)} mins {apt.durationSeconds % 60}s</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for Tutor */}
                    <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                      <a
                        href={`mailto:${apt.learnerEmail}`}
                        className="hover:text-slate-900 flex items-center gap-1 text-slate-500"
                        title="Email Student"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Student</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {/* 1. Pending: Tutor can confirm or decline */}
                        {apt.status === 'pending' && onConfirmAppointment && (
                          <>
                            <button
                              type="button"
                              onClick={() => onConfirmAppointment(apt.id)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm Booking</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onCancelAppointment(apt.id)}
                              className="px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {/* 2. Confirmed: Tutor can start session & timer */}
                        {apt.status === 'confirmed' && onStartSession && (
                          <>
                            <button
                              type="button"
                              onClick={() => onStartSession(apt.id)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                              <span>Start Session & Timer</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onCancelAppointment(apt.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                              title="Cancel appointment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {/* 3. In Progress: Tutor can end session */}
                        {apt.status === 'in_progress' && onEndSession && (
                          <button
                            type="button"
                            onClick={() => onEndSession(apt.id)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <Square className="w-3.5 h-3.5 fill-white" />
                            <span>End Session & Record Duration</span>
                          </button>
                        )}

                        {/* 4. Completed or Cancelled: Remove option */}
                        {(apt.status === 'completed' || apt.status === 'cancelled') && (
                          <button
                            type="button"
                            onClick={() => onCancelAppointment(apt.id)}
                            className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
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
      )}

      {/* TAB 2: SESSIONS I BOOKED (AS LEARNER) */}
      {activeTab === 'learner-bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Sessions Scheduled with Peer Tutors ({sessionsIBooked.length})
            </h2>
            <span className="text-xs text-slate-500">
              Sessions you requested to learn from IBDP peer tutors
            </span>
          </div>

          {sessionsIBooked.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                No scheduled tutoring sessions yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your free blocks on the home page and browse peer tutors who scored a 7 in your IB subjects.
              </p>
              <button
                onClick={onBrowseTutors}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Explore Peer Tutors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessionsIBooked.map((apt) => {
                const block = FREE_BLOCKS.find((b) => b.id === apt.blockId);

                return (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Peer Tutor
                          </span>
                          <h4 className="text-base font-bold text-slate-900">
                            {apt.tutorName}
                          </h4>
                          <div className="text-[11px] text-slate-500">
                            {apt.tutorEmail}
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
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

                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">
                          {apt.level}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {apt.subjectName}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/70 mb-3">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Timetable Slot
                          </span>
                          {block && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold mt-0.5 ${block.bgClass} ${block.textClass}`}
                            >
                              {block.name}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Scheduled Date
                          </span>
                          <span className="font-semibold text-slate-800 block mt-0.5">
                            {apt.date}
                          </span>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                          <span className="font-semibold text-slate-700">Covering: </span>
                          {apt.notes}
                        </div>
                      )}

                      {apt.status === 'in_progress' && apt.startedAt && (
                        <AppointmentLiveTimer startedAt={apt.startedAt} />
                      )}

                      {apt.durationSeconds !== undefined && apt.status === 'completed' && (
                        <div className="text-[11px] text-slate-600 bg-slate-100 p-2 rounded-lg">
                          Session Duration: {Math.floor(apt.durationSeconds / 60)} mins {apt.durationSeconds % 60}s
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                      <a
                        href={`mailto:${apt.tutorEmail}`}
                        className="hover:text-slate-900 flex items-center gap-1 text-slate-500"
                        title="Email Tutor"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{apt.tutorEmail}</span>
                      </a>

                      {(apt.status === 'confirmed' || apt.status === 'pending') && (
                        <button
                          type="button"
                          onClick={() => onCancelAppointment(apt.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          Cancel / Remove Request
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
