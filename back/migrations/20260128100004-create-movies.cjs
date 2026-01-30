'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('movies', {
      id_movie: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      main_language: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      release_year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      nationality: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      display_picture: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      picture1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      picture2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      picture3: {
        type: Sequelize.STRING,
        allowNull: true
      },
      trailer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      youtube_link: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      production: {
        type: Sequelize.STRING,
        allowNull: true
      },
      workshop: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable('movies');
  }
};
