export const generatePokemon = async (pokemonCount = 16) => {
  try {
    const maxPokemonId = 1025;
    const randomPokemonIds = new Set();

    while (randomPokemonIds.size < pokemonCount) {
      const randomizer = Math.floor(Math.random() * maxPokemonId) + 1;
      randomPokemonIds.add(randomizer);
    }

    const pokemonPromises = Array.from(randomPokemonIds).map(async (id) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      return {
        id: data.id,
        name: data.name,
        imageUrl: data.sprites.front_default,
      };
    });

    return await Promise.all(pokemonPromises);
  } catch (error) {
    console.log('Error fetching:', error);
    return [];
  }
};
