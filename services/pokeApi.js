const axios = require('axios');

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Function to fetch a Pokémon by its ID or name from the PokeAPI
exports.getPokemon = async (idOrName) => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}${idOrName}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching Pokémon from the PokeAPI');
  }
}
