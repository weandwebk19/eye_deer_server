"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Option.init(
    {
      contentId: DataTypes.INTEGER,
      content: DataTypes.STRING,
      vote: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "option",
    }
  );
  return Option;
};
