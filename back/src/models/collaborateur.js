'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collaborateur = sequelize.define('Collaborateur', {
    id_collaborateur: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    profession: DataTypes.STRING
  }, {});
  
  Collaborateur.associate = function(models) {
    Collaborateur.belongsToMany(models.Film, {
      through: 'Collaborateur_Films',
      foreignKey: 'id_collaborateur',
      otherKey: 'id_film'
    });
  };
  
  return Collaborateur;
};