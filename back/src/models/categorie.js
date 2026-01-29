'use strict';
module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id_categorie: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nom: DataTypes.STRING
  }, {});
  
  Categorie.associate = function(models) {
    // Les associations (relations) ici
    Categorie.belongsToMany(models.Film, {
      through: 'Film_Categories',
      foreignKey: 'id_categorie',
      otherKey: 'id_film'
    });
  };
  
  return Categorie;
};