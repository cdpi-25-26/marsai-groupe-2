'use strict';

export default (sequelize, DataTypes) => {
  const VoteHistory = sequelize.define('VoteHistory', {
    id_vote_history: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_vote: {
      type: DataTypes.INTEGER,
      allowNull: false
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
  }, {
    tableName: 'vote_histories',
    timestamps: true
  });

  VoteHistory.associate = function(models) {
    VoteHistory.belongsTo(models.Vote, {
      foreignKey: 'id_vote'
    });
    VoteHistory.belongsTo(models.User, {
      foreignKey: 'id_user'
    });
    VoteHistory.belongsTo(models.Movie, {
      foreignKey: 'id_movie',
      targetKey: 'id_movie'
    });
  };

  return VoteHistory;
};
