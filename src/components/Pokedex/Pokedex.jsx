import { useState } from 'react';
import { POKEMON, getSpriteUrl } from '../../data/pokemon';
import { PokedexDetail } from './PokedexDetail';
import './Pokedex.css';

function PokedexTile({ pokemon, onClick }) {
  return (
    <button className="pdex-tile" onClick={() => onClick(pokemon)}>
      <span className="pdex-tile__num">#{String(pokemon.id).padStart(3, '0')}</span>
      <img
        src={getSpriteUrl(pokemon.id)}
        alt={pokemon.name}
        className="pdex-tile__img"
        loading="lazy"
      />
      <span className="pdex-tile__name">{pokemon.name}</span>
    </button>
  );
}

const MIN_SIZE = 100;
const MAX_SIZE = 280;
const STEP = 40;

export function Pokedex() {
  const [selected, setSelected] = useState(null);
  const [tileSize, setTileSize] = useState(88);

  return (
    <div className="pdex">
      <div className="pdex__toolbar">
        <button
          className="pdex__size-btn"
          onClick={() => setTileSize((s) => Math.max(MIN_SIZE, s - STEP))}
          disabled={tileSize <= MIN_SIZE}
          aria-label="Smaller cards"
        >
          −
        </button>
        <button
          className="pdex__size-btn"
          onClick={() => setTileSize((s) => Math.min(MAX_SIZE, s + STEP))}
          disabled={tileSize >= MAX_SIZE}
          aria-label="Larger cards"
        >
          +
        </button>
      </div>
      <div className="pdex__grid" style={{ '--tile-size': `${tileSize}px` }}>
        {POKEMON.map((p) => (
          <PokedexTile key={p.id} pokemon={p} onClick={setSelected} />
        ))}
      </div>
      {selected && (
        <PokedexDetail
          pokemon={selected}
          onClose={() => setSelected(null)}
          pokemonList={POKEMON}
          onNavigate={setSelected}
        />
      )}
    </div>
  );
}
