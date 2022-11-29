"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Group_Users", [
      {
        userId: "8088aa7e-c24d-4b74-9a68-012196c87417",
        groupId: 1,
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: "8088aa7e-c24d-4b74-9a68-012196c87418",
        groupId: 1,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: "8088aa7e-c24d-4b74-9a68-012196c87419",
        groupId: 1,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Group_Users", null, {});
  },
};
