'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the id_movie column after id_user
    await queryInterface.addColumn('votes', 'id_movie', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'id_user'
    });

    // Add the foreign key constraint
    await queryInterface.addConstraint('votes', {
      fields: ['id_movie'],
      type: 'foreign key',
      name: 'fk_votes_movie',
      references: {
        table: 'movies',
        field: 'id_movie'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the foreign key constraint first
    await queryInterface.removeConstraint('votes', 'fk_votes_movie');
    
    // Then remove the column
    await queryInterface.removeColumn('votes', 'id_movie');
  }
};