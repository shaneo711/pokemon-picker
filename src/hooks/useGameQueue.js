import { useState, useCallback } from 'react';
import { shuffle } from '../utils/shuffle';

export function useGameQueue(pool) {
  const [queue, setQueue] = useState(() => shuffle(pool.map((p) => p.id)));
  const [index, setIndex] = useState(0);
  const [poolRef, setPoolRef] = useState(pool);

  // Changing which generations are in play starts a fresh pass. Adjusting during
  // render rather than in an effect — React re-runs this render with the new
  // queue before committing, so nothing ever sees the mismatched pair.
  if (pool !== poolRef) {
    setPoolRef(pool);
    setQueue(shuffle(pool.map((p) => p.id)));
    setIndex(0);
  }

  const currentPokemonId = queue[index];
  const currentPokemon = pool.find((p) => p.id === currentPokemonId) ?? pool[0];

  const advance = useCallback(() => {
    setIndex((prev) => {
      const next = prev + 1;
      // The queue, not the pool, is the authority on how many are left this pass.
      if (next >= queue.length) {
        setQueue(shuffle(pool.map((p) => p.id)));
        return 0;
      }
      return next;
    });
  }, [pool, queue.length]);

  const reset = useCallback(() => {
    setQueue(shuffle(pool.map((p) => p.id)));
    setIndex(0);
  }, [pool]);

  return { currentPokemon, advance, reset };
}
