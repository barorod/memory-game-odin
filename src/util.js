export const generatePokemon = async (pokemonCount = 16, batchSize = 4) => {
  const localPokemon = localStorage.getItem('localPokemon');

  if (localPokemon) {
    const { timestamp, data } = JSON.parse(localPokemon);
    const oneHour = 60 * 60 * 1000;

    if (Date.now() - timestamp < oneHour) {
      return data;
    }
  }

  try {
    const maxPokemonId = 1025;
    const randomPokemonIds = new Set();

    while (randomPokemonIds.size < pokemonCount) {
      const randomizer = Math.floor(Math.random() * maxPokemonId) + 1;
      randomPokemonIds.add(randomizer);
    }

    const ids = Array.from(randomPokemonIds);
    const result = [];

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (id) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await res.json();

          return {
            id: data.id,
            name: data.name,
            imageUrl: data.sprites.front_default,
          };
        })
      );

      result.push(...batchResults);

      if (i + batchSize < ids.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    localStorage.setItem(
      'localPokemon',
      JSON.stringify({ timestamp: Date.now(), data: result })
    );

    return result;
  } catch (error) {
    console.log('Error fetching:', error);
    return [];
  }
};
