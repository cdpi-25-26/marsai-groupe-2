'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('movies_juries', {

      id_movie_jury: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      id_movie: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'movies',
          key: 'id_movie'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }

    });

    // Empêche qu’un même jury soit assigné 2 fois au même film
    await queryInterface.addConstraint('movies_juries', {
      fields: ['id_movie', 'id_user'],
      type: 'unique',
      name: 'unique_movies_jury'
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('movies_juries');
  }
};

