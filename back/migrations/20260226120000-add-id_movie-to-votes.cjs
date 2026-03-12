'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('votes');

    // Keep this migration safe when id_movie was already created earlier.
    if (!table.id_movie) {
      await queryInterface.addColumn('votes', 'id_movie', {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: 'id_user'
      });
    }

    const [fkRows] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'votes'
        AND CONSTRAINT_NAME = 'fk_votes_movie'
      LIMIT 1
    `);

    if (!fkRows.length) {
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
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove the foreign key constraint first
    await queryInterface.removeConstraint('votes', 'fk_votes_movie');
    
    // Then remove the column
    await queryInterface.removeColumn('votes', 'id_movie');
  }
};