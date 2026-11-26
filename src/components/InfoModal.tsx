import React, { useEffect } from 'react';
import { UserState } from '../types';
import { isCardMastered } from '../utils/scheduler';

interface InfoModalProps {
  isOpen: boolean;
  totalCards: number;
  userState: UserState;
  onClose: () => void;
  onResetProgress: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  totalCards,
  userState,
  onClose,
  onResetProgress,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const progressValues = Object.values(userState.cards);
  const seenCount = progressValues.length;
  const masteredCount = progressValues.filter((p) => isCardMastered(p)).length;
  const totalAttempts = progressValues.reduce((acc, p) => acc + p.seen, 0);
  const totalCorrect = progressValues.reduce((acc, p) => acc + p.correct, 0);
  const accuracy =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="About DDGI">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>About DDGI</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-section">
          <h3>Progress (saved locally in browser)</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-big">{masteredCount}/{totalCards}</div>
              <div className="stat-sub">Mastered</div>
            </div>
            <div className="stat-box">
              <div className="stat-big">{seenCount}</div>
              <div className="stat-sub">Seen</div>
            </div>
            <div className="stat-box">
              <div className="stat-big">{accuracy}%</div>
              <div className="stat-sub">Accuracy</div>
            </div>
            <div className="stat-box">
              <div className="stat-big">{userState.bestStreak}</div>
              <div className="stat-sub">Best streak</div>
            </div>
          </div>
          <p className="modal-note">
            Cards are marked mastered after 2 consecutive correct answers. Missed cards automatically re-enter the queue 3–5 prompts later.
          </p>
        </div>

        <div className="modal-section">
          <h3>Keyboard shortcuts</h3>
          <ul className="shortcut-list">
            <li><kbd>1</kbd> – <kbd>4</kbd> Select answer</li>
            <li><kbd>Enter</kbd> or <kbd>Space</kbd> Next card</li>
            <li><kbd>R</kbd> Toggle missed-cards review mode</li>
            <li><kbd>D</kbd> Toggle dark / light theme</li>
            <li><kbd>?</kbd> Open / close this panel</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>References &amp; disclaimer</h3>
          <p className="modal-note">
            Curated from CPIC level A guidelines, FDA Tables of Pharmacogenetic Associations &amp; Drug Interactions, DPWG, ClinPGx, and the Flockhart CYP table.
          </p>
          <p className="modal-note">
            <strong>DDGI</strong> (Drug–Drug &amp; Gene Interactions) ·{' '}
            <a
              href="https://ddgi.app"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link"
            >
              ddgi.app ↗
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/fechva/pharmdrill"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link"
            >
              GitHub ↗
            </a>
          </p>
          <p className="modal-note disclaimer">
            For educational and active-recall training purposes only. Not clinical decision support—always verify prescribing decisions against current official drug labels and clinical guidelines.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="danger-btn"
            onClick={() => {
              if (window.confirm('Reset all local mastery and streak progress?')) {
                onResetProgress();
                onClose();
              }
            }}
          >
            Reset progress
          </button>
          <button type="button" className="next-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
