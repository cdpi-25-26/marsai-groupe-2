const Evenement = (sequelize, DataTypes) => {
  const Evenement = sequelize.define('Evenement', {
    id_evenement: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nom: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_debut: DataTypes.DATE,
    date_fin: DataTypes.DATE,
    lieu: DataTypes.STRING
  }, {});

  Evenement.associate = function(models) {
    Evenement.hasMany(models.Reservation, {
      foreignKey: 'id_evenement'
    });
  };

  return Evenement;
};
export default Evenement;