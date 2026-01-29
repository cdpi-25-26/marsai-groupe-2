'use strict';
module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    id_evaluation: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    id_film: DataTypes.INTEGER,
    id_utilisateur: DataTypes.INTEGER,
    note: DataTypes.FLOAT,
    commentaire: DataTypes.TEXT
  }, {});
  
  Evaluation.associate = function(models) {
    Evaluation.belongsTo(models.Film, {
      foreignKey: 'id_film'
    });
    Evaluation.belongsTo(models.Utilisateur, {
      foreignKey: 'id_utilisateur'
    });
  };
  
  return Evaluation;
};