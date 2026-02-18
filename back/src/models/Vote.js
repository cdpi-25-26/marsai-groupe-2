
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
    note: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    modification_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
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
      foreignKey: 'id_movie',
      targetKey: 'id_movie'
    });

    Vote.hasMany(models.VoteHistory, {
      foreignKey: 'id_vote',
      as: 'history'
    });
  };

  return Vote;
};
