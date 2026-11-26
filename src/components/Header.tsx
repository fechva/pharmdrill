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
          <svg width="24" height="24" viewBox="0 0 32 32">
            <path
              d="M16 2.5 L27.5 6.2 V15.8 C27.5 22.8 22.4 27.3 16 29.5 C9.6 27.3 4.5 22.8 4.5 15.8 V6.2 Z"
              fill={theme === 'dark' ? '#f4f4f5' : '#ffffff'}
            />
            <path
              d="M16 2.5 L4.5 6.2 V15.8 C4.5 22.8 9.6 27.3 16 29.5 Z"
              fill="#111827"
            />
            <path
              d="M16 11.8 H11.7 A3.2 3.2 0 0 0 11.7 18.2 H16 Z"
              fill={theme === 'dark' ? '#f4f4f5' : '#ffffff'}
            />
            <path
              d="M16 11.8 H20.3 A3.2 3.2 0 0 1 20.3 18.2 H16 Z"
              fill="#111827"
            />
            <path
              d="M16 2.5 L27.5 6.2 V15.8 C27.5 22.8 22.4 27.3 16 29.5 C9.6 27.3 4.5 22.8 4.5 15.8 V6.2 Z"
              fill="none"
              stroke={theme === 'dark' ? '#e4e4e7' : '#111827'}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
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
