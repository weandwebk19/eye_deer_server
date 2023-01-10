"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("chatquestions", [
      {
        presentationId: 1,
        userId: "8088aa7e-c24d-4b74-9a68-012196c87417",
        content: "Proffesor, what if æ gets hacked?",
        upvote: 2,
        isAnswered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        presentationId: 1,
        userId: "8088aa7e-c24d-4b74-9a68-012196c87421",
        content: "Does SM’s water taste like water?",
        upvote: 7,
        isAnswered: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        presentationId: 1,
        userId: "8088aa7e-c24d-4b74-9a68-012196c87417",
        content: "Why did kim hyunjin bark jeon heejin awwwww?",
        upvote: 56,
        isAnswered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        presentationId: 1,
        userId: "8088aa7e-c24d-4b74-9a68-012196c87420",
        content: "What’s the weather like today?",
        upvote: 46,
        isAnswered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        presentationId: 1,
        userId: "8088aa7e-c24d-4b74-9a68-012196c87419",
        content: "Have you check out NewJeans’ new song yet?",
        upvote: 5,
        isAnswered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        presentationId: 1,
        userId: "8088aa7e-c24d-4b74-9a68-012196c87421",
        content:
          "How well did they handle unexpected changes or technical difficulties?",
        upvote: 6,
        isAnswered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        presentationId: 1,
        userId: "8088aa7e-c24d-4b74-9a68-012196c87421",
        content: "Can you repeat the last section, please?",
        upvote: 0,
        isAnswered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("chatquestions", null, {});
  },
};
