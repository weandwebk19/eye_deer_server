"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        //id: uuidv4(),
        id: "8088aa7e-c24d-4b74-9a68-012196c87417",
        username: "admin",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "John",
        lastName: "Doe",
        email: "example@yopmail.com",
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
        username: "prince_rya6",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "Jessie",
        lastName: "Roberts",
        email: "prince_rya6@yopmail.com",
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
        username: "everardo",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "Charles D",
        lastName: "Tyler",
        email: "everardo2006@yopmail.com",
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
        username: "manhnguyen15",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "Manh",
        lastName: "Nguyen",
        email: "manhnguyen15@yopmail.com",
        address: "example",
        phone: "09885858505",
        verifyStatus: true,
        birthDay: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //id: uuidv4(),
        id: "8088aa7e-c24d-4b74-9a68-012196c87421",
        username: "virgo_jensen",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "Virginia Allison",
        lastName: "Henley",
        email: "jensen1994@yopmail.com",
        address: "4855 Winifred Way",
        phone: "09885858505",
        verifyStatus: true,
        birthDay: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //id: uuidv4(),
        id: "8088aa7e-c24d-4b74-9a68-012196c87422",
        username: "krrrrrScott",
        password:
          "$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy",
        firstName: "Kristina D",
        lastName: "Scott",
        email: "wilhelmin10@yopmail.com",
        address: "2510 Emily Renzelli Boulevard",
        phone: "09885858505",
        verifyStatus: true,
        birthDay: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
