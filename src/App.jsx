import { useEffect, useRef, useState } from 'react';
import { generatePokemon } from './util';
import PokemonCard from './PokemonCard';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedCardIds, setClickedCardIds] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const highScore = useRef(0);

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
      if (clickedCardIds.length > highScore.current) {
        highScore.current = clickedCardIds.length;
      }

      setGameOver(true);
      return;
    }

    setClickedCardIds((prev) => [...prev, id]);

    setPokemon((prevPokemon) =>
      [...prevPokemon].sort(() => Math.random() - 0.5)
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-800 to-purple-900 p-6 text-white'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>Memory Card Game</h1>
            <p className='text-lg text-indigo-200'>
              Test your memory to the limit
            </p>
          </div>
          <div className='mt-4 md:mt-0'>
            {' '}
            <p className='text-xl'>
              High Score:{' '}
              <span className='font-bold text-yellow-300'>
                {highScore.current}
              </span>
            </p>
            <p className='text-xl'>
              Current Score:{' '}
              <span className='font-bold text-green-300'>
                {clickedCardIds.length}
              </span>
            </p>
            <button
              className='mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold disabled:opacity-50'
              onClick={resetGame}
              disabled={loading}>
              {loading ? 'Loading...' : 'New Game'}
            </button>
          </div>
        </div>
        {gameOver && (
          <div className='fixed inset-0 bg-black opacity-80 flex items-center justify-center z-50 '>
            <div className='bg-indigo-700 p-8 rounded-xl shadow-2xl text-center'>
              {' '}
              <h2 className='text-3xl font-bold mb-4'>Game Over!</h2>
              <button
                onClick={resetGame}
                className='px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold'>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {pokemon.map((card) => (
          <PokemonCard
            key={card.id}
            imageUrl={card.imageUrl}
            name={card.name}
            onClick={() => handlePokemonClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
