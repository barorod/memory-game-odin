const getRandomPokemon = (pool, count) => {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const generatePokemon = async (
  pokemonCount = 16,
  batchSize = 4,
  maxPokemonId = 1025
) => {
  const localStorageKey = 'localPokemon';
  const localPokemonData = localStorage.getItem(localStorageKey);
  let localPokemon = [];
  const oneDay = 24 * 60 * 60 * 1000;

  if (localPokemonData) {
    const { timestamp, data } = JSON.parse(localPokemonData);

    if (Date.now() - timestamp < oneDay) {
      localPokemon = data;
    }
  }

  const randomPokemonIds = new Set();
  const existingPokemonIds = new Set(localPokemon.map((p) => p.id));

  while (randomPokemonIds.size < pokemonCount) {
    const randomizer = Math.floor(Math.random() * maxPokemonId) + 1;

    if (!randomPokemonIds.has(randomizer)) {
      randomPokemonIds.add(randomizer);
    }
  }

  const selectedPokemon = [];
  const idsToFetch = [];

  for (const id of randomPokemonIds) {
    const existingPokemonId = localPokemon.find((p) => p.id === id);

    if (existingPokemonId) {
      selectedPokemon.push(existingPokemonId);
    } else {
      idsToFetch.push(id);
    }
  }

  if (idsToFetch.length > 0) {
    try {
      for (let i = 0; i < idsToFetch.length; i += batchSize) {
        const batch = idsToFetch.slice(i, i + batchSize);

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

        selectedPokemon.push(...batchResults);

        for (const pokemon of batchResults) {
          if (!existingPokemonIds.has(pokemon.id)) {
            localPokemon.push(pokemon);
            existingPokemonIds.add(pokemon.id);
          }
        }

        if (i + batchSize < idsToFetch.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ timestamp: Date.now(), data: localPokemon })
      );
    } catch (error) {
      console.log('Error fetching:', error);
      return selectedPokemon.length === pokemonCount
        ? selectedPokemon
        : selectedPokemon.length > pokemonCount
        ? selectedPokemon.slice(0, pokemonCount)
        : [
            ...selectedPokemon,
            ...getRandomPokemon(
              localPokemon,
              pokemonCount - selectedPokemon.length
            ),
          ];
    }
  }

  return selectedPokemon;
};
