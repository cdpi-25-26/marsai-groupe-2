
'use strict';

export default (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id_event: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING(255),
    description: DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    location: DataTypes.STRING(255),
    event_type: DataTypes.ENUM('CONFERENCE', 'WORKSHOP', 'MEETUP', 'WEBINAR'),
  }, {
    tableName: 'events',
    timestamps: true
  });

  Event.associate = function(models) {
    Event.hasMany(models.Reservation, {
      foreignKey: 'id_event'
    });
  };

  return Event;
};
