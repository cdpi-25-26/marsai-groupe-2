'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Films', {
      id_film: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      duree: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      langue_principale: {
        type: Sequelize.STRING,
        allowNull: true
      },
      annee_sortie: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      nationalite: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_affiche: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image3: {
        type: Sequelize.STRING,
        allowNull: true
      },
      video_bande_annonce: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lien_youtube: {
        type: Sequelize.STRING,
        allowNull: true
      },
      production: {
        type: Sequelize.STRING,
        allowNull: true
      },
      workshop: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Films');
  }
};
