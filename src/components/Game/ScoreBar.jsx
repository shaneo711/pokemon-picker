import './ScoreBar.css';

export function ScoreBar({ correct, total, onNewGame }) {
  return (
    <div className="score-bar">
      <span className="score-bar__value">
        {correct} / {total}
      </span>
      <button className="score-bar__new-game" onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
}
