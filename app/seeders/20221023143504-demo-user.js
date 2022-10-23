'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: '$2b$10$PW9eWtUT0oD6efo2PMOp5OtvzGQQWSv4FhDYLjo3FxaCpOrPg8pGy',
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@example.com',
      address: 'example',
      phone: '09885858585',
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
