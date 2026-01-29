'use strict';

module.exports = (sequelize, DataTypes) => {
  const Film = sequelize.define('Film', {
    id_film: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },

    // mesChamps existants
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    duree: DataTypes.INTEGER,
    langue_principale: DataTypes.STRING,
    annee_sortie: DataTypes.INTEGER,
    nationalite: DataTypes.STRING,
    image_affiche: DataTypes.STRING,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING,
    image3: DataTypes.STRING,
    video_bande_annonce: DataTypes.STRING,
    lien_youtube: DataTypes.STRING,
    production: DataTypes.STRING,
    workshop: DataTypes.STRING,

    //  mes NOUVEAUX CHAMPS (alter-film)
    traduction: DataTypes.STRING,
    synopsis: DataTypes.TEXT,
    synopsis_anglais: DataTypes.TEXT,
    sous_titre: DataTypes.STRING,
    outil_ia: DataTypes.STRING,
    vignette: DataTypes.STRING,

    statut_selection: {
      type: DataTypes.ENUM(
        'soumis',
        'refuse',
        'a_sucre',
        'retenu',
        'finaliste'
      ),
      allowNull: false,
      defaultValue: 'soumis'
    },

    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {});

  Film.associate = function(models) {

    // relations existantes
    Film.hasMany(models.Prix, {
      foreignKey: 'id_film'
    });

    Film.hasMany(models.Evaluation, {
      foreignKey: 'id_film'
    });

    Film.belongsToMany(models.Categorie, {
      through: 'Film_Categories',
      foreignKey: 'id_film',
      otherKey: 'id_categorie'
    });

    Film.belongsToMany(models.Collaborateur, {
      through: 'Collaborateur_Films',
      foreignKey: 'id_film',
      otherKey: 'id_collaborateur'
    });

    // RELATION AVEC UTILISATEUR
    Film.belongsTo(models.Utilisateur, {
      foreignKey: 'id_utilisateur'
    });
  };

  return Film;
};
