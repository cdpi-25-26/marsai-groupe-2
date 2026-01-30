
'use strict';

export default (sequelize, DataTypes) => {
  const Award = sequelize.define('Award', {
    id_award: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_movie: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    award_name: DataTypes.STRING(100)
  }, {
    tableName: 'awards',
    timestamps: true
  });

  Award.associate = function(models) {
    Award.belongsTo(models.Movie, {
      foreignKey: 'id_movie'
    });
  };

  return Award;
};
