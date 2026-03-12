import { useState } from 'react';
import { useFavorites } from './hooks/useFavorites';
import { useGameQueue } from './hooks/useGameQueue';
import { Game } from './components/Game/Game';
import { Favorites } from './components/Favorites/Favorites';
import { Nav } from './components/Nav/Nav';
import './App.css';

export default function App() {
  const [view, setView] = useState('game');
  const { favorites, toggleFavorite } = useFavorites();
  const { currentPokemon, advance, reset } = useGameQueue();
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleNewGame = () => {
    reset();
    setScore({ correct: 0, total: 0 });
  };

  return (
    <>
      <Nav
        view={view}
        onViewChange={setView}
        favoritesCount={favorites.size}
      />
      <div hidden={view !== 'game'}>
        <Game
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          currentPokemon={currentPokemon}
          onAdvance={advance}
          score={score}
          onScoreUpdate={setScore}
          onNewGame={handleNewGame}
        />
      </div>
      {view === 'favorites' && (
        <Favorites favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
    </>
  );
}
