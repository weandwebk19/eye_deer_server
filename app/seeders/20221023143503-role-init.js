"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("roles", [
      {
        name: "owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "co-owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "member",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
