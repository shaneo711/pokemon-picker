import pokemonDetails from '../data/pokemonDetails.json';

export function usePokemonDetails(id, enabled) {
  return {
    details: enabled ? pokemonDetails[id] ?? null : null,
    loading: false,
  };
}
