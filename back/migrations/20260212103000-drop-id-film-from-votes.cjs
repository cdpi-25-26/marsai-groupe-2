'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('votes');
    if (table.id_film) {
      await queryInterface.removeColumn('votes', 'id_film');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('votes', 'id_film', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
