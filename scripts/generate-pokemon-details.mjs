import { writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { POKEMON } from '../src/data/pokemon.js';

const API_ROOT = 'https://pokeapi.co/api/v2';
const CONCURRENCY = 6;
const RETRIES = 3;
const TYPE_ORDER = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
  'dragon', 'dark', 'steel', 'fairy',
];
const STAT_NAMES = [
  'hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed',
];

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDir, '../src/data/pokemonDetails.json');
const temporaryPath = `${outputPath}.tmp`;

function wait(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function fetchJson(path) {
  const url = `${API_ROOT}/${path}`;

  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (attempt === RETRIES) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`, { cause: error });
      }
      await wait(250 * (2 ** (attempt - 1)));
    }
  }
}

async function mapWithConcurrency(items, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, runWorker)
  );
  return results;
}

function cleanFlavorText(text) {
  return text.replace(/\f/g, ' ').replace(/\n/g, ' ');
}

function getDamageMultiplier(attackingType, defendingTypes, typeDataByName) {
  return defendingTypes.reduce((multiplier, defendingType) => {
    const relations = typeDataByName[defendingType].damage_relations;
    if (relations.no_damage_from.some((type) => type.name === attackingType)) return 0;
    if (relations.double_damage_from.some((type) => type.name === attackingType)) {
      return multiplier * 2;
    }
    if (relations.half_damage_from.some((type) => type.name === attackingType)) {
      return multiplier * 0.5;
    }
    return multiplier;
  }, 1);
}

function validateRecord(id, record) {
  if (!Array.isArray(record.types) || record.types.length < 1 || record.types.length > 2) {
    throw new Error(`Pokémon ${id} has invalid types`);
  }
  if (record.types.some((type) => !TYPE_ORDER.includes(type))) {
    throw new Error(`Pokémon ${id} has an unknown type`);
  }
  if (!record.flavorText) throw new Error(`Pokémon ${id} has no English flavor text`);
  if (!Number.isFinite(record.height) || !Number.isFinite(record.weight)) {
    throw new Error(`Pokémon ${id} has invalid dimensions`);
  }
  if (!Array.isArray(record.stats) || record.stats.length !== 6) {
    throw new Error(`Pokémon ${id} does not have exactly six stats`);
  }
  if (record.stats.some(({ name, value }) => !STAT_NAMES.includes(name) || !Number.isFinite(value))) {
    throw new Error(`Pokémon ${id} has invalid stats`);
  }
  if (record.weaknesses.some((type) => !TYPE_ORDER.includes(type))) {
    throw new Error(`Pokémon ${id} has an unknown weakness`);
  }
}

async function main() {
  console.log(`Fetching details for ${POKEMON.length} Pokémon...`);

  const rawPokemon = await mapWithConcurrency(POKEMON, async ({ id }) => {
    const [pokemon, species] = await Promise.all([
      fetchJson(`pokemon/${id}`),
      fetchJson(`pokemon-species/${id}`),
    ]);
    if (pokemon.id !== id || species.id !== id) {
      throw new Error(`PokéAPI returned mismatched data for Pokémon ${id}`);
    }
    return { id, pokemon, species };
  });

  const usedTypes = [...new Set(
    rawPokemon.flatMap(({ pokemon }) => pokemon.types.map(({ type }) => type.name))
  )].sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));

  console.log(`Fetching ${usedTypes.length} shared type records...`);
  const typeData = await mapWithConcurrency(usedTypes, (type) => fetchJson(`type/${type}`));
  const typeDataByName = Object.fromEntries(
    usedTypes.map((type, index) => [type, typeData[index]])
  );

  const details = {};
  for (const { id, pokemon, species } of rawPokemon) {
    const types = pokemon.types
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map(({ type }) => type.name);
    const flavorEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    );

    const record = {
      types,
      weaknesses: TYPE_ORDER.filter(
        (attackingType) => getDamageMultiplier(attackingType, types, typeDataByName) > 1
      ),
      flavorText: flavorEntry ? cleanFlavorText(flavorEntry.flavor_text) : '',
      height: pokemon.height,
      weight: pokemon.weight,
      stats: pokemon.stats.map(({ stat, base_stat: value }) => ({ name: stat.name, value })),
    };

    validateRecord(id, record);
    details[id] = record;
  }

  if (Object.keys(details).length !== POKEMON.length) {
    throw new Error(`Expected ${POKEMON.length} records, generated ${Object.keys(details).length}`);
  }

  await writeFile(temporaryPath, `${JSON.stringify(details, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, outputPath);
  console.log(`Wrote ${POKEMON.length} records to ${outputPath}`);
}

await main();
