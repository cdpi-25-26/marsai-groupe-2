'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE users MODIFY COLUMN known_by_mars_ai ENUM('Par un ami','Vu une publicité du festival','Via le site internet ou application de l\\'IA') NULL"
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE users MODIFY COLUMN known_by_mars_ai ENUM('YES','NO') NULL"
    );
  }
};
