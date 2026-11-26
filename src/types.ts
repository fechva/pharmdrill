export type Category =
  | 'ddi-pk'
  | 'pgx'
  | 'prodrug'
  | 'phenoconversion'
  | 'ddi-pd'
  | 'safe-swap';

export type CategoryFilter = 'all' | Category;

export type PromptType = 'effect' | 'action' | 'phenotype' | 'swap' | 'hazard';

export interface SourceRef {
  label: string;
  url?: string;
}

export interface InteractionCard {
  id: string;
  category: Category;
  promptType: PromptType;
  context?: string;
  prompt: string;
  question: string;
  options: string[];
  correctIndex: number;
  mechanism: string;
  pearl: string;
  tags: string[];
  source: SourceRef;
}

export interface CardProgress {
  seen: number;
  correct: number;
  streak: number;       // consecutive correct answers (>= 2 = mastered)
  lastResult: 'correct' | 'wrong' | null;
  dueAtTurn: number;    // turn index when missed card should re-enter queue
}

export interface UserState {
  turn: number;
  sessionAnswered: number;
  sessionCorrect: number;
  currentStreak: number;
  bestStreak: number;
  cards: Record<string, CardProgress>;
}

export interface CategoryMeta {
  id: CategoryFilter;
  label: string;
  shortLabel: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'all',
    label: 'All Topics',
    shortLabel: 'All',
    description: 'Full mixed deck of drug-drug and drug-gene interactions.',
  },
  {
    id: 'ddi-pk',
    label: 'CYP & Transporters',
    shortLabel: 'CYP / PK',
    description: 'CYP450 inhibition/induction, P-gp, OAT transporters, and chelation.',
  },
  {
    id: 'pgx',
    label: 'Drug-Gene (PGx)',
    shortLabel: 'PGx',
    description: 'CPIC Level A & FDA pharmacogenomic prescribing actions.',
  },
  {
    id: 'prodrug',
    label: 'Prodrug Traps',
    shortLabel: 'Prodrugs',
    description: 'Bioactivation flips where inhibition reduces efficacy and induction increases toxicity.',
  },
  {
    id: 'phenoconversion',
    label: 'Phenoconversion',
    shortLabel: 'Phenoconversion',
    description: 'How co-prescribed inhibitors or inducers override genetic metabolizer status.',
  },
  {
    id: 'ddi-pd',
    label: 'Pharmacodynamic',
    shortLabel: 'PD Hazards',
    description: 'Serotonin syndrome, QT prolongation, triple whammy AKI, hyperkalemia, and bleeding.',
  },
  {
    id: 'safe-swap',
    label: 'Safe Swap',
    shortLabel: 'Safe Swap',
    description: 'Pick the clinically safest therapeutic alternative.',
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  'ddi-pk': 'CYP / PK',
  pgx: 'Drug-Gene (PGx)',
  prodrug: 'Prodrug Trap',
  phenoconversion: 'Phenoconversion',
  'ddi-pd': 'Pharmacodynamic',
  'safe-swap': 'Safe Swap',
};
