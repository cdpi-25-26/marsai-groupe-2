'use strict';
module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define('Utilisateur', {
    id_utilisateur: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    telephone: DataTypes.STRING,
    adresse: DataTypes.STRING,
    date_inscription: DataTypes.DATE
  }, {});
  
  Utilisateur.associate = function(models) {
    Utilisateur.hasMany(models.Evaluation, {
      foreignKey: 'id_utilisateur'
    });
  };
  
  return Utilisateur;
};