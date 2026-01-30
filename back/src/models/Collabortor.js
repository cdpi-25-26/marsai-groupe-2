
'use strict';

export default (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
    id_collaborator: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: DataTypes.STRING(150),
    lastname: DataTypes.STRING(150),
    job: DataTypes.STRING(100)
  }, {
    tableName: 'collaborators',
    timestamps: true
  });

  Collaborator.associate = function(models) {
    Collaborator.belongsToMany(models.Movie, {
      through: 'collaborator_movies',
      foreignKey: 'id_collaborator',
      otherKey: 'id_movie'
    });
  };

  return Collaborator;
};



