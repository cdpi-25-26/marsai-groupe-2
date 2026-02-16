'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('votes');
    
    // Aggiungi campo per contare le modifiche
    if (!tableInfo.modification_count) {
      await queryInterface.addColumn('votes', 'modification_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'Numero di volte che il voto è stato modificato'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('votes', 'modification_count');
  }
};
