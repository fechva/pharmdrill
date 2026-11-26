import React from 'react';
import { CATEGORIES, CategoryFilter, InteractionCard, UserState } from '../types';
import { isCardMastered } from '../utils/scheduler';

interface CategoryBarProps {
  active: CategoryFilter;
  cards: InteractionCard[];
  userState: UserState;
  onSelect: (category: CategoryFilter) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  active,
  cards,
  userState,
  onSelect,
}) => {
  return (
    <nav className="category-bar" aria-label="Topic filters">
      {CATEGORIES.map((cat) => {
        const subset =
          cat.id === 'all' ? cards : cards.filter((c) => c.category === cat.id);
        const mastered = subset.filter((c) => isCardMastered(userState.cards[c.id])).length;
        const isActive = active === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            className={`cat-pill ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
            title={cat.description}
          >
            <span>{cat.shortLabel}</span>
            <span className="cat-count">
              {mastered}/{subset.length}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
