import './Nav.css';

export function Nav({
  view,
  onViewChange,
  favoritesCount,
  score,
  onNewGame,
  kidsMode,
  onToggleKidsMode,
  confirmReset,
  onRequestReset,
  onCancelReset,
  onShowShortcuts,
  onShowSettings,
}) {
  return (
    <>
      <nav className="nav">
        <div className="nav__tabs">
          <button
            type="button"
            className={`nav__tab ${view === 'game' ? 'nav__tab--active' : ''}`}
            onClick={() => onViewChange('game')}
            aria-current={view === 'game' ? 'page' : undefined}
          >
            Play
          </button>
          <button
            type="button"
            className={`nav__tab ${view === 'favorites' ? 'nav__tab--active' : ''}`}
            onClick={() => onViewChange('favorites')}
            aria-current={view === 'favorites' ? 'page' : undefined}
          >
            Favorites {favoritesCount > 0 && <span className="nav__badge">♥ {favoritesCount}</span>}
          </button>
          <button
            type="button"
            className={`nav__tab ${view === 'pokedex' ? 'nav__tab--active' : ''}`}
            onClick={() => onViewChange('pokedex')}
            aria-current={view === 'pokedex' ? 'page' : undefined}
          >
            Pokédex
          </button>
        </div>
        {view === 'game' && (
          <div className="nav__score">
            <button
              type="button"
              className={`nav__kids-mode ${kidsMode ? 'nav__kids-mode--active' : ''}`}
              onClick={onToggleKidsMode}
              aria-label={kidsMode ? 'Disable kids mode' : 'Enable kids mode'}
              aria-pressed={kidsMode}
            >
              🔊 Kids Mode
            </button>
            <button
              type="button"
              className="nav__settings"
              onClick={onShowSettings}
              aria-label="Settings"
              title="Settings"
            >
              ⚙
            </button>
            <button
              type="button"
              className="nav__shortcuts"
              onClick={onShowShortcuts}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              ⌨
            </button>
            <div className="nav__score-badge">
              <span className="nav__score-correct">{score.correct}</span>
              <span className="nav__score-sep">/</span>
              <span className="nav__score-total">{score.total}</span>
            </div>
            <button
              type="button"
              className="nav__new-game"
              onClick={onRequestReset}
              aria-label="New game"
            >
              ↺
            </button>
          </div>
        )}
      </nav>

      {confirmReset && (
        <div className="nav__confirm-overlay" onClick={onCancelReset}>
          <div className="nav__confirm-card" onClick={(e) => e.stopPropagation()}>
            <p className="nav__confirm-title">Start new game?</p>
            <p className="nav__confirm-sub">Your current score will be reset.</p>
            <div className="nav__confirm-btns">
              <button className="nav__confirm-cancel" onClick={onCancelReset}>
                Cancel
              </button>
              <button className="nav__confirm-ok" onClick={onNewGame}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
