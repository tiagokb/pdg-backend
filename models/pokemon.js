'use strict';
const {
  Model
} = require('sequelize');

const { 
  experienceToEndurance,
  calculateCatchChance,
  playerCatchesPokemon
  } = require('../utils');
const user = require('./user');

exports.getType = "pokemon";

module.exports = (sequelize, DataTypes) => {
  class Pokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pokemon.belongsToMany(models.User, { through: models.Favorite, foreignKey: 'pokemonId' })
      Pokemon.belongsToMany(models.User, { through: models.CapturedPokemon, foreignKey: 'pokemonId' })
    }
  }
  Pokemon.init({
    externalId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    baseExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Pokemon',
  });

  // Define the beforeCreate hook
  Pokemon.beforeValidate((pokemon, options) => {
    // Check if baseExperience is null and set it to 0 if so
    if (pokemon.baseExperience === null) {
      pokemon.baseExperience = 0;
    }
  });

  // Define instance methods
  Pokemon.prototype.getType = function () {
    return this.constructor.name;
  };

  Pokemon.prototype.executeAction = async function (userId, additionalPercentage) {
    try {

      const modelInstance = require('../models').CapturedPokemon;

      const baseChance = 0.4;
      const endurance = experienceToEndurance(this.getDataValue('baseExperience'));
      var itemChance = additionalPercentage;

      if (itemChance == null){
        itemChance = 0;
      }

      const realChance = calculateCatchChance(baseChance, endurance, itemChance);

      if (!playerCatchesPokemon(realChance)){
        return `Oh no!! the ${this.getDataValue('name')} runs free`;
      }

      const [ capturedPokemon, created ] = await modelInstance.findOrCreate({
        where: {
          userId: userId,
          pokemonId: this.getDataValue('id')
        }
      });

      if (!created) {
        capturedPokemon.quantity += 1
        await capturedPokemon.save();
      }

      return `The ${this.getDataValue('name')} was captured, congratulations !!!`
    
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return Pokemon;
};