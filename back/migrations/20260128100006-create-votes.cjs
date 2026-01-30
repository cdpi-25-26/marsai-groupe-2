'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('votes', {
      id_vote: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_movie: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'movies',
          key: 'id_movie'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      evaluation: {
       type: Sequelize.ENUM('YES', 'NO', 'TI DISCUSS'),
        allowNull: false,
      },

      
      comments: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.dropTable('votes');
  }
};
