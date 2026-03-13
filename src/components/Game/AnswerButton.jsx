import './AnswerButton.css';

export function AnswerButton({ pokemon, status, onClick, disabled }) {
  return (
    <button
      className={`answer-btn answer-btn--${status}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="answer-btn__name">{pokemon.name}</span>
      {status === 'pending' && (
        <span className="answer-btn__confirm">Tap again to choose!</span>
      )}
    </button>
  );
}
