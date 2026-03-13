import { useState, useEffect } from 'react';
import { POKEMON, getSpriteUrl } from '../../data/pokemon';
import { PokedexDetail } from '../Pokedex/PokedexDetail';
import './Favorites.css';

function FavTile({ pokemon, onRemove, onClick }) {
  return (
    <div className="fav-tile" onClick={() => onClick(pokemon)}>
      <button
        className="fav-tile__remove"
        onClick={(e) => { e.stopPropagation(); onRemove(pokemon.id); }}
        aria-label={`Remove ${pokemon.name} from favorites`}
      >
        ❤️
      </button>
      <span className="fav-tile__num">#{String(pokemon.id).padStart(3, '0')}</span>
      <img
        src={getSpriteUrl(pokemon.id)}
        alt={pokemon.name}
        className="fav-tile__img"
        loading="lazy"
      />
      <span className="fav-tile__name">{pokemon.name}</span>
    </div>
  );
}

export function Favorites({ favorites, onToggleFavorite }) {
  const [selected, setSelected] = useState(null);
  const favPokemon = POKEMON.filter((p) => favorites.has(p.id));

  useEffect(() => {
    if (selected && !favorites.has(selected.id)) {
      setSelected(null);
    }
  }, [favorites, selected]);

  if (favPokemon.length === 0) {
    return (
      <div className="favorites favorites--empty">
        <p>No favorites yet!</p>
        <p>Tap ❤️ during the game to save your favorites.</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2 className="favorites__title">My Favorites</h2>
      <div className="favorites__grid">
        {favPokemon.map((pokemon) => (
          <FavTile
            key={pokemon.id}
            pokemon={pokemon}
            onRemove={onToggleFavorite}
            onClick={setSelected}
          />
        ))}
      </div>
      {selected && (
        <PokedexDetail
          pokemon={selected}
          onClose={() => setSelected(null)}
          pokemonList={favPokemon}
          onNavigate={setSelected}
        />
      )}
    </div>
  );
}
