import { useState, useCallback } from 'react';
import { POKEMON } from '../data/pokemon';
import { shuffle } from '../utils/shuffle';

export function useGameQueue() {
  const [queue, setQueue] = useState(() => shuffle(POKEMON.map((p) => p.id)));
  const [index, setIndex] = useState(0);

  const currentPokemonId = queue[index];
  const currentPokemon = POKEMON.find((p) => p.id === currentPokemonId);

  const advance = useCallback(() => {
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= POKEMON.length) {
        setQueue(shuffle(POKEMON.map((p) => p.id)));
        return 0;
      }
      return next;
    });
  }, []);

  return { currentPokemon, advance };
}
