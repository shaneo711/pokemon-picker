import { useState, useCallback } from 'react';
import { useFavorites } from './hooks/useFavorites';
import { useGameQueue } from './hooks/useGameQueue';
import { useGenerations } from './hooks/useGenerations';
import { useHotkeys } from './hooks/useHotkeys';
import { Game } from './components/Game/Game';
import { Favorites } from './components/Favorites/Favorites';
import { Pokedex } from './components/Pokedex/Pokedex';
import { Nav } from './components/Nav/Nav';
import { Shortcuts } from './components/Shortcuts/Shortcuts';
import { Settings } from './components/Settings/Settings';
import './App.css';

export default function App() {
  const [view, setView] = useState('game');
  const { favorites, toggleFavorite } = useFavorites();
  const { enabledGens, toggleGen, pool } = useGenerations();
  const { currentPokemon, advance, reset } = useGameQueue(pool);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [kidsMode, setKidsMode] = useState(() => localStorage.getItem('kids-mode') === 'true');
  const [confirmReset, setConfirmReset] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleNewGame = () => {
    reset();
    setScore({ correct: 0, total: 0 });
    setConfirmReset(false);
  };

  const toggleKidsMode = () => {
    setKidsMode(prev => {
      const next = !prev;
      localStorage.setItem('kids-mode', String(next));
      return next;
    });
  };

  const overlayOpen = confirmReset || showShortcuts || showSettings;

  const handleKey = useCallback((e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'Escape') {
      setConfirmReset(false);
      setShowShortcuts(false);
      setShowSettings(false);
      return;
    }
    // The reset modal is a decision — only Escape gets out of it.
    if (confirmReset) return;

    if (e.key === '?') {
      e.preventDefault();
      setShowShortcuts(prev => !prev);
      return;
    }
    if (!showShortcuts && !showSettings && e.key.toLowerCase() === 'n') {
      setConfirmReset(true);
    }
  }, [confirmReset, showShortcuts, showSettings]);

  useHotkeys(handleKey, view === 'game');

  return (
    <>
      <Nav
        view={view}
        onViewChange={setView}
        favoritesCount={favorites.size}
        score={score}
        onNewGame={handleNewGame}
        kidsMode={kidsMode}
        onToggleKidsMode={toggleKidsMode}
        confirmReset={confirmReset}
        onRequestReset={() => setConfirmReset(true)}
        onCancelReset={() => setConfirmReset(false)}
        onShowShortcuts={() => setShowShortcuts(true)}
        onShowSettings={() => setShowSettings(true)}
      />
      <div hidden={view !== 'game'}>
        <Game
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          pool={pool}
          currentPokemon={currentPokemon}
          onAdvance={advance}
          onScoreUpdate={setScore}
          kidsMode={kidsMode}
          active={view === 'game' && !overlayOpen}
        />
      </div>
      {view === 'favorites' && (
        <Favorites favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
      {view === 'pokedex' && <Pokedex />}
      {showShortcuts && <Shortcuts onClose={() => setShowShortcuts(false)} />}
      {showSettings && (
        <Settings
          enabledGens={enabledGens}
          onToggleGen={toggleGen}
          pool={pool}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
