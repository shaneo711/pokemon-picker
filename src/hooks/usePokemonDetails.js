import { useState, useEffect } from 'react';

const cache = {};

function calcWeaknesses(typeDataList) {
  const weakSet = new Set();
  const immuneSet = new Set();

  for (const data of typeDataList) {
    const rel = data.damage_relations;
    rel.double_damage_from.forEach((t) => weakSet.add(t.name));
    rel.no_damage_from.forEach((t) => immuneSet.add(t.name));
  }

  immuneSet.forEach((t) => weakSet.delete(t));
  return Array.from(weakSet);
}

function cleanFlavorText(text) {
  return text.replace(/\f/g, ' ').replace(/\n/g, ' ');
}

export function usePokemonDetails(id, enabled) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !id) return;
    if (cache[id]) {
      setDetails(cache[id]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetchDetails() {
      try {
        const [pokemon, species] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json()),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((r) => r.json()),
        ]);

        if (cancelled) return;

        const types = pokemon.types.map((t) => t.type.name);
        const height = pokemon.height;
        const weight = pokemon.weight;

        const flavorEntry = species.flavor_text_entries.find(
          (e) => e.language.name === 'en'
        );
        const flavorText = flavorEntry ? cleanFlavorText(flavorEntry.flavor_text) : '';

        const typeDataList = await Promise.all(
          types.map((name) =>
            fetch(`https://pokeapi.co/api/v2/type/${name}`).then((r) => r.json())
          )
        );

        if (cancelled) return;

        const weaknesses = calcWeaknesses(typeDataList);

        const result = { types, weaknesses, flavorText, height, weight };
        cache[id] = result;
        setDetails(result);
      } catch {
        // silently fail — back of card just won't show
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetails();
    return () => { cancelled = true; };
  }, [id, enabled]);

  // Reset when id changes
  useEffect(() => {
    if (!cache[id]) setDetails(null);
  }, [id]);

  return { details, loading };
}
