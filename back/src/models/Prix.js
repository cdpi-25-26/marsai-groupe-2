'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prix = sequelize.define('Prix', {
    id_prix: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    id_film: DataTypes.INTEGER,
    prix: DataTypes.DECIMAL(10, 2)
  }, {});
  
  Prix.associate = function(models) {
    Prix.belongsTo(models.Film, {
      foreignKey: 'id_film'
    });
  };
  
  return Prix;
};