'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    registrationDate: DataTypes.DATE
  }, {});

  User.associate = function(models) {
    User.hasMany(models.Evaluation, {
      foreignKey: 'userId'
    });
  };

  return User;
};