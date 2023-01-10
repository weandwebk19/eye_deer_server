"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association
      this.belongsTo(models.group, {
        foreignKey: "groupId",
        as: "Group",
        constraints: false,
      });
      this.belongsTo(models.user, {
        foreignKey: "userId",
        as: "User",
        constraints: false,
      });
    }
  }
  Group_User.init(
    {
      userId: DataTypes.UUID,
      groupId: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "group_user",
    }
  );
  return Group_User;
};
