'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE movies MODIFY COLUMN selection_status ENUM('submitted','assigned','to_discuss','candidate','awarded','refused','selected','finalist') NOT NULL DEFAULT 'submitted'"
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE movies MODIFY COLUMN selection_status ENUM('submitted','refused','to_discuss','selected','finalist') NOT NULL DEFAULT 'submitted'"
    );
  }
};
