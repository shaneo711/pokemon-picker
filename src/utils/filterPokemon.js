export function matchesPokemonSearch(pokemon, search) {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  const numberQuery = query.replace(/^#/, '');
  const paddedId = String(pokemon.id).padStart(3, '0');
  return pokemon.name.toLowerCase().includes(query)
    || (/^\d+$/.test(numberQuery) && paddedId.includes(numberQuery));
}

export function filterPokemon(pokemonList, detailsById, favourites, filters) {
  const { search, generation, type, favouritesOnly } = filters;

  return pokemonList.filter((pokemon) => {
    const details = detailsById[pokemon.id];
    return matchesPokemonSearch(pokemon, search)
      && (generation === 'all' || pokemon.gen === Number(generation))
      && (type === 'all' || details.types.includes(type))
      && (!favouritesOnly || favourites.has(pokemon.id));
  });
}
