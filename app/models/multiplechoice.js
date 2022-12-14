"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MultipleChoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MultipleChoice.init(
    {
      question: DataTypes.STRING,
      image: DataTypes.STRING,
      layoutId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MultipleChoice",
    }
  );
  return MultipleChoice;
};
