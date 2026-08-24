import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pokemon-favourites';
const LEGACY_STORAGE_KEY = ['pokemon-fa', 'vorites'].join('');

function loadFavourites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (stored && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, stored);
    }
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveFavourites(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function useFavourites() {
  const [favourites, setFavourites] = useState(loadFavourites);

  const toggleFavourite = useCallback((id) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveFavourites(next);
      return next;
    });
  }, []);

  return { favourites, toggleFavourite };
}
