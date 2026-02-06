/**
 * Modèle Movie (Film)
 * Représente un film soumis à la plateforme du festival
 * Gère les informations du film, son statut de sélection, et ses relations
 * avec les utilisateurs (producteur), les votes et les prix
 * 
 * Champs principales:
 * - Identité: title, description, duration, release_year, nationality
 * - Médias: poster_image, image1-3, trailer_video, thumbnail
 * - Technique: main_language, subtitle, ai_tool, workshop, production
 * - Statut: selection_status (submitted, refused, to_discuss, selected, finalist)
 * - Propriétaire: id_user (producteur qui a soumis le film)
 * 
 * Associations:
 * - belongsTo User: Chaque film appartient à un utilisateur (producteur)
 * - hasMany Award: Un film peut recevoir plusieurs prix
 * - hasMany Vote: Un film peut recevoir plusieurs votes du jury
 */

'use strict';

export default (sequelize, DataTypes) => {
  /**
   * Définition du modèle Movie
   * Crée une table 'movies' avec les colonnes définies ci-dessous
   */
  const Movie = sequelize.define('Movie', {
    // Identifiant unique et clé primaire
    id_movie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // Titre du film (requis)
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Description/synopsis du film
    description: DataTypes.TEXT,
    
    // Durée du film en minutes
    duration: DataTypes.INTEGER,
    
    // Langue principale du film
    main_language: DataTypes.STRING,
    
    // Année de sortie du film
    release_year: DataTypes.INTEGER,
    
    // Nationalité/pays d'origine
    nationality: DataTypes.STRING,

    // Images du film (affiche et visuels)
    display_picture: DataTypes.STRING,
    picture1: DataTypes.STRING,
    picture2: DataTypes.STRING,
    picture3: DataTypes.STRING,

    // Vidéos du film
    trailer: DataTypes.STRING,
    youtube_link: DataTypes.STRING(255),
    
    // Informations de production
    production: DataTypes.STRING,
    workshop: DataTypes.STRING(255),

    // Champs ajoutés pour améliorer les métadonnées
    translation: DataTypes.STRING(255),      // Langue de traduction
    synopsis: DataTypes.TEXT,                // Synopsis en français
    synopsis_anglais: DataTypes.TEXT,        // Synopsis en anglais
    subtitle: DataTypes.STRING(255),         // Langue des sous-titres
    ai_tool: DataTypes.STRING(255),          // Outil IA utilisé
    thumbnail: DataTypes.STRING(255),        // Image thumbnail

    // Statut de sélection du film dans le processus de jury
    selection_status: {
      type: DataTypes.ENUM(
        'submitted',   // Soumis (état initial)
        'refused',     // Rejeté par le jury
        'to_discuss',  // À discuter par le jury
        'selected',    // Sélectionné
        'finalist'     // Film finaliste
      ),
      allowNull: false,
      defaultValue: 'submitted'
    },

    // Clé étrangère: Producteur qui a soumis le film
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {
    tableName: 'movies',
    timestamps: true  // Ajoute createdAt et updatedAt automatiquement
  });

  /**
   * Définition des associations du modèle Movie
   * Établit les relations avec d'autres modèles
   * @param {Object} models - Objet contenant tous les modèles
   */
  Movie.associate = function(models) {

    // Relation: Un film appartient à un utilisateur (producteur)
    // La clé étrangère id_user relie le film à son créateur
    Movie.belongsTo(models.User, {
      as: 'Producer',
      foreignKey: 'id_user'
    });

    // Relation: Un film peut avoir plusieurs prix (Awards)
    // Un film peut remporter plusieurs prix différents
    Movie.hasMany(models.Award, {
      foreignKey: 'id_movie'
    });

    // Relation: Un film peut recevoir plusieurs votes du jury
    // Chaque membre du jury peut voter sur ce film
    Movie.hasMany(models.Vote, {
      foreignKey: 'id_movie'
    });

    Movie.belongsToMany(models.Categorie, {
      through: 'movies_categories',
      foreignKey: 'id_movie',
      otherKey: 'id_categorie'
    });

    Movie.belongsToMany(models.Collaborator, {
      through: 'collaborators_movies',
      foreignKey: 'id_movie',
      otherKey: 'id_collaborator'
    });


    // Relation N–N : Movie ↔ User (JURY)
    Movie.belongsToMany(models.User, {
      as: 'Juries',
      through: 'movies_juries',
      foreignKey: 'id_movie',
      otherKey: 'id_user'
   });


  };

  return Movie;
};



/*'use strict';

module.exports = (sequelize, DataTypes) => {
  const movie = sequelize.define('movie', {
    id_movie: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },

    // mesChamps existants
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: DataTypes.TEXT,
    duration: DataTypes.INTEGER,
    main_language: DataTypes.STRING(20),
    release_year: DataTypes.INTEGER,
    nnationality: DataTypes.STRING(255),
    display_picture: DataTypes.STRING(255),
    picture1: DataTypes.STRING(255),
    picture2: DataTypes.STRING(255),
    picture3: DataTypes.STRING(255),
    trailer: DataTypes.STRING(255),
    youtube_link: DataTypes.STRING(255),
    production: DataTypes.STRING(255),
    workshop: DataTypes.STRING(255),

    //  mes NOUVEAUX CHAMPS (alter-film)
    traduction: DataTypes.STRING(255),
    synopsis: DataTypes.TEXT,
    synopsis_anglais: DataTypes.TEXT,
    sous_titre: DataTypes.STRING(255),
    outil_ia: DataTypes.STRING(255),
    vignette: DataTypes.STRING(255),

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

    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {tableName: 'movies' // Table
    }
  );

  movie.associate = function(models) {

    // relations existantes
    movie.hasMany(models.award, {
      foreignKey: 'id_movie'
    });

    movie.hasMany(models.vote, {
      foreignKey: 'id_movie'
    });

    movie.belongsToMany(models.categorie, {
      through: 'movie_categorie',
      foreignKey: 'id_movie',
      otherKey: 'id_categorie'
    });

    movie.belongsToMany(models.collaborator, {
      through: 'collaborators_movies',
      foreignKey: 'id_movie',
      otherKey: 'id_collaborator'
    });

    // RELATION CON USER
    movie.belongsTo(models.user, {
      foreignKey: 'id_user'
    });
  };

  return movie;
};*/



