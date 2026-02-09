'use strict';

export default (sequelize, DataTypes) => {

  const MovieJury = sequelize.define('MovieJury', {

    id_movie_jury: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_movie: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {
    tableName: 'movies_juries',
    timestamps: true
  });

  return MovieJury;
};
