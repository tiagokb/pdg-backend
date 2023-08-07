const { json } = require('sequelize');
const pokemonController = require('../controllers/pokemonController');
const pokeApi = require('../services/pokeApi');
const { Pokemon, NotificationLog } = require('../models');
const poolController = require('../controllers/appearingPoolController');
const notificationController = require('../controllers/notificationController');
const PushNotification = require('../services/PushNotification');
const firebase = require('../config/firebaseInitialization');

firebase.init();

async function addPokemonToDb(pokemon) {

    try{

        const newModel = await Pokemon.create({
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

async function sendGlobalNotification(pokemon) {

    const now = new Date();
    const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);

    const recipients = await notificationController.getAllNotificationRecipientsWithFavorites(pokemon.id);
    var successCount = 0;
    var failureCount = 0;
    const failedTokens = [];

    // send all favorites notification
    for (let page = 0; page < recipients.favorites.totalPages; page++) {
        const tokens = recipients.favorites.tokens[page];

        const pushNotification = new PushNotification()
            .setTitle(`Um dos seus pokemons favoritos apareceu, o(a) ${pokemon.name} ta na pista!`)
            .setBody("Corre pra pegar ele antes que tu perca, cupinxa")
            .setData("model", "Pokemon")
            .setData("name", pokemon.name)
            .setData("endurance", pokemon.baseExperience)
            .setData("until", twoMinutesFromNow)
            .setTokens(tokens);

        const response = await pushNotification.send();

        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {

                if (resp.success) {
                    successCount++
                } else {
                    failureCount++
                    failedTokens.push(tokens[idx]);
                }
            });
          }
    }

    //send all commons notification
    for (let page = 0; page < recipients.commons.totalPages; page++) {
        const tokens = recipients.commons.tokens[page];

        const pushNotification = new PushNotification()
            .setTitle(`Bah, um ${pokemon.name} selvagem apareceu ein!`)
            .setBody("Corre pra pegar ele, antes que tu perca!")
            .setData("model", "Pokemon")
            .setData("name", pokemon.name)
            .setData("endurance", pokemon.baseExperience)
            .setData("until", twoMinutesFromNow)
            .setTokens(tokens);

        const response = await pushNotification.send();

        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (resp.success) {
                    successCount++
                } else {
                    failureCount++
                    failedTokens.push(tokens[idx]);
                }
            });
          }
    }

    await NotificationLog.create({
        totalTokens: recipients.totalTokens,
        successCount: successCount,
        failureCount: failureCount,
        failedTokens: {failedTokens},
      });
}

    // Function to simulate the appearance of a random Pokémon
async function pokemonAppears(attempts = 1) {

    if (attempts > 5) {
        console.log('Maximum attempts reached. Unable to find Pokémon.');
        return;
    }

    const randomNum = Math.floor(Math.random() * 1010) + 1;
    

    try {

        var pokemon = await pokemonController.getByExternalId(randomNum);

        if (!pokemon) {
            
            const pokeApiResponse = await pokeApi.getPokemon(randomNum);
            pokemon = await addPokemonToDb(pokeApiResponse);
        }

        poolController.setPool(pokemon.getType(), pokemon.id, pokemon.baseExperience);
        sendGlobalNotification(pokemon);

    } catch (error) {
        console.error(error.message);
        // Retry after a delay (500ms) if there's an error
        await new Promise((resolve) => setTimeout(resolve, 500));
        return pokemonAppears(attempts + 1);
    }
  }
  
  // Call the function to make a Pokémon appear
  pokemonAppears();