import './Nav.css';

export function Nav({ view, onViewChange, favoritesCount }) {
  return (
    <nav className="nav">
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
    </nav>
  );
}
