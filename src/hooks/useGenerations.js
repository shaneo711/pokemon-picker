import { useState, useCallback, useMemo } from 'react';
import { GENERATIONS, POKEMON } from '../data/pokemon';

const STORAGE_KEY = 'pokemon-generations';

const ALL_GEN_IDS = GENERATIONS.map((g) => g.id);

function loadGenerations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set(ALL_GEN_IDS);
    // Drop anything that isn't a generation we still know about, and fall back
    // to everything rather than ever handing back an empty pool.
    const known = JSON.parse(stored).filter((id) => ALL_GEN_IDS.includes(id));
    return known.length > 0 ? new Set(known) : new Set(ALL_GEN_IDS);
  } catch {
    return new Set(ALL_GEN_IDS);
  }
}

function saveGenerations(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function useGenerations() {
  const [enabledGens, setEnabledGens] = useState(loadGenerations);

  const toggleGen = useCallback((id) => {
    setEnabledGens((prev) => {
      // Turning off the last one would leave nothing to be quizzed on.
      if (prev.has(id) && prev.size === 1) return prev;
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveGenerations(next);
      return next;
    });
  }, []);

  // Referentially stable while the selection is unchanged — useGameQueue keys an
  // effect on this identity, so a new array every render would reshuffle forever.
  const pool = useMemo(
    () => POKEMON.filter((p) => enabledGens.has(p.gen)),
    [enabledGens]
  );

  return { enabledGens, toggleGen, pool };
}
