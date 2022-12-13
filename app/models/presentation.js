"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Presentation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Group, {
        through: "Group_Presentation",
        foreignKey: "presentationId",
        otherKey: "groupId",
        as: "Presentation",
        constraints: false,
      });
    }
  }
  Presentation.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      userCreated: DataTypes.UUID,
      code: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Presentation",
    }
  );
  return Presentation;
};
