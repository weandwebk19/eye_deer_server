"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        //id: uuidv4(),
        id: "8088aa7e-c24d-4b74-9a68-012196c87417",
        username: "admin",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "John",
        lastName: "Doe",
        email: "example@example.com",
        address: "example",
        phone: "09885858585",
        verifyStatus: true,
        birthDay: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //id: uuidv4(),
        id: "8088aa7e-c24d-4b74-9a68-012196c87418",
        username: "test",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "Manh",
        lastName: "Nguyen",
        email: "example@gmail.com",
        address: "example",
        phone: "09885858585",
        verifyStatus: true,
        birthDay: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //id: uuidv4(),
        id: "8088aa7e-c24d-4b74-9a68-012196c87419",
        username: "test1",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "Manh",
        lastName: "Nguyen",
        email: "exampletest@gmail.com",
        address: "example",
        phone: "09885858505",
        verifyStatus: true,
        birthDay: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //id: uuidv4(),
        id: "8088aa7e-c24d-4b74-9a68-012196c87420",
        username: "test2",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "Manh",
        lastName: "Nguyen",
        email: "exampletest1234@gmail.com",
        address: "example",
        phone: "09885858505",
        verifyStatus: true,
        birthDay: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
