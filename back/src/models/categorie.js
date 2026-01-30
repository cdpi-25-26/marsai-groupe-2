const Categorie = (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id_categorie: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nom: DataTypes.STRING
  }, {});

  Categorie.associate = function(models) {
    // Associations (relations) here
    Categorie.belongsToMany(models.Film, {
      through: 'Film_Categories',
      foreignKey: 'id_categorie',
      otherKey: 'id_film'
    });
  };

  return Categorie;
};
export default Categorie;