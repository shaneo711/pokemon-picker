import { useState } from 'react';
import { useFavorites } from './hooks/useFavorites';
import { Game } from './components/Game/Game';
import { Favorites } from './components/Favorites/Favorites';
import { Nav } from './components/Nav/Nav';
import './App.css';

export default function App() {
  const [view, setView] = useState('game');
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <>
      <Nav
        view={view}
        onViewChange={setView}
        favoritesCount={favorites.size}
      />
      {view === 'game' ? (
        <Game favorites={favorites} onToggleFavorite={toggleFavorite} />
      ) : (
        <Favorites favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
    </>
  );
}
