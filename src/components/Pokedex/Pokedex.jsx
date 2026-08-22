import { useState } from 'react';
import { GENERATIONS, POKEMON, getSpriteUrl } from '../../data/pokemon';
import pokemonDetails from '../../data/pokemonDetails.json';
import { TYPE_COLORS } from '../../data/typeColors';
import { filterPokemon } from '../../utils/filterPokemon';
import { PokedexDetail } from './PokedexDetail';
import './Pokedex.css';

const TYPES = Object.keys(TYPE_COLORS);

function formatType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function PokedexTile({ pokemon, isFavorite, onClick }) {
  const details = pokemonDetails[pokemon.id];
  const typeLabel = details.types.map(formatType).join(' / ');

  return (
    <button
      className="pdex-tile"
      style={{ '--tile-accent': TYPE_COLORS[details.types[0]] }}
      onClick={() => onClick(pokemon)}
    >
      <span className="pdex-tile__meta">
        <span className="pdex-tile__num">#{String(pokemon.id).padStart(3, '0')}</span>
        {isFavorite && <span className="pdex-tile__favorite" aria-label="Favorite">♥</span>}
      </span>
      <img
        src={getSpriteUrl(pokemon.id)}
        alt={pokemon.name}
        className="pdex-tile__img"
        loading="lazy"
      />
      <span className="pdex-tile__name">{pokemon.name}</span>
      <span className="pdex-tile__types" aria-label={`Types: ${typeLabel}`}>
        {details.types.map((pokemonType) => (
          <span
            key={pokemonType}
            className="pdex-tile__type-dot"
            style={{ backgroundColor: TYPE_COLORS[pokemonType] }}
            title={formatType(pokemonType)}
            aria-hidden="true"
          />
        ))}
      </span>
    </button>
  );
}

const MIN_SIZE = 100;
const MAX_SIZE = 260;
const STEP = 40;

export function Pokedex({ favorites }) {
  const [selected, setSelected] = useState(null);
  const [tileSize, setTileSize] = useState(MIN_SIZE);
  const [search, setSearch] = useState('');
  const [generation, setGeneration] = useState('all');
  const [type, setType] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredPokemon = filterPokemon(POKEMON, pokemonDetails, favorites, {
    search,
    generation,
    type,
    favoritesOnly,
  });

  const filtersActive = search.trim()
    || generation !== 'all'
    || type !== 'all'
    || favoritesOnly;

  function clearFilters() {
    setSearch('');
    setGeneration('all');
    setType('all');
    setFavoritesOnly(false);
  }

  return (
    <div className="pdex">
      <div className="pdex__console">
        <div className="pdex__controls">
          <div className="pdex__field pdex__field--search">
            <label className="pdex__label" htmlFor="pokedex-search">Find a Pokémon</label>
            <span className="pdex__search-wrap">
              <span className="pdex__search-icon"><SearchIcon /></span>
              <input
                id="pokedex-search"
                className="pdex__search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or number"
                autoComplete="off"
              />
              {search && (
                <button
                  type="button"
                  className="pdex__search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </span>
          </div>

          <label className="pdex__field">
            <span className="pdex__label">Generation</span>
            <select
              className="pdex__select"
              value={generation}
              onChange={(event) => setGeneration(event.target.value)}
            >
              <option value="all">All generations</option>
              {GENERATIONS.map((gen) => (
                <option key={gen.id} value={gen.id}>{gen.label} · {gen.region}</option>
              ))}
            </select>
          </label>

          <label className="pdex__field">
            <span className="pdex__label">Type</span>
            <select
              className="pdex__select"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="all">All types</option>
              {TYPES.map((pokemonType) => (
                <option key={pokemonType} value={pokemonType}>{formatType(pokemonType)}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={`pdex__favorites-filter ${favoritesOnly ? 'pdex__favorites-filter--active' : ''}`}
            onClick={() => setFavoritesOnly((active) => !active)}
            aria-pressed={favoritesOnly}
          >
            <span aria-hidden="true">♥</span>
            Favorites
            <span className="pdex__favorites-count">{favorites.size}</span>
          </button>
        </div>

        <div className="pdex__console-footer">
          <p className="pdex__result-count" aria-live="polite">
            Showing <strong>{filteredPokemon.length}</strong> of {POKEMON.length} Pokémon
          </p>

          <div className="pdex__console-actions">
            {filtersActive && (
              <button type="button" className="pdex__clear-filters" onClick={clearFilters}>
                Clear filters
              </button>
            )}
            <div className="pdex__density" role="group" aria-label="Card size">
              <span className="pdex__density-label">Card size</span>
              <button
                className="pdex__size-btn"
                onClick={() => setTileSize((size) => Math.max(MIN_SIZE, size - STEP))}
                disabled={tileSize <= MIN_SIZE}
                aria-label="Smaller cards"
              >
                −
              </button>
              <button
                className="pdex__size-btn"
                onClick={() => setTileSize((size) => Math.min(MAX_SIZE, size + STEP))}
                disabled={tileSize >= MAX_SIZE}
                aria-label="Larger cards"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredPokemon.length > 0 ? (
        <div className="pdex__grid" style={{ '--tile-size': `${tileSize}px` }}>
          {filteredPokemon.map((pokemon) => (
            <PokedexTile
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={favorites.has(pokemon.id)}
              onClick={setSelected}
            />
          ))}
        </div>
      ) : (
        <div className="pdex__empty">
          <span className="pdex__empty-mark" aria-hidden="true">?</span>
          <h2>No Pokémon found</h2>
          <p>Try another name or clear your filters to reopen the index.</p>
          <button type="button" onClick={clearFilters}>Clear search and filters</button>
        </div>
      )}

      {selected && (
        <PokedexDetail
          pokemon={selected}
          onClose={() => setSelected(null)}
          pokemonList={filteredPokemon}
          onNavigate={setSelected}
        />
      )}
    </div>
  );
}
