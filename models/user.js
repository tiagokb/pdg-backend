'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Favorite, { foreignKey: 'userId' });
      User.hasMany(models.CapturedPokemon, { foreignKey: 'userId' });
      User.hasMany(models.UserPoolUsage, { foreignKey: 'userId' });
      User.hasMany(models.UserToken, { foreignKey: 'userId' });
      User.belongsToMany(models.Pokemon, { through: models.Favorite, foreignKey: 'userId' });
      User.belongsToMany(models.Pokemon, { through: models.CapturedPokemon, foreignKey: 'userId' });
      User.belongsToMany(models.AppearingPool, { through: models.UserPoolUsage, foreignKey: 'userId' });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};