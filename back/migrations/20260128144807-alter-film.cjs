'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('Films', 'traduction', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('Films', 'synopsis', {
      type: Sequelize.TEXT
    });

    await queryInterface.addColumn('Films', 'synopsis_anglais', {
      type: Sequelize.TEXT
    });

    await queryInterface.addColumn('Films', 'sous_titre', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('Films', 'outil_ia', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('Films', 'vignette', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('Films', 'statut_selection', {
      type: Sequelize.ENUM(
        'soumis',
        'refuse',
        'a_sucre',
        'retenu',
        'finaliste'
      ),
      allowNull: false,
      defaultValue: 'soumis'
    });

    await queryInterface.addColumn('Films', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Films', 'userId');
    await queryInterface.removeColumn('Films', 'statut_selection');
    await queryInterface.removeColumn('Films', 'vignette');
    await queryInterface.removeColumn('Films', 'outil_ia');
    await queryInterface.removeColumn('Films', 'sous_titre');
    await queryInterface.removeColumn('Films', 'synopsis_anglais');
    await queryInterface.removeColumn('Films', 'synopsis');
    await queryInterface.removeColumn('Films', 'traduction');
  }
};
