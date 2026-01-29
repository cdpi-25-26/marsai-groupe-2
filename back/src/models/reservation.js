'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    id_reservation: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    id_evenement: DataTypes.INTEGER,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    nombre_places: DataTypes.INTEGER,
    date_reservation: DataTypes.DATE
  }, {});
  
  Reservation.associate = function(models) {
    Reservation.belongsTo(models.Evenement, {
      foreignKey: 'id_evenement'
    });
  };
  
  return Reservation;
};