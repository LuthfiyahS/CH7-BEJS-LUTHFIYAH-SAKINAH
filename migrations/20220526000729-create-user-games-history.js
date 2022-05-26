'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_games_history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {        
          model: 'user_games',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      score: {
        type: Sequelize.INTEGER
      },
      session_start: {
        type: Sequelize.DATE
      },
      session_end: {
        type: Sequelize.DATE
      },
      playtime: {
        type: Sequelize.TIME
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_games_history');
  }
};