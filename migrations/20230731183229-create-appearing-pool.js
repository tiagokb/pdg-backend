'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AppearingPools', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      modelId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      modelType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      endurance: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      untilDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AppearingPools');
  }
};