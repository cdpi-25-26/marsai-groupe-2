'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('movies', 'translation', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('movies', 'synopsis', {
      type: Sequelize.TEXT
    });

    await queryInterface.addColumn('movies', 'synopsis_anglais', {
      type: Sequelize.TEXT
    });

    await queryInterface.addColumn('movies', 'subtitle', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('movies', 'ai_tool', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('movies', 'thumbnail', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('movies', 'selection_status', {
      type: Sequelize.ENUM(
        'submitted',
        'refused',
        'to_discuss',
        'selected',
        'finalist'
      ),
      allowNull: false,
      defaultValue: 'submitted'
    });

    await queryInterface.addColumn('movies', 'id_user', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_user'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('movies', 'id_user');
    await queryInterface.removeColumn('movies', 'selection_status');
    await queryInterface.removeColumn('movies', 'thumbnail');
    await queryInterface.removeColumn('movies', 'ai_tool');
    await queryInterface.removeColumn('movies', 'subtitle');
    await queryInterface.removeColumn('movies', 'synopsis_anglais');
    await queryInterface.removeColumn('movies', 'synopsis');
    await queryInterface.removeColumn('movies', 'translation');
  }
};
