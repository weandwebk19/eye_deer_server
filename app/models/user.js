'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.OAuth_Account, {
        foreignKey: 'id',
        as: 'OAuth_Account_User_FK'
      });
    }
  }
  User.init({
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    address: DataTypes.STRING,
    birthday: DataTypes.DATE,
    phone: DataTypes.STRING,
    picture: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    workplaceId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};