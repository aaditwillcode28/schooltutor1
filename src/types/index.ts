export type FreeBlockId =
  | 'berry-red'
  | 'red'
  | 'blue'
  | 'yellow'
  | 'orange'
  | 'green'
  | 'white'
  | 'pink'
  | 'lunch-block'
  | 'mpb-block';

export interface FreeBlock {
  id: FreeBlockId;
  name: string;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  hexCode: string;
  badgeHex: string;
}

export type SubjectLevel = 'HL' | 'SL';

export interface IBSubject {
  id: string;
  name: string;
  groupNumber: number;
  groupName: string;
  allowedLevels: SubjectLevel[];
}

export interface TutorSubjectOffering {
  subjectId: string;
  subjectName: string;
  groupName: string;
  level: SubjectLevel;
  gradeScore: number; // 5, 6, or 7
  scoreBadge?: string; // e.g. "Grade 7", "Grade 6", "Grade 5"
}

export interface TutorProfile {
  subjects: TutorSubjectOffering[];
  availableBlocks: FreeBlockId[];
  capacity: number; // e.g. 1, 2, 3, 4, ...
  notes: string;
  publishedAt?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  gradYear: string; // e.g. "2027 (IBDP Y-2)", "2028 (IBDP Y-1)"
  email: string;
  currentMode: 'learner' | 'tutor';
  isTutorRegistered: boolean;
  tutorProfile?: TutorProfile;
  createdAt: string;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Appointment {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  subjectId: string;
  subjectName: string;
  level: SubjectLevel;
  blockId: FreeBlockId;
  blockName: string;
  date: string;
  notes: string;
  status: AppointmentStatus;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  type:
    | 'account_created'
    | 'tutor_posted'
    | 'booking_requested'
    | 'booking_confirmed'
    | 'booking_cancelled'
    | 'session_started'
    | 'session_completed';
  actorName: string;
  message: string;
  details?: string;
}
