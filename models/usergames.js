'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGames extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.RoleUser, {foreignKey: 'role_id', as: 'role'})
      this.hasOne(models.UserGamesBiodata, {foreignKey: 'user_id', as: 'biodata'})
      this.hasMany(models.UserGamesHistory, {foreignKey: 'user_id', as: 'history'})
    }
  }
  UserGames.init({
    uid: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    profil: DataTypes.STRING,
    video: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'user_games',
    modelName: 'UserGames',
  });
  return UserGames;
};