'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGamesHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.UserGames, {foreignKey: 'user_id', as: 'user'})
    }
  }
  UserGamesHistory.init({
    user_id: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    session_start: DataTypes.DATE,
    session_end: DataTypes.DATE,
    playtime: DataTypes.TIME
  }, {
    sequelize,
    tableName: 'user_games_history',
    modelName: 'UserGamesHistory',
  });
  return UserGamesHistory;
};