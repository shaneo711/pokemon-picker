import { useState } from 'react';
import { POKEMON, getSpriteUrl } from '../../data/pokemon';
import { PokedexDetail } from '../Pokedex/PokedexDetail';
import './Favourites.css';

function FavTile({ pokemon, onRemove, onClick }) {
  return (
    <div className="fav-tile" onClick={() => onClick(pokemon)}>
      <button
        className="fav-tile__remove"
        onClick={(e) => { e.stopPropagation(); onRemove(pokemon.id); }}
        aria-label={`Remove ${pokemon.name} from favourites`}
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

export function Favourites({ favourites, onToggleFavourite }) {
  const [selected, setSelected] = useState(null);
  const favPokemon = POKEMON.filter((p) => favourites.has(p.id));

  function removeFavourite(id) {
    onToggleFavourite(id);
    if (selected?.id === id) {
      setSelected(null);
    }
  }

  if (favPokemon.length === 0) {
    return (
      <div className="favourites favourites--empty">
        <p>No favourites yet!</p>
        <p>Tap ❤️ during the game to save your favourites.</p>
      </div>
    );
  }

  return (
    <div className="favourites">
      <h2 className="favourites__title">My Favourites</h2>
      <div className="favourites__grid">
        {favPokemon.map((pokemon) => (
          <FavTile
            key={pokemon.id}
            pokemon={pokemon}
            onRemove={removeFavourite}
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
