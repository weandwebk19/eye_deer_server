"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Slides", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      index: {
        type: Sequelize.INTEGER,
      },
      typeId: {
        type: Sequelize.INTEGER,
      },
      customizeId: {
        type: Sequelize.INTEGER,
      },
      presentationId: {
        type: Sequelize.INTEGER,
      },
      contentId: {
        type: Sequelize.INTEGER,
      },
      note: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Slides");
  },
};
