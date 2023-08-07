const {
  Favorite,
  CapturedPokemon,
  User,
  Pokemon
} = require('../models');

exports.addOrRemove = async (req, res) => {

  const { externalId, name, baseExperience, height, isDefault, order, weight } = req.body;

  var pokemon = {
    externalId: externalId,
    name: name,
    baseExperience: baseExperience,
    height: height,
    isDefault: isDefault,
    order: order,
    weight: weight
  }

  let err = false;
  let message = "";

  for (const key in pokemon) {
    if (pokemon[key] == null) {
      err = true;
      message += "The field " + key + " cannot be null \n";
    }
  }

  if (err) {
    return res.status(500).json({ message: message });
  }

  try {
    const [pokemonResult, created] = await Pokemon.findOrCreate({
      where: {
        externalId: externalId
      },
      defaults: pokemon // The data to be created if the record is not found
    });

    const [favorite, favoriteCreated] = await Favorite.findOrCreate({
      where: {
        userId: req.userId,
        pokemonId: pokemonResult.id
      }
    });

    if (favoriteCreated) {
      return res.status(200).json({ message: pokemonResult.name + " adicionado aos favoritos" });
    } else {
      await favorite.destroy();
      return res.status(200).json({ message: pokemonResult.name + " removido dos favoritos" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}

exports.listFavorites = (req, res) => {

  User.findOne({
    where: {
      id: req.userId
    },
    include: [
      {
        model: Pokemon,
        through: {
          model: Favorite,
          attributes: []
        }
      }
    ]
  }).then((user) => {
    // Now the favorites array will contain only the associated Pokemon models
    return res.status(200).json(user.Pokemons);
  })
  .catch((error) => {
    return res.status(500).json({ message: "Internal error: " + error.message });
  });
};

exports.listCaptured = (req, res) => {

  User.findOne({
    where: {
      id: req.userId
    },
    include: [
      {
        model: Pokemon,
        through: {
          model: CapturedPokemon,
          attributes: ['quantity']
        }
      }
    ]
  }).then((user) => {
    // Now the favorites array will contain only the associated Pokemon models
    return res.status(200).json(user.Pokemons);
  })
  .catch((error) => {
    return res.status(500).json({ message: "Internal error: " + error.message });
  });
};

exports.getByExternalId = async (id) => {
  return await Pokemon.findOne({
    where: {
      externalId: id
    }
  })
}

exports.insert = async (pokemon) => {
  return await Pokemon.create(pokemon);
}