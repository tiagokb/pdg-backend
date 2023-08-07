'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NotificationLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      totalTokens: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      successCount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      failureCount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      failedTokens: {
        type: Sequelize.JSON
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
    await queryInterface.dropTable('NotificationLogs');
  }
};