"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("slides", [
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
      {
        name: "Slide 2",
        index: 2,
        typeId: 2,
        presentationId: 1,
        contentId: 1,
        note: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Slide 3",
        index: 3,
        typeId: 3,
        presentationId: 1,
        contentId: 1,
        note: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("slides", null, {});
  },
};
