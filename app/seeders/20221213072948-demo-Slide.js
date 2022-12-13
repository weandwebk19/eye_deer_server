"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Slides", [
      {
        name: "Slide 1",
        index: 1,
        typeId: 1,
        presentationId: 1,
        contentId: 1,
        note: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Slides", null, {});
  },
};
