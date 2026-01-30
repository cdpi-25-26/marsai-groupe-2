
'use strict';

export default (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'categories',
    timestamps: true
  });

  Categorie.associate = function(models) {
    Categorie.belongsToMany(models.Movie, {
      through: 'movies_categories',
      foreignKey: 'id_categorie',
      otherKey: 'id_movie'
    });
  };

  return Categorie;
};
