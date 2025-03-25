const PokemonCard = ({ name, imageUrl, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='bg-indigo-700 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 duration-200 hover:shadow-lg'>
      <div className='p4 flex justify-center'>
        <img className='h-32 object-contain' src={imageUrl} alt={name} />
      </div>
      <p className='bg-indigo-800 py-2 text-center font-medium capitalize'>
        {name}
      </p>
    </div>
  );
};

export default PokemonCard;
