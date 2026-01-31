

'use strict';

export default (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    id_movie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: DataTypes.TEXT,
    duration: DataTypes.INTEGER,
    main_language: DataTypes.STRING,
    release_year: DataTypes.INTEGER,
    nationality: DataTypes.STRING,

    poster_image: DataTypes.STRING,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING,
    image3: DataTypes.STRING,

    trailer_video: DataTypes.STRING,
    youtube_link: DataTypes.STRING(255),
    production: DataTypes.STRING,
    workshop: DataTypes.STRING(255),

//  mes NOUVEAUX CHAMPS (alter-movie)
    translation: DataTypes.STRING(255),
    synopsis: DataTypes.TEXT,
    synopsis_anglais: DataTypes.TEXT,
    subtitle: DataTypes.STRING(255),
    ai_tool: DataTypes.STRING(255),
    thumbnail: DataTypes.STRING(255),

    selection_status: {
      type: DataTypes.ENUM(
        'submitted',
        'refused',
        'to_discuss',
        'selected',
        'finalist'
      ),
      allowNull: false,
      defaultValue: 'submitted'
    },



    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {
    tableName: 'movies',
    timestamps: true
  });

  Movie.associate = function(models) {

    // UTILISER LES BONS NOMS DE MODELS
    Movie.belongsTo(models.User, {
      foreignKey: 'id_user'
    });

    Movie.hasMany(models.Award, {
      foreignKey: 'id_movie'
    });

    Movie.hasMany(models.Vote, {
      foreignKey: 'id_movie'
    });

    Movie.belongsToMany(models.Categorie, {
      through: 'movies_categories',
      foreignKey: 'id_movie',
      otherKey: 'id_categorie'
    });

    Movie.belongsToMany(models.Collaborator, {
      through: 'collaborator_movies',
      foreignKey: 'id_movie',
      otherKey: 'id_collaborator'
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



