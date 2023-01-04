"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association
      this.belongsToMany(models.User, {
        through: "Group_User",
        foreignKey: "groupId",
        otherKey: "userId",
        as: "Group",
        constraints: false,
      });
      this.belongsToMany(models.Presentation, {
        through: "Group_Presentation",
        foreignKey: "groupId",
        otherKey: "presentationId",
        as: "GroupPresentation",
        constraints: false,
      });
    }
  }
  Group.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
      capacity: DataTypes.INTEGER,
      picture: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Group",
    }
  );
  return Group;
};
