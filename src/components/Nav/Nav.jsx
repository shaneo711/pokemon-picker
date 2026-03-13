import { useState } from 'react';
import './Nav.css';

export function Nav({ view, onViewChange, favoritesCount, score, onNewGame, kidsMode, onToggleKidsMode }) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
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
          <button
            className={`nav__tab ${view === 'pokedex' ? 'nav__tab--active' : ''}`}
            onClick={() => onViewChange('pokedex')}
          >
            Pokédex
          </button>
        </div>
        {view === 'game' && (
          <div className="nav__score">
            <button
              className={`nav__kids-mode ${kidsMode ? 'nav__kids-mode--active' : ''}`}
              onClick={onToggleKidsMode}
              aria-label={kidsMode ? 'Disable kids mode' : 'Enable kids mode'}
            >
              🔊 Kids Mode
            </button>
            <div className="nav__score-badge">
              <span className="nav__score-correct">{score.correct}</span>
              <span className="nav__score-sep">/</span>
              <span className="nav__score-total">{score.total}</span>
            </div>
            <button
              className="nav__new-game"
              onClick={() => setConfirmReset(true)}
              aria-label="New game"
            >
              ↺
            </button>
          </div>
        )}
      </nav>

      {confirmReset && (
        <div className="nav__confirm-overlay" onClick={() => setConfirmReset(false)}>
          <div className="nav__confirm-card" onClick={(e) => e.stopPropagation()}>
            <p className="nav__confirm-title">Start new game?</p>
            <p className="nav__confirm-sub">Your current score will be reset.</p>
            <div className="nav__confirm-btns">
              <button className="nav__confirm-cancel" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
              <button className="nav__confirm-ok" onClick={() => { onNewGame(); setConfirmReset(false); }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
