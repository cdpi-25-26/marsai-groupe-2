'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Collaborateur_Films', {
      id_collaborateur_film: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_collaborateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Collaborateurs',
          key: 'id_collaborateur'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_film: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Films',
          key: 'id_film'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Collaborateur_Films');
  }
};
