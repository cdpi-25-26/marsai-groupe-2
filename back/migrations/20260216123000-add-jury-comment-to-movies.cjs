'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('movies');
    if (!tableInfo.jury_comment) {
      await queryInterface.addColumn('movies', 'jury_comment', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('movies', 'jury_comment');
  }
};
