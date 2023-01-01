"use strict";
const generateCode = require("../utils/generatePresentationCode");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Presentations", [
      {
        id: 1,
        name: "My First Presentation",
        userCreated: "8088aa7e-c24d-4b74-9a68-012196c87417",
        code: "123456",
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "My Second Presentation",
        userCreated: "8088aa7e-c24d-4b74-9a68-012196c87417",
        code: "123457",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Presentations", null, {});
  },
};
