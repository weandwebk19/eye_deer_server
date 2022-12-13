"use strict";
const generateCode = require("../utils/generatePresentationCode");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Presentations", [
      {
        name: "My First Presentation",
        userCreated: "8088aa7e-c24d-4b74-9a68-012196c87417",
        code: "123456",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "My Second Presentation",
        userCreated: "8088aa7e-c24d-4b74-9a68-012196c87417",
        code: "123456",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Presentations", null, {});
  },
};
