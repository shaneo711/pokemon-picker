import './ScoreBar.css';

export function ScoreBar({ correct, total }) {
  return (
    <div className="score-bar">
      <span className="score-bar__label">Score</span>
      <span className="score-bar__value">
        {correct} / {total}
      </span>
    </div>
  );
}
