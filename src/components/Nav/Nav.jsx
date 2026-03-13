import './Nav.css';

export function Nav({ view, onViewChange, favoritesCount, score, onNewGame }) {
  return (
    <nav className="nav">
      <div className="nav__tabs">
        <button
          className={`nav__tab ${view === 'game' ? 'nav__tab--active' : ''}`}
          onClick={() => onViewChange('game')}
        >
          Play
        </button>
        <button
          className={`nav__tab ${view === 'favorites' ? 'nav__tab--active' : ''}`}
          onClick={() => onViewChange('favorites')}
        >
          Favorites {favoritesCount > 0 && <span className="nav__badge">♥ {favoritesCount}</span>}
        </button>
      </div>
      {view === 'game' && (
        <div className="nav__score">
          <span className="nav__score-value">{score.correct} / {score.total}</span>
          <button className="nav__new-game" onClick={onNewGame} aria-label="New game">↺</button>
        </div>
      )}
    </nav>
  );
}
