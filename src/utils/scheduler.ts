import { CardProgress, InteractionCard, UserState } from '../types';

export const MASTERY_STREAK = 2;

export function isCardMastered(progress?: CardProgress): boolean {
  return Boolean(progress && progress.streak >= MASTERY_STREAK);
}

export function isCardMissed(progress?: CardProgress): boolean {
  return Boolean(progress && progress.lastResult === 'wrong');
}

export function recordAnswer(
  state: UserState,
  cardId: string,
  isCorrect: boolean
): UserState {
  const nextTurn = state.turn + 1;
  const prev: CardProgress = state.cards[cardId] ?? {
    seen: 0,
    correct: 0,
    streak: 0,
    lastResult: null,
    dueAtTurn: 0,
  };

  // Missed cards re-enter the queue 3 to 5 turns later; learning cards (streak 1) after 8-12 turns
  const requeueOffset = isCorrect
    ? prev.streak + 1 >= MASTERY_STREAK
      ? 9999
      : 8 + Math.floor(Math.random() * 5)
    : 3 + Math.floor(Math.random() * 3);

  const updatedCard: CardProgress = {
    seen: prev.seen + 1,
    correct: prev.correct + (isCorrect ? 1 : 0),
    streak: isCorrect ? prev.streak + 1 : 0,
    lastResult: isCorrect ? 'correct' : 'wrong',
    dueAtTurn: nextTurn + requeueOffset,
  };

  const nextStreak = isCorrect ? state.currentStreak + 1 : 0;

  return {
    turn: nextTurn,
    sessionAnswered: state.sessionAnswered + 1,
    sessionCorrect: state.sessionCorrect + (isCorrect ? 1 : 0),
    currentStreak: nextStreak,
    bestStreak: Math.max(state.bestStreak, nextStreak),
    cards: {
      ...state.cards,
      [cardId]: updatedCard,
    },
  };
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Selects the next card using lightweight active-recall priority:
 * 1. Due missed / learning cards (dueAtTurn <= current turn)
 * 2. Unseen cards
 * 3. Any remaining non-mastered cards
 * 4. Mastered cards (maintenance review)
 * Never immediately repeats the previous card when pool.length > 1.
 */
export function selectNextCard(
  pool: InteractionCard[],
  state: UserState,
  excludeCardId?: string | null
): InteractionCard | null {
  if (pool.length === 0) return null;

  const candidates =
    pool.length > 1 && excludeCardId
      ? pool.filter((c) => c.id !== excludeCardId)
      : pool;

  // 1. Due cards (especially recently missed)
  const dueMissed = candidates.filter((c) => {
    const p = state.cards[c.id];
    return p && !isCardMastered(p) && p.dueAtTurn <= state.turn;
  });
  if (dueMissed.length > 0) {
    dueMissed.sort(
      (a, b) => (state.cards[a.id]?.dueAtTurn ?? 0) - (state.cards[b.id]?.dueAtTurn ?? 0)
    );
    return dueMissed[0];
  }

  // 2. Unseen cards
  const unseen = candidates.filter((c) => !state.cards[c.id]);
  if (unseen.length > 0) {
    return pickRandom(unseen);
  }

  // 3. Learning (not yet mastered) cards
  const learning = candidates.filter((c) => !isCardMastered(state.cards[c.id]));
  if (learning.length > 0) {
    return pickRandom(learning);
  }

  // 4. Mastered review (prefer least recently seen / lowest seen count)
  const sorted = [...candidates].sort(
    (a, b) => (state.cards[a.id]?.seen ?? 0) - (state.cards[b.id]?.seen ?? 0)
  );
  const topSlice = sorted.slice(0, Math.min(5, sorted.length));
  return pickRandom(topSlice);
}

export interface PresentedOption {
  label: string;
  originalIndex: number;
}

/**
 * Keeps fixed directional scales (effect, action, phenotype) in consistent order
 * for fast keyboard muscle memory, while shuffling drug-swap and hazard options
 * so users never memorize button positions.
 */
export function buildPresentedOptions(card: InteractionCard): PresentedOption[] {
  const mapped: PresentedOption[] = card.options.map((label, originalIndex) => ({
    label,
    originalIndex,
  }));

  if (card.promptType === 'swap' || card.promptType === 'hazard') {
    for (let i = mapped.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
    }
  }

  return mapped;
}
