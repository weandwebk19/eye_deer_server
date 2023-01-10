"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("paragraphs", [
      {
        id: 1,
        slideId: 3,
        heading: "Paragraph",
        paragraph: "What is your favorite subject? paragraph",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("paragraphs", null, {});
  },
};
