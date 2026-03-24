'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('votes', 'decision', {
      type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('votes', 'decision');
  }
};
