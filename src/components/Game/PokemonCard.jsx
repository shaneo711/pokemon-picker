import { useState } from 'react';
import { getArtworkUrl, getSpriteUrl } from '../../data/pokemon';
import './PokemonCard.css';

export function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const src = errored ? getSpriteUrl(pokemon.id) : getArtworkUrl(pokemon.id);

  return (
    <div className="pokemon-card">
      <button
        className={`pokemon-card__heart ${isFavorite ? 'pokemon-card__heart--active' : ''}`}
        onClick={() => onToggleFavorite(pokemon.id)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <div className="pokemon-card__image-wrap">
        {!loaded && (
          <div className="pokemon-card__spinner" aria-label="Loading">
            <img
              src="/pokeball.svg"
              alt=""
              className="pokemon-card__pokeball"
            />
          </div>
        )}
        <img
          key={pokemon.id}
          src={src}
          alt={`Pokemon silhouette`}
          className={`pokemon-card__img ${loaded ? 'pokemon-card__img--visible' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!errored) {
              setErrored(true);
              setLoaded(false);
            } else {
              setLoaded(true);
            }
          }}
        />
      </div>
    </div>
  );
}
