'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: remove old FLOAT column
    await queryInterface.removeColumn('vote_histories', 'note');

    // Step 2: add it back as ENUM to match votes.note
    await queryInterface.addColumn('vote_histories', 'note', {
      type: Sequelize.ENUM('YES', 'NO', 'TO DISCUSS'),
      allowNull: false,
      defaultValue: 'NO',
      after: 'id_movie'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('vote_histories', 'note');

    await queryInterface.addColumn('vote_histories', 'note', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
      after: 'id_movie'
    });
  }
};
