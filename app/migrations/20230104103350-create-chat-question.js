"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chatquestions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      presentationId: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
      },
      content: {
        type: Sequelize.STRING,
      },
      upvote: {
        type: Sequelize.INTEGER,
      },
      isAnswered: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("chatquestions");
  },
};
