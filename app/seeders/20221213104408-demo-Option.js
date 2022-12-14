"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Options", [
      {
        id: 1,
        contentId: 1,
        content: "Vote 1",
        vote: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        contentId: 1,
        content: "Vote 2",
        vote: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Options", null, {});
  },
};
