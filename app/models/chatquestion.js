"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatQuestion.init(
    {
      presentationId: DataTypes.INTEGER,
      userId: DataTypes.UUID,
      content: DataTypes.STRING,
      upvote: DataTypes.INTEGER,
      isAnswered: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "chatquestion",
    }
  );
  return ChatQuestion;
};
