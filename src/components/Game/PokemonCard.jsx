import { useState, useEffect } from 'react';
import { getArtworkUrl, getSpriteUrl } from '../../data/pokemon';
import { TYPE_COLORS, TYPE_TEXT_COLORS } from '../../data/typeColors';
import './PokemonCard.css';

function TypeBadge({ type }) {
  return (
    <span
      className="pokemon-card__type-badge"
      style={{
        background: TYPE_COLORS[type] ?? '#888',
        color: TYPE_TEXT_COLORS[type] ?? 'white',
      }}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function BackLoading() {
  return (
    <div className="pokemon-card__back-loading">
      <img src="/pokeball.svg" alt="" className="pokemon-card__pokeball" />
      <span>Loading...</span>
    </div>
  );
}

function BackContent({ pokemon, details }) {
  return (
    <div className="pokemon-card__back-content">
      <p className="pokemon-card__back-name">{pokemon.name}</p>

      <div className="pokemon-card__back-row">
        <span className="pokemon-card__back-label">Type</span>
        <div className="pokemon-card__badges">
          {details.types.map((t) => <TypeBadge key={t} type={t} />)}
        </div>
      </div>

      <div className="pokemon-card__back-row">
        <span className="pokemon-card__back-label">Weak to</span>
        <div className="pokemon-card__badges">
          {details.weaknesses.slice(0, 6).map((t) => <TypeBadge key={t} type={t} />)}
        </div>
      </div>

      <p className="pokemon-card__flavor">{details.flavorText}</p>

      <div className="pokemon-card__stats">
        <span>{(details.height / 10).toFixed(1)} m</span>
        <span>{(details.weight / 10).toFixed(1)} kg</span>
      </div>
    </div>
  );
}

export function PokemonCard({ pokemon, isFavorite, onToggleFavorite, answered, details, loading }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    setLoaded(false);
    setErrored(false);
  }, [pokemon.id]);

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

      {answered && (
        <button
          className="pokemon-card__flip-btn"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? 'Show image' : 'Show Pokédex info'}
        >
          {flipped ? '🖼️' : '📖'}
        </button>
      )}

      <div className={`pokemon-card__scene ${flipped ? 'pokemon-card__scene--flipped' : ''}`}>
        <div className="pokemon-card__face pokemon-card__face--front">
          {!loaded && (
            <div className="pokemon-card__spinner" aria-label="Loading">
              <img src="/pokeball.svg" alt="" className="pokemon-card__pokeball" />
            </div>
          )}
          <img
            key={pokemon.id}
            src={src}
            alt="Pokemon silhouette"
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

        <div className="pokemon-card__face pokemon-card__face--back">
          {loading ? <BackLoading /> : details && <BackContent pokemon={pokemon} details={details} />}
        </div>
      </div>
    </div>
  );
}
