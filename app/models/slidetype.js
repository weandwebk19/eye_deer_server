"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SlideType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.MultipleChoice, {
        foreignKey: "contentId",
        as: "MultipleChoice",
        constraints: false,
      });
      this.hasOne(models.Heading, {
        foreignKey: "contentId",
        as: "Heading",
        constraints: false,
      });
      this.hasOne(models.Paragraph, {
        foreignKey: "contentId",
        as: "Paragraph",
        constraints: false,
      });
    }
  }
  SlideType.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      contentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SlideType",
    }
  );
  return SlideType;
};
