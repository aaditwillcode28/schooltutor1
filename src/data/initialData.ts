import { UserAccount, Appointment, ActivityLogItem } from '../types/index.ts';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-aadit-thapa',
    name: 'Aadit Thapa',
    gradYear: '2027 (IBDP Y-2)',
    email: 'aadit.thapa@ullens.edu.np',
    currentMode: 'tutor',
    isTutorRegistered: true,
    tutorProfile: {
      subjects: [
        {
          subjectId: 'math-aa',
          subjectName: 'Mathematics: Analysis and Approaches',
          groupName: 'Mathematics',
          level: 'HL',
          gradeScore: 7,
          scoreBadge: 'Grade 7 (100% Mock)'
        },
        {
          subjectId: 'physics',
          subjectName: 'Physics',
          groupName: 'Sciences',
          level: 'HL',
          gradeScore: 6,
          scoreBadge: 'Grade 6 (IA 22/24)'
        }
      ],
      availableBlocks: ['berry-red', 'blue', 'green', 'white', 'lunch-block', 'mpb-block'],
      capacity: 3,
      notes: 'Focus on calculus optimization, vectors, paper 3 exploration questions, and Physics mechanics/fields. We walk through step-by-step past questions.',
      publishedAt: '2026-09-28T04:00:00Z'
    },
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'user-sneha-pradhan',
    name: 'Sneha Pradhan',
    gradYear: '2027 (IBDP Y-2)',
    email: 'sneha.pradhan@ullens.edu.np',
    currentMode: 'learner',
    isTutorRegistered: true,
    tutorProfile: {
      subjects: [
        {
          subjectId: 'economics',
          subjectName: 'Economics',
          groupName: 'Individuals and Societies',
          level: 'HL',
          gradeScore: 7,
          scoreBadge: 'Grade 7 (Predicted)'
        },
        {
          subjectId: 'business-mgmt',
          subjectName: 'Business Management',
          groupName: 'Individuals and Societies',
          level: 'SL',
          gradeScore: 6,
          scoreBadge: 'Grade 6'
        }
      ],
      availableBlocks: ['red', 'yellow', 'pink', 'orange', 'lunch-block'],
      capacity: 2,
      notes: 'Specializing in macro policy diagrams, 15-mark evaluation essays, and quantitative economic models for paper 3.',
      publishedAt: '2026-09-28T04:15:00Z'
    },
    createdAt: '2026-09-03T11:30:00Z'
  },
  {
    id: 'user-aarav-shrestha',
    name: 'Aarav Shrestha',
    gradYear: '2028 (IBDP Y-1)',
    email: 'aarav.shrestha@ullens.edu.np',
    currentMode: 'tutor',
    isTutorRegistered: true,
    tutorProfile: {
      subjects: [
        {
          subjectId: 'chemistry',
          subjectName: 'Chemistry',
          groupName: 'Sciences',
          level: 'HL',
          gradeScore: 7,
          scoreBadge: 'IB Grade 7'
        },
        {
          subjectId: 'biology',
          subjectName: 'Biology',
          groupName: 'Sciences',
          level: 'HL',
          gradeScore: 5,
          scoreBadge: 'IB Grade 5'
        }
      ],
      availableBlocks: ['berry-red', 'yellow', 'green', 'white', 'mpb-block'],
      capacity: 2,
      notes: 'Organic chemistry reaction mechanisms, energetics cycles, and DBQ data-based questions. Flashcard drills & past papers.',
      publishedAt: '2026-09-28T04:20:00Z'
    },
    createdAt: '2026-09-05T09:15:00Z'
  },
  {
    id: 'user-riya-joshi',
    name: 'Riya Joshi',
    gradYear: '2027 (IBDP Y-2)',
    email: 'riya.joshi@ullens.edu.np',
    currentMode: 'tutor',
    isTutorRegistered: true,
    tutorProfile: {
      subjects: [
        {
          subjectId: 'eng-a-lang-lit',
          subjectName: 'English A: Language and Literature',
          groupName: 'Studies in Language and Literature',
          level: 'HL',
          gradeScore: 7,
          scoreBadge: 'IB Grade 7'
        },
        {
          subjectId: 'psychology',
          subjectName: 'Psychology',
          groupName: 'Individuals and Societies',
          level: 'SL',
          gradeScore: 6,
          scoreBadge: 'IB Grade 6'
        }
      ],
      availableBlocks: ['red', 'blue', 'orange', 'pink', 'lunch-block'],
      capacity: 2,
      notes: 'Paper 1 guided textual analysis structuring, comparative essay templates for Paper 2, and psychological research study breakdowns.',
      publishedAt: '2026-09-28T04:25:00Z'
    },
    createdAt: '2026-09-10T14:00:00Z'
  },
  {
    id: 'user-kiran-adhikari',
    name: 'Kiran Adhikari',
    gradYear: '2028 (IBDP Y-1)',
    email: 'kiran.adhikari@ullens.edu.np',
    currentMode: 'tutor',
    isTutorRegistered: true,
    tutorProfile: {
      subjects: [
        {
          subjectId: 'computer-sciences',
          subjectName: 'Computer Sciences',
          groupName: 'Sciences',
          level: 'HL',
          gradeScore: 6,
          scoreBadge: 'IB Grade 6'
        },
        {
          subjectId: 'math-ai',
          subjectName: 'Mathematics: Applications and Interpretation',
          groupName: 'Mathematics',
          level: 'SL',
          gradeScore: 5,
          scoreBadge: 'IB Grade 5'
        }
      ],
      availableBlocks: ['blue', 'yellow', 'green', 'pink'],
      capacity: 3,
      notes: 'Paper 1 algorithmic thinking, Java/pseudocode Paper 2 section B, and GDC tricks for Math AI regressions.',
      publishedAt: '2026-09-28T04:30:00Z'
    },
    createdAt: '2026-09-12T16:20:00Z'
  },
  {
    id: 'user-siddhartha-karki',
    name: 'Siddhartha Karki',
    gradYear: '2027 (IBDP Y-2)',
    email: 'siddhartha.karki@ullens.edu.np',
    currentMode: 'learner',
    isTutorRegistered: false,
    createdAt: '2026-09-15T08:45:00Z'
  },
  {
    id: 'user-pooja-sharma',
    name: 'Pooja Sharma',
    gradYear: '2028 (IBDP Y-1)',
    email: 'pooja.sharma@ullens.edu.np',
    currentMode: 'tutor',
    isTutorRegistered: true,
    tutorProfile: {
      subjects: [
        {
          subjectId: 'visual-arts',
          subjectName: 'Visual Arts',
          groupName: 'The Arts',
          level: 'HL',
          gradeScore: 7,
          scoreBadge: 'IB Grade 7'
        },
        {
          subjectId: 'french-ab-initio',
          subjectName: 'French ab initio',
          groupName: 'Language acquisition',
          level: 'SL',
          gradeScore: 6,
          scoreBadge: 'IB Grade 6'
        }
      ],
      availableBlocks: ['blue', 'orange', 'pink', 'mpb-block', 'lunch-block'],
      capacity: 2,
      notes: 'Comparative study and process portfolio structuring for Visual Arts; French grammar drills and speaking mocks.',
      publishedAt: '2026-09-28T05:00:00Z'
    },
    createdAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'user-rohan-bajra',
    name: 'Rohan Bajracharya',
    gradYear: '2028 (IBDP Y-1)',
    email: 'rohan.bajracharya@ullens.edu.np',
    currentMode: 'tutor',
    isTutorRegistered: true,
    tutorProfile: {
      subjects: [
        {
          subjectId: 'ess-group-3',
          subjectName: 'Environmental Systems and Societies',
          groupName: 'Individuals and Societies',
          level: 'SL',
          gradeScore: 6,
          scoreBadge: 'IB Grade 6'
        },
        {
          subjectId: 'business-mgmt',
          subjectName: 'Business Management',
          groupName: 'Individuals and Societies',
          level: 'HL',
          gradeScore: 5,
          scoreBadge: 'IB Grade 5'
        }
      ],
      availableBlocks: ['red', 'yellow', 'white', 'lunch-block'],
      capacity: 2,
      notes: 'ESS case study breakdowns, systems diagrams, and 10-mark essay evaluation templates.',
      publishedAt: '2026-09-28T05:15:00Z'
    },
    createdAt: '2026-09-20T11:00:00Z'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    tutorId: 'user-aadit-thapa',
    tutorName: 'Aadit Thapa',
    tutorEmail: 'aadit.thapa@ullens.edu.np',
    learnerId: 'user-siddhartha-karki',
    learnerName: 'Siddhartha Karki',
    learnerEmail: 'siddhartha.karki@ullens.edu.np',
    subjectId: 'math-aa',
    subjectName: 'Mathematics: Analysis and Approaches',
    level: 'HL',
    blockId: 'berry-red',
    blockName: 'Berry Red',
    date: '2026-10-05',
    notes: 'Need help with implicit differentiation and related rates past paper questions.',
    status: 'pending',
    createdAt: '2026-09-27T10:00:00Z'
  },
  {
    id: 'apt-102',
    tutorId: 'user-riya-joshi',
    tutorName: 'Riya Joshi',
    tutorEmail: 'riya.joshi@ullens.edu.np',
    learnerId: 'user-aadit-thapa',
    learnerName: 'Aadit Thapa',
    learnerEmail: 'aadit.thapa@ullens.edu.np',
    subjectId: 'eng-a-lang-lit',
    subjectName: 'English A: Language and Literature',
    level: 'HL',
    blockId: 'blue',
    blockName: 'Blue',
    date: '2026-10-06',
    notes: 'Preparing for Paper 1 unseen commentary. Need help organizing thesis and stylistic devices.',
    status: 'confirmed',
    createdAt: '2026-09-27T11:20:00Z'
  },
  {
    id: 'apt-103',
    tutorId: 'user-aarav-shrestha',
    tutorName: 'Aarav Shrestha',
    tutorEmail: 'aarav.shrestha@ullens.edu.np',
    learnerId: 'user-sneha-pradhan',
    learnerName: 'Sneha Pradhan',
    learnerEmail: 'sneha.pradhan@ullens.edu.np',
    subjectId: 'chemistry',
    subjectName: 'Chemistry',
    level: 'HL',
    blockId: 'yellow',
    blockName: 'Yellow',
    date: '2026-09-25',
    notes: 'Thermochemistry cycles and Hess law calculations.',
    status: 'completed',
    startedAt: '2026-09-25T14:00:00Z',
    endedAt: '2026-09-25T14:48:00Z',
    durationSeconds: 2880, // 48 minutes
    createdAt: '2026-09-24T12:00:00Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-28T04:30:00Z',
    type: 'tutor_posted',
    actorName: 'Aadit Thapa',
    message: 'Aadit Thapa published tutor offerings for Math AA (HL, Grade 7) & Physics (HL, Grade 6)',
    details: 'Free Blocks: Berry Red, Blue, Green, White'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-27T11:20:00Z',
    type: 'booking_confirmed',
    actorName: 'Riya Joshi',
    message: 'Riya Joshi confirmed session with Aadit Thapa for English A (HL)',
    details: 'Slot: Blue Block'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-27T10:00:00Z',
    type: 'booking_requested',
    actorName: 'Siddhartha Karki',
    message: 'Siddhartha Karki requested Math AA session with Aadit Thapa (Pending confirmation)',
    details: 'Slot: Berry Red Block'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-25T14:48:00Z',
    type: 'session_completed',
    actorName: 'Aarav Shrestha',
    message: 'Aarav Shrestha completed 48-minute Chemistry (HL) tutoring session with Sneha Pradhan',
    details: 'Duration: 48m'
  }
];
