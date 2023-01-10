"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("group_presentations", [
      {
        presentationId: 1,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        presentationId: 2,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("group_presentations", null, {});
  },
};
