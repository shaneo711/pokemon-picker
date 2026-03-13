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

export function Pokedex() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="pdex">
      <div className="pdex__grid">
        {POKEMON.map((p) => (
          <PokedexTile key={p.id} pokemon={p} onClick={setSelected} />
        ))}
      </div>
      {selected && (
        <PokedexDetail pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
