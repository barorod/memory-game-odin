import { useEffect, useState } from 'react';
import { generatePokemon } from './util';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedCardIds, setClickedCardIds] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const fetchPokemons = async () => {
    setLoading(true);
    setClickedCardIds([]);
    setGameOver(false);

    try {
      const data = await generatePokemon();
      const shuffled = data.sort(() => Math.random() - 0.5);
      setPokemon(shuffled);
    } catch (error) {
      console.log('Error fetching: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const resetGame = () => {
    fetchPokemons();
  };

  const handlePokemonClick = (id) => {
    if (gameOver || loading) return;

    if (clickedCardIds.includes(id)) {
      setGameOver(true);
      return;
    }

    setClickedCardIds((prev) => [...prev, id]);

    setPokemon((prevPokemon) =>
      [...prevPokemon].sort(() => Math.random() - 0.5)
    );
  };

  return (
    <div>
      <h1>Memory Card Game</h1>
      <p>Test your memory to the limit</p>
      <button onClick={resetGame} disabled={loading}>
        {loading ? 'Loading...' : 'New Game'}
      </button>

      {gameOver && (
        <div>
          <h2>Game Over!</h2>
        </div>
      )}

      {pokemon.map((card) => (
        <div key={card.id} onClick={() => handlePokemonClick(card.id)}>
          <img src={card.imageUrl} alt={card.name} />
          <p>{card.name}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
