'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favorites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE', // Update the foreign key if the referenced user's id changes
        onDelete: 'CASCADE', // Delete the favorite if the referenced user is deleted
      },
      pokemonId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pokemons',
          key: 'id',
        },
        onUpdate: 'CASCADE', // Update the foreign key if the referenced pokemon's id changes
        onDelete: 'CASCADE', // Delete the favorite if the referenced pokemon is deleted
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Favorites');
  }
};