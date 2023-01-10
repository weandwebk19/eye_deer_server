"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserVoted extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserVoted.init(
    {
      presentationId: DataTypes.INTEGER,
      slideId: DataTypes.INTEGER,
      userId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "uservoted",
    }
  );
  return UserVoted;
};
