'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.renameColumn('movies', 'youtbe_status', 'youtube_status');
  },

  async down(queryInterface, Sequelize) {
   
    await queryInterface.renameColumn('movies', 'youtube_status', 'youtbe_status');
  }
};
