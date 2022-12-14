"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group_Presentation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association
      this.belongsTo(models.group, {
        foreignKey: "groupId",
        as: "GroupPresentation",
        constraints: false,
      });
      this.belongsTo(models.presentation, {
        foreignKey: "presentationId",
        as: "Presentation",
        constraints: false,
      });
    }
  }
  Group_Presentation.init(
    {
      groupId: DataTypes.INTEGER,
      presentationId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "group_presentation",
    }
  );
  return Group_Presentation;
};
