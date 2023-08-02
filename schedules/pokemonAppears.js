const { json } = require('sequelize');
const pokemonController = require('../controllers/pokemonController');
const pokeApi = require('../services/pokeApi');
const model = require('../models').Pokemon;
const poolController = require('../controllers/appearingPoolController');

async function addPokemonToDb(pokemon) {

    try{

        const newModel = await model.create({
            externalId: pokemon.id,
            name: pokemon.name,
            baseExperience: pokemon.base_experience,
            height: pokemon.height,
            isDefault: pokemon.is_default,
            order: pokemon.order,
            weight: pokemon.weight
        });

        return newModel;
    } catch (error) {
        console.log(error.message);
        throw new Error('Failed to add Pokemon to the database');
    }
}

    // Function to simulate the appearance of a random Pokémon
async function pokemonAppears(attempts = 1) {

    if (attempts > 5) {
        console.log('Maximum attempts reached. Unable to find Pokémon.');
        return;
    }

    const randomNum = Math.floor(Math.random() * 1010) + 1;

    try {

        const pokemon = await pokemonController.getByExternalId(randomNum);
        if (pokemon) {
            poolController.setPool(pokemon.getType(), pokemon.id, pokemon.baseExperience);
            return;
        } else {
            const pokeApiResponse = await pokeApi.getPokemon(randomNum);
            const newPokemon = await addPokemonToDb(pokeApiResponse);
            poolController.setPool(newPokemon.getType(), newPokemon.id, newPokemon.baseExperience);
            return;
        }
    } catch (error) {
        console.error(error.message);
        // Retry after a delay (500ms) if there's an error
        await new Promise((resolve) => setTimeout(resolve, 500));
        return pokemonAppears(attempts + 1);
    }
  }
  
  // Call the function to make a Pokémon appear
  pokemonAppears();