import React, { useCallback, useEffect, useMemo, useState } from 'react';
import rawInteractions from './data/interactions.json';
import { CategoryFilter, InteractionCard, UserState } from './types';
import {
  clearUserState,
  loadTheme,
  loadUserState,
  saveTheme,
  saveUserState,
  ThemeMode,
} from './utils/storage';
import {
  buildPresentedOptions,
  isCardMastered,
  isCardMissed,
  PresentedOption,
  recordAnswer,
  selectNextCard,
} from './utils/scheduler';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { DrillCard } from './components/DrillCard';
import { InfoModal } from './components/InfoModal';

const ALL_CARDS = rawInteractions as InteractionCard[];

function getPoolForCategory(cat: CategoryFilter): InteractionCard[] {
  return cat === 'all' ? ALL_CARDS : ALL_CARDS.filter((c) => c.category === cat);
}

interface ActiveCardState {
  card: InteractionCard | null;
  options: PresentedOption[];
  selectedIndex: number | null;
}

function makeActiveCard(
  pool: InteractionCard[],
  state: UserState,
  excludeId?: string | null
): ActiveCardState {
  const next = selectNextCard(pool, state, excludeId);
  return {
    card: next,
    options: next ? buildPresentedOptions(next) : [],
    selectedIndex: null,
  };
}

export const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(() => loadUserState());
  const [theme, setTheme] = useState<ThemeMode>(() => loadTheme());
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [reviewMissedOnly, setReviewMissedOnly] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const [active, setActive] = useState<ActiveCardState>(() =>
    makeActiveCard(ALL_CARDS, loadUserState(), null)
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveUserState(userState);
  }, [userState]);

  const categoryPool = useMemo(() => getPoolForCategory(category), [category]);

  const missedCards = useMemo(
    () => categoryPool.filter((c) => isCardMissed(userState.cards[c.id])),
    [categoryPool, userState.cards]
  );

  const handleSelectCategory = useCallback(
    (nextCategory: CategoryFilter) => {
      setCategory(nextCategory);
      setReviewMissedOnly(false);
      setActive(makeActiveCard(getPoolForCategory(nextCategory), userState, null));
    },
    [userState]
  );

  const handleToggleReviewMissed = useCallback(() => {
    if (reviewMissedOnly) {
      setReviewMissedOnly(false);
      setActive(makeActiveCard(categoryPool, userState, active.card?.id));
    } else if (missedCards.length > 0) {
      setReviewMissedOnly(true);
      setActive(makeActiveCard(missedCards, userState, null));
    }
  }, [active.card?.id, categoryPool, missedCards, reviewMissedOnly, userState]);

  const handleChoose = useCallback(
    (presentedIdx: number) => {
      if (!active.card || active.selectedIndex !== null) return;
      const option = active.options[presentedIdx];
      if (!option) return;

      const isCorrect = option.originalIndex === active.card.correctIndex;
      setActive((prev) => ({ ...prev, selectedIndex: presentedIdx }));
      setUserState((prev) => recordAnswer(prev, active.card!.id, isCorrect));
    },
    [active]
  );

  const handleNext = useCallback(() => {
    if (!active.card || active.selectedIndex === null) return;

    if (reviewMissedOnly) {
      if (missedCards.length > 0) {
        setActive(makeActiveCard(missedCards, userState, active.card.id));
      } else {
        setReviewMissedOnly(false);
        setActive(makeActiveCard(categoryPool, userState, active.card.id));
      }
      return;
    }

    setActive(makeActiveCard(categoryPool, userState, active.card.id));
  }, [active.card, active.selectedIndex, categoryPool, missedCards, reviewMissedOnly, userState]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleResetProgress = useCallback(() => {
    const fresh = clearUserState();
    setUserState(fresh);
    setReviewMissedOnly(false);
    setActive(makeActiveCard(categoryPool, fresh, null));
  }, [categoryPool]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '?') {
        e.preventDefault();
        setInfoOpen((prev) => !prev);
        return;
      }

      if (infoOpen) return;

      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleToggleTheme();
        return;
      }

      if ((e.key === 'r' || e.key === 'R') && (missedCards.length > 0 || reviewMissedOnly)) {
        e.preventDefault();
        handleToggleReviewMissed();
        return;
      }

      if (active.selectedIndex === null) {
        const num = Number(e.key);
        if (num >= 1 && num <= active.options.length) {
          e.preventDefault();
          handleChoose(num - 1);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    active.options.length,
    active.selectedIndex,
    handleChoose,
    handleNext,
    handleToggleReviewMissed,
    handleToggleTheme,
    infoOpen,
    missedCards.length,
    reviewMissedOnly,
  ]);

  const totalMastered = useMemo(
    () => ALL_CARDS.filter((c) => isCardMastered(userState.cards[c.id])).length,
    [userState.cards]
  );

  return (
    <div className="app-shell">
      <Header
        masteredCount={totalMastered}
        totalCount={ALL_CARDS.length}
        currentStreak={userState.currentStreak}
        missedCount={missedCards.length}
        reviewMissedOnly={reviewMissedOnly}
        onToggleReviewMissed={handleToggleReviewMissed}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenInfo={() => setInfoOpen(true)}
      />

      <main className="main-container">
        <CategoryBar
          active={category}
          cards={ALL_CARDS}
          userState={userState}
          onSelect={handleSelectCategory}
        />

        {reviewMissedOnly && (
          <div className="mode-banner">
            <span>
              {missedCards.length > 0
                ? `Reviewing missed cards (${missedCards.length} remaining)`
                : 'All missed cards cleared — press Enter to return to deck'}
            </span>
            <button
              type="button"
              className="link-btn"
              onClick={handleToggleReviewMissed}
            >
              Exit review
            </button>
          </div>
        )}

        {active.card && (
          <DrillCard
            card={active.card}
            presentedOptions={active.options}
            selectedOptionIndex={active.selectedIndex}
            cardProgress={userState.cards[active.card.id]}
            onChoose={handleChoose}
            onNext={handleNext}
          />
        )}

        <footer className="keyboard-hint">
          <span>
            <kbd>1</kbd>–<kbd>{active.options.length || 3}</kbd> answer
          </span>
          <span className="dot">·</span>
          <span>
            <kbd>Enter</kbd> / <kbd>Space</kbd> next
          </span>
          <span className="dot">·</span>
          <span>
            <kbd>?</kbd> stats &amp; sources
          </span>
        </footer>
      </main>

      <InfoModal
        isOpen={infoOpen}
        totalCards={ALL_CARDS.length}
        userState={userState}
        onClose={() => setInfoOpen(false)}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
};

export default App;
