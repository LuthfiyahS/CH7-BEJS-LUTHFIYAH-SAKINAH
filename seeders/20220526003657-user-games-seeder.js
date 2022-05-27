'use strict';
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [];
    for (let i = 0; i < 10; i++) {
      let email = 'Pia'+i+Math.floor(Math.random() * 2)+1+'@gmail.com';
      let fullName = 'Pia'+i+Math.floor(Math.random() * 2)+1;
      let password = 'pwd'
      let uid = uuidv4()
      let role = Math.floor(Math.random() * 2)+1;
      data.push({
        uid,
        username: fullName,
        password: bcrypt.hashSync(password, 8),
        email: email,
        role_id:role,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    //console.log(data);
    await queryInterface.bulkInsert('user_games', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_games', null, {});
  }
};
