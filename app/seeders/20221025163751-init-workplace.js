"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("workplaces", [
      {
        name: "School",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Higher Education",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "School Administration",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Buisiness",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("workplaces", null, {});
  },
};
