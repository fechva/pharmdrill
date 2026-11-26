import React from 'react';
import { ThemeMode } from '../utils/storage';

interface HeaderProps {
  masteredCount: number;
  totalCount: number;
  currentStreak: number;
  missedCount: number;
  reviewMissedOnly: boolean;
  onToggleReviewMissed: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  masteredCount,
  totalCount,
  currentStreak,
  missedCount,
  reviewMissedOnly,
  onToggleReviewMissed,
  theme,
  onToggleTheme,
  onOpenInfo,
}) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="brand-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="currentColor" />
            <g
              transform="rotate(-45 32 32)"
              fill="none"
              stroke="var(--bg)"
              strokeWidth="4.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="14" y="23" width="36" height="18" rx="9" />
              <line x1="32" y1="23" x2="32" y2="41" />
            </g>
            <circle cx="48" cy="48" r="5.5" fill={theme === 'dark' ? '#1d4ed8' : '#60a5fa'} />
          </svg>
        </span>
        <h1 className="brand-title" aria-label="DDGI — Drug–Drug & Gene Interactions">
          DDGI
        </h1>
        <span className="brand-subtitle" aria-hidden="true">
          Drug–Drug &amp; Gene Interactions
        </span>
      </div>

      <div className="topbar-right">
        <div className="stat-pill" title="Mastered cards (2 correct in a row)">
          <span className="stat-label">Mastered</span>
          <span className="stat-value">
            {masteredCount}/{totalCount}
          </span>
        </div>

        <div className="stat-pill" title="Current streak">
          <span className="stat-label">Streak</span>
          <span className="stat-value">{currentStreak}</span>
        </div>

        {(missedCount > 0 || reviewMissedOnly) && (
          <button
            type="button"
            className={`icon-btn review-btn ${reviewMissedOnly ? 'active' : ''}`}
            onClick={onToggleReviewMissed}
            title="Review missed cards only (R)"
          >
            Missed ({missedCount})
          </button>
        )}

        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
          title="Toggle dark/light mode (D)"
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={onOpenInfo}
          aria-label="Shortcuts and info"
          title="Info, sources & shortcuts (?)"
        >
          ?
        </button>
      </div>
    </header>
  );
};
