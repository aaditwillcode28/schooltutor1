import { FreeBlock, IBSubject } from '../types/index.ts';

export const FREE_BLOCKS: FreeBlock[] = [
  {
    id: 'berry-red',
    name: 'Berry Red',
    label: 'Berry Red',
    bgClass: 'bg-[#800020] hover:bg-[#6b001b]',
    textClass: 'text-white',
    borderClass: 'border-[#580016]',
    hexCode: '#800020',
    badgeHex: '#800020',
  },
  {
    id: 'red',
    name: 'Red',
    label: 'Red',
    bgClass: 'bg-[#dc2626] hover:bg-[#b91c1c]',
    textClass: 'text-white',
    borderClass: 'border-[#991b1b]',
    hexCode: '#dc2626',
    badgeHex: '#dc2626',
  },
  {
    id: 'blue',
    name: 'Blue',
    label: 'Blue',
    bgClass: 'bg-[#2563eb] hover:bg-[#1d4ed8]',
    textClass: 'text-white',
    borderClass: 'border-[#1e40af]',
    hexCode: '#2563eb',
    badgeHex: '#2563eb',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    label: 'Yellow',
    bgClass: 'bg-[#eab308] hover:bg-[#ca8a04]',
    textClass: 'text-amber-950 font-bold',
    borderClass: 'border-[#a16207]',
    hexCode: '#eab308',
    badgeHex: '#ca8a04',
  },
  {
    id: 'orange',
    name: 'Orange',
    label: 'Orange',
    bgClass: 'bg-[#ea580c] hover:bg-[#c2410c]',
    textClass: 'text-white',
    borderClass: 'border-[#9a3412]',
    hexCode: '#ea580c',
    badgeHex: '#ea580c',
  },
  {
    id: 'green',
    name: 'Green',
    label: 'Green',
    bgClass: 'bg-[#16a34a] hover:bg-[#15803d]',
    textClass: 'text-white',
    borderClass: 'border-[#166534]',
    hexCode: '#16a34a',
    badgeHex: '#16a34a',
  },
  {
    id: 'white',
    name: 'White',
    label: 'White',
    bgClass: 'bg-white hover:bg-slate-50',
    textClass: 'text-slate-900 font-bold',
    borderClass: 'border-slate-300 shadow-sm',
    hexCode: '#ffffff',
    badgeHex: '#64748b',
  },
  {
    id: 'pink',
    name: 'Pink',
    label: 'Pink',
    bgClass: 'bg-[#ec4899] hover:bg-[#db2777]',
    textClass: 'text-white',
    borderClass: 'border-[#be185d]',
    hexCode: '#ec4899',
    badgeHex: '#ec4899',
  },
  {
    id: 'lunch-block',
    name: 'Lunch Block',
    label: 'Lunch Block',
    bgClass: 'bg-[#0d9488] hover:bg-[#0f766e]',
    textClass: 'text-white',
    borderClass: 'border-[#115e59]',
    hexCode: '#0d9488',
    badgeHex: '#0d9488',
  },
  {
    id: 'mpb-block',
    name: 'MPB (Multi Purpose)',
    label: 'Multi Purpose Block (MPB)',
    bgClass: 'bg-[#7c3aed] hover:bg-[#6d28d9]',
    textClass: 'text-white',
    borderClass: 'border-[#5b21b6]',
    hexCode: '#7c3aed',
    badgeHex: '#7c3aed',
  }
];

export const ULLENS_IB_SUBJECTS: IBSubject[] = [
  // Group 1
  {
    id: 'eng-a-lang-lit',
    name: 'English A: Language and Literature',
    groupNumber: 1,
    groupName: 'Studies in Language and Literature',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'nepali-a-lit',
    name: 'Nepali A: Literature',
    groupNumber: 1,
    groupName: 'Studies in Language and Literature',
    allowedLevels: ['HL', 'SL']
  },

  // Group 2
  {
    id: 'eng-b',
    name: 'English B',
    groupNumber: 2,
    groupName: 'Language acquisition',
    allowedLevels: ['HL']
  },
  {
    id: 'french-ab-initio',
    name: 'French ab initio',
    groupNumber: 2,
    groupName: 'Language acquisition',
    allowedLevels: ['SL']
  },
  {
    id: 'spanish-ab-initio',
    name: 'Spanish ab initio',
    groupNumber: 2,
    groupName: 'Language acquisition',
    allowedLevels: ['SL']
  },

  // Group 3
  {
    id: 'business-mgmt',
    name: 'Business Management',
    groupNumber: 3,
    groupName: 'Individuals and Societies',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'economics',
    name: 'Economics',
    groupNumber: 3,
    groupName: 'Individuals and Societies',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'psychology',
    name: 'Psychology',
    groupNumber: 3,
    groupName: 'Individuals and Societies',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'ess-group-3',
    name: 'Environmental Systems and Societies',
    groupNumber: 3,
    groupName: 'Individuals and Societies',
    allowedLevels: ['HL', 'SL']
  },

  // Group 4
  {
    id: 'biology',
    name: 'Biology',
    groupNumber: 4,
    groupName: 'Sciences',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    groupNumber: 4,
    groupName: 'Sciences',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'computer-sciences',
    name: 'Computer Sciences',
    groupNumber: 4,
    groupName: 'Sciences',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'ess-group-4',
    name: 'Environmental Systems and Societies (Sci)',
    groupNumber: 4,
    groupName: 'Sciences',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'physics',
    name: 'Physics',
    groupNumber: 4,
    groupName: 'Sciences',
    allowedLevels: ['HL', 'SL']
  },

  // Group 5
  {
    id: 'math-aa',
    name: 'Mathematics: Analysis and Approaches',
    groupNumber: 5,
    groupName: 'Mathematics',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'math-ai',
    name: 'Mathematics: Applications and Interpretation',
    groupNumber: 5,
    groupName: 'Mathematics',
    allowedLevels: ['HL', 'SL']
  },

  // Group 6
  {
    id: 'theatre',
    name: 'Theatre',
    groupNumber: 6,
    groupName: 'The Arts',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'visual-arts',
    name: 'Visual Arts',
    groupNumber: 6,
    groupName: 'The Arts',
    allowedLevels: ['HL', 'SL']
  },
  {
    id: 'film-studies',
    name: 'Film Studies',
    groupNumber: 6,
    groupName: 'The Arts',
    allowedLevels: ['HL', 'SL']
  }
];

export const SUBJECT_GROUPS = [
  'All Groups',
  'Group 1: Studies in Language and Literature',
  'Group 2: Language acquisition',
  'Group 3: Individuals and Societies',
  'Group 4: Sciences',
  'Group 5: Mathematics',
  'Group 6: The Arts'
];

