
'use strict';
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    birth_date: {
      type: DataTypes.DATE,
      allowNull: true
    },

    street: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    postal_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },

    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    country: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    biography: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    job: {
      type: DataTypes.ENUM(
        'ACTOR',
        'DIRECTOR',
        'PRODUCER',
        'WRITER',
        'OTHER'
      ),
      allowNull: true
    },

    portfolio: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    youtube: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    instagram: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    linkedin: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    facebook: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    tiktok: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    known_by_mars_ai: {
      type: DataTypes.ENUM('YES', 'NO'),
      allowNull: true
    },

    role: {
      type: DataTypes.ENUM('ADMIN', 'JURY', 'PRODUCER'),
      allowNull: false,
      defaultValue: 'PRODUCER'
    }

  }, {
    tableName: 'users'
  });

 
  User.associate = function(models) {
    User.hasMany(models.Movie, {
      foreignKey: 'id_user'
    });
    User.hasMany(models.Vote, {
      foreignKey: 'id_user'
    });
  };
  
  return User;
};