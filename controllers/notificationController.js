require('dotenv').config();
const admin = require('firebase-admin');
const { UserToken, Favorite } = require('../models');
const { paginate } = require('../utils');

exports.getAllNotificationRecipientsWithFavorites = async (pokemonId) => {
    const resultsPerPage = 500;
    const totalTokens = await UserToken.count();
    const userTokens = await UserToken.findAll({
        attributes: ['userId', 'token', 'platform'],
        order: [['userId']],
      });

    // Objeto para armazenar tokens favoritados e comuns
    const categorizedTokens = {
        favorites: [],
        commons: [],
    };

    // Verificar se o token é favoritado ou comum e adicioná-lo na categoria apropriada
    for (const token of userTokens) {
        const isFavorite = await Favorite.findOne({
            where: {
                userId: token.userId,
                pokemonId: pokemonId
            }
        });

        if (isFavorite) {
          categorizedTokens.favorites.push(token.token);
        } else {
          categorizedTokens.commons.push(token.token);
        }
      }

      // Paginar os tokens em cada categoria
    const paginatedFavorites = paginate(categorizedTokens.favorites, resultsPerPage);
    const paginatedCommons = paginate(categorizedTokens.commons, resultsPerPage);
    
    return { favorites: paginatedFavorites, commons: paginatedCommons, totalTokens: totalTokens };
  };

exports.registerToken = async (req, res) => {

    const { token, platform } = req.body; 

    if (!token)
        return res.status(400).json({ message: "token é obrigatório" });

    if (!platform)
        return res.status(400).json({ message: "platform é obrigatório" });

    try {

        const [ userToken, created ] = await UserToken.findOrCreate({
            where: {
                userId: req.userId,
                platform: platform
            },
            defaults: {
                token: token
            }
        });

        if (!created) {
            userToken.token = token;
            await userToken.save();
        }

        return res.status(200).json({ message: "Token registrado com sucesso." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}