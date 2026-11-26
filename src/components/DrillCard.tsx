import React from 'react';
import { CATEGORY_LABELS, CardProgress, InteractionCard } from '../types';
import { PresentedOption } from '../utils/scheduler';

interface DrillCardProps {
  card: InteractionCard;
  presentedOptions: PresentedOption[];
  selectedOptionIndex: number | null; // index within presentedOptions
  cardProgress?: CardProgress;
  onChoose: (presentedIdx: number) => void;
  onNext: () => void;
}

function buildReportIssueUrl(card: InteractionCard): string {
  const params = new URLSearchParams({
    title: `Card issue: ${card.id} (${card.prompt})`,
    body: [
      `**Card ID:** \`${card.id}\``,
      `**Prompt:** ${card.prompt}`,
      `**Question:** ${card.question}`,
      '',
      '**What needs correction or clarification?**',
      '',
    ].join('\n'),
  });
  return `https://github.com/fechva/pharmdrill/issues/new?${params.toString()}`;
}

export const DrillCard: React.FC<DrillCardProps> = ({
  card,
  presentedOptions,
  selectedOptionIndex,
  cardProgress,
  onChoose,
  onNext,
}) => {
  const isAnswered = selectedOptionIndex !== null;
  const chosenOption = isAnswered ? presentedOptions[selectedOptionIndex] : null;
  const isCorrect = chosenOption ? chosenOption.originalIndex === card.correctIndex : false;
  const isReviewCard = Boolean(cardProgress && cardProgress.lastResult === 'wrong');

  return (
    <section className="drill-card" aria-live="polite">
      <div className="card-prompt-row">
        <h2 className="card-prompt">{card.prompt}</h2>
        {!isAnswered && isReviewCard && (
          <span className="requeue-badge">Review</span>
        )}
      </div>
      <p className="card-question">{card.question}</p>

      <div className="options-list" role="group" aria-label="Answer choices">
        {presentedOptions.map((opt, idx) => {
          const isThisCorrect = opt.originalIndex === card.correctIndex;
          const isThisSelected = selectedOptionIndex === idx;

          let stateClass = '';
          if (isAnswered) {
            if (isThisCorrect) {
              stateClass = 'correct';
            } else if (isThisSelected && !isThisCorrect) {
              stateClass = 'wrong';
            } else {
              stateClass = 'muted';
            }
          }

          return (
            <button
              key={`${card.id}-${opt.originalIndex}`}
              type="button"
              disabled={isAnswered}
              className={`option-btn ${stateClass}`}
              onClick={() => onChoose(idx)}
            >
              <span className="key-badge" aria-hidden="true">
                {idx + 1}
              </span>
              <span className="option-text">{opt.label}</span>
              {isAnswered && isThisCorrect && (
                <span className="result-mark" aria-label="Correct">
                  ✓
                </span>
              )}
              {isAnswered && isThisSelected && !isThisCorrect && (
                <span className="result-mark" aria-label="Incorrect">
                  ✕
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`feedback-panel ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
          <div className="feedback-header">
            <span className="feedback-verdict">
              {isCorrect ? 'Correct' : 'Incorrect'}
            </span>
            {!isCorrect && (
              <span className="requeue-note">Re-queued for review</span>
            )}
            <a
              href={buildReportIssueUrl(card)}
              target="_blank"
              rel="noopener noreferrer"
              className="report-link"
            >
              Report issue ↗
            </a>
          </div>

          <div className="feedback-meta">
            <span className="category-badge">{CATEGORY_LABELS[card.category]}</span>
            {card.context && <span className="context-label">{card.context}</span>}
          </div>

          <dl className="feedback-details">
            <div className="feedback-row">
              <dt>Mechanism</dt>
              <dd>{card.mechanism}</dd>
            </div>
            <div className="feedback-row">
              <dt>Clinical pearl</dt>
              <dd>{card.pearl}</dd>
            </div>
          </dl>

          <div className="feedback-footer">
            <div className="tag-row">
              {card.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
              {card.source.url ? (
                <a
                  href={card.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-chip"
                >
                  {card.source.label} ↗
                </a>
              ) : (
                <span className="source-chip">{card.source.label}</span>
              )}
            </div>

            <button type="button" className="next-btn" onClick={onNext}>
              <span>Next</span>
              <kbd>Enter</kbd>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
