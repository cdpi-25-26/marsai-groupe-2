'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.showAllTables();
    const hasTable = table.includes('vote_histories') || table.includes('VoteHistories');
    if (hasTable) return;

    await queryInterface.createTable('vote_histories', {
      id_vote_history: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_vote: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'votes',
          key: 'id_vote'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_movie: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      note: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vote_histories');
  }
};
