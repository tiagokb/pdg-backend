'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AppearingPool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AppearingPool.init({
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modelType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endurance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    untilDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AppearingPool',
  });
  return AppearingPool;
};