'use strict';
module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    evaluationId: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    filmId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    comment: DataTypes.TEXT
  }, {});

  Evaluation.associate = function(models) {
    Evaluation.belongsTo(models.Film, {
      foreignKey: 'filmId'
    });
    Evaluation.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };

  return Evaluation;
};