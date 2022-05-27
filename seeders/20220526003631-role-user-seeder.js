'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const role = [
      {
        name: 'ADMIN',
        description: 'Can View All Data Privilege',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'USER',
        description: 'Can View Her/His Data Privilege',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    queryInterface.bulkInsert('role_user', role, {} );
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('role_user', null, {});
  }
};
