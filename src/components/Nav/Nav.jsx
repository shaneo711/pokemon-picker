import './Nav.css';

export function Nav({ view, onViewChange, favoritesCount, score, onNewGame, kidsMode, onToggleKidsMode }) {
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
          <button
            className={`nav__kids-mode ${kidsMode ? 'nav__kids-mode--active' : ''}`}
            onClick={onToggleKidsMode}
            aria-label={kidsMode ? 'Disable kids mode' : 'Enable kids mode'}
            title={kidsMode ? 'Kids mode on' : 'Kids mode off'}
          >
            🔊
          </button>
          <span className="nav__score-value">{score.correct} / {score.total}</span>
          <button className="nav__new-game" onClick={onNewGame} aria-label="New game">↺</button>
        </div>
      )}
    </nav>
  );
}
