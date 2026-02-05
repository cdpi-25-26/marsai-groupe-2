
'use strict';

export default (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    id_vote: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_movie: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note:  DataTypes.ENUM('YES', 'NO', 'TO DISCUSS'),
    comments: DataTypes.TEXT
  }, 
  {
    tableName: 'votes',
    timestamps: true
  });

  Vote.associate = function(models) {
    Vote.belongsTo(models.User, {
      foreignKey: 'id_user'
    });

    Vote.belongsTo(models.Movie, {
      foreignKey: 'id_movie'
    });
  };

  return Vote;
};
