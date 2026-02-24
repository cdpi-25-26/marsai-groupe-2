'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('movies', 'youtbe_status', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('movies', 'youtube_movie_id', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('movies', 'youtbe_statut');
    await queryInterface.removeColumn('movies', 'youtube_movie_id');
   
  }
};
