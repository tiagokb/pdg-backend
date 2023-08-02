'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CapturedPokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CapturedPokemon.belongsTo(models.User, {foreignKey: 'userId'});
      CapturedPokemon.belongsTo(models.Pokemon, {foreignKey: 'pokemonId'});
    }
  }
  CapturedPokemon.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Default value for quantity is 1
    },
  }, {
    sequelize,
    modelName: 'CapturedPokemon',
    timestamps: false
  });

  // Define the beforeSave hook
  CapturedPokemon.beforeSave((capturedPokemon, options) => {
    // If quantity is 0, delete the row
    if (capturedPokemon.quantity == 0) {
      return capturedPokemon.destroy({ force: true });
    }

    return Promise.resolve(); // Resolve the promise if quantity is not 0
  });

  return CapturedPokemon;
};