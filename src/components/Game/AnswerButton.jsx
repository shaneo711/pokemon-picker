import './AnswerButton.css';

export function AnswerButton({ pokemon, status, onClick, disabled }) {
  return (
    <button
      className={`answer-btn answer-btn--${status}`}
      onClick={onClick}
      disabled={disabled}
    >
      {pokemon.name}
    </button>
  );
}
