'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGamesBiodata extends Model {
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
  UserGamesBiodata.init({
    user_id: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    place_of_birth: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'user_games_biodata',
    modelName: 'UserGamesBiodata',
  });
  return UserGamesBiodata;
};