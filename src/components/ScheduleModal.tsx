import React, { useState } from 'react';
import { UserAccount, FreeBlockId, Appointment, TutorSubjectOffering } from '../types/index.ts';
import { FREE_BLOCKS } from '../data/ibdpData.ts';
import { X, Calendar, CheckCircle2, Send } from 'lucide-react';

interface ScheduleModalProps {
  tutor: UserAccount | null;
  currentUser: UserAccount | null;
  selectedLearnerBlocks: FreeBlockId[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmAppointment: (newAppointment: Appointment) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  tutor,
  currentUser,
  selectedLearnerBlocks,
  isOpen,
  onClose,
  onConfirmAppointment,
}) => {
  if (!isOpen || !tutor || !tutor.tutorProfile) return null;

  const profile = tutor.tutorProfile;

  // Selected subject
  const [selectedSubject, setSelectedSubject] = useState<TutorSubjectOffering>(
    profile.subjects[0]
  );

  // Selected block
  const defaultBlock =
    profile.availableBlocks.find((b) => selectedLearnerBlocks.includes(b)) ||
    profile.availableBlocks[0];

  const [selectedBlockId, setSelectedBlockId] = useState<FreeBlockId>(defaultBlock);

  // Form fields
  const [sessionDate, setSessionDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [learnerName, setLearnerName] = useState(currentUser?.name || '');
  const [learnerEmail, setLearnerEmail] = useState(currentUser?.email || '');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAptId, setCreatedAptId] = useState('');

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerName.trim() || !learnerEmail.trim()) {
      setFormError('Please provide your name and school email to book this session.');
      return;
    }
    setFormError(null);

    const block = FREE_BLOCKS.find((b) => b.id === selectedBlockId);

    const newApt: Appointment = {
      id: `apt-${Date.now().toString().slice(-6)}`,
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorEmail: tutor.email,
      learnerId: currentUser?.id || `guest-${Date.now()}`,
      learnerName: learnerName.trim(),
      learnerEmail: learnerEmail.trim(),
      subjectId: selectedSubject.subjectId,
      subjectName: selectedSubject.subjectName,
      level: selectedSubject.level,
      blockId: selectedBlockId,
      blockName: block?.name || 'Selected Block',
      date: sessionDate,
      notes: notes.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setCreatedAptId(newApt.id);
    setIsSuccess(true);
    onConfirmAppointment(newApt);
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isSuccess ? 'Booking Request Submitted' : 'Schedule Peer Tutoring Session'}
            </h3>
            <p className="text-xs text-slate-500">
              with {tutor.name || 'Peer Tutor'} ({tutor.gradYear || 'IBDP'})
            </p>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Booking Request Sent!
              </h4>
              <p className="text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-200 rounded-full px-3 py-1 inline-block mt-1">
                Awaiting Tutor Confirmation
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Reference ID: <span className="font-mono font-bold text-slate-700">{createdAptId}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Tutor:</span>
                <span className="font-bold text-slate-800">{tutor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subject:</span>
                <span className="font-bold text-slate-800">
                  {selectedSubject.subjectName} ({selectedSubject.level})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Free Block:</span>
                <span className="font-bold text-slate-800 capitalize">
                  {FREE_BLOCKS.find((b) => b.id === selectedBlockId)?.name} Block
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-bold text-slate-800">{sessionDate}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              {tutor.name} has been notified and will confirm your request in their Tutor Station.
            </p>

            <button
              onClick={handleModalClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl animate-in fade-in">
                {formError}
              </div>
            )}

            {/* 1. Subject Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Subject & Level
              </label>
              <div className="space-y-2">
                {profile.subjects.map((sub, idx) => {
                  const isChecked =
                    selectedSubject.subjectId === sub.subjectId &&
                    selectedSubject.level === sub.level;

                  return (
                    <label
                      key={idx}
                      className={`
                        flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all
                        ${isChecked 
                          ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900' 
                          : 'border-slate-200 hover:bg-slate-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="subject"
                          checked={isChecked}
                          onChange={() => setSelectedSubject(sub)}
                          className="text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                        <span className="font-bold text-slate-900">
                          {sub.subjectName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800">
                          {sub.level}
                        </span>
                      </div>
                      <span className="text-emerald-700 font-bold text-[11px]">
                        Grade 7
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Block Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Select Free Block
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {profile.availableBlocks.map((blockId) => {
                  const block = FREE_BLOCKS.find((b) => b.id === blockId);
                  if (!block) return null;
                  const isSelected = selectedBlockId === blockId;
                  const isLearnerMutual = selectedLearnerBlocks.includes(blockId);

                  return (
                    <button
                      type="button"
                      key={blockId}
                      onClick={() => setSelectedBlockId(blockId)}
                      className={`
                        p-2.5 rounded-xl border-2 text-xs font-bold transition-all text-center cursor-pointer
                        ${block.bgClass} ${block.textClass} ${block.borderClass}
                        ${isSelected ? 'ring-2 ring-slate-900 ring-offset-2 scale-[1.02]' : 'opacity-90 hover:opacity-100'}
                      `}
                    >
                      <span>{block.name}</span>
                      {isLearnerMutual && (
                        <span className="block text-[9px] bg-white/30 px-1 rounded mt-0.5 font-bold">
                          Mutual
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Preferred Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                3. Preferred Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                />
              </div>
            </div>

            {/* 4. Learner Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddhartha Karki"
                  value={learnerName}
                  onChange={(e) => setLearnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="siddhartha@ullens.edu.np"
                  value={learnerEmail}
                  onChange={(e) => setLearnerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* 5. Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Topics or Questions to Cover
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Need assistance understanding calculus optimization and Paper 2 style questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Appointment</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
