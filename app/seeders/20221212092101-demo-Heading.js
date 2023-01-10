"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("headings", [
      {
        id: 1,
        slideId: 2,
        heading: "Heading",
        subHeading: "What is your favorite subject? subHeading",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("headings", null, {});
  },
};
