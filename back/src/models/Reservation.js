
'use strict';

export default (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    id_reservation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_event: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_name: DataTypes.STRING(100),
    last_name: DataTypes.STRING(100),
    email: DataTypes.STRING(255),
    number_seats: DataTypes.INTEGER,
    reservation_date: DataTypes.DATE
  }, {
    tableName: 'reservations',
    timestamps: true
  });

  Reservation.associate = function(models) {
    Reservation.belongsTo(models.Event, {
      foreignKey: 'id_event'
    });
  };

  return Reservation;
};
