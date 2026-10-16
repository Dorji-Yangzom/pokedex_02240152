export async function getPokemon(offset = 152) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
  const data = await response.json();
  return data;
}

export async function getAllPokemon() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=2000'
  );

  const data = await response.json();
  return data.results;
}

export async function getPokemonDetails(id) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  );

  const data = await response.json();
  return data;
}