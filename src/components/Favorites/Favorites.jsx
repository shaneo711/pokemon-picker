import { POKEMON, getArtworkUrl, getSpriteUrl } from '../../data/pokemon';
import './Favorites.css';

function FavoriteTile({ pokemon, onToggle }) {
  return (
    <div className="fav-tile">
      <button
        className="fav-tile__remove"
        onClick={() => onToggle(pokemon.id)}
        aria-label={`Remove ${pokemon.name} from favorites`}
      >
        ❤️
      </button>
      <img
        src={getArtworkUrl(pokemon.id)}
        alt={pokemon.name}
        className="fav-tile__img"
        onError={(e) => {
          e.currentTarget.src = getSpriteUrl(pokemon.id);
        }}
      />
      <p className="fav-tile__name">{pokemon.name}</p>
    </div>
  );
}

export function Favorites({ favorites, onToggleFavorite }) {
  const favPokemon = POKEMON.filter((p) => favorites.has(p.id));

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
          <FavoriteTile
            key={pokemon.id}
            pokemon={pokemon}
            onToggle={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
