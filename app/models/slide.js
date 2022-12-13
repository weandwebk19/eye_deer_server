"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Slide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Presentation, {
        foreignKey: "presentationId",
        as: "Presentation",
        constraints: false,
      });

      this.hasOne(models.SlideType, {
        foreignKey: "typeId",
        as: "SlideType",
        constraints: false,
      });

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
  Slide.init(
    {
      name: DataTypes.STRING,
      index: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      customizeId: DataTypes.INTEGER,
      presentationId: DataTypes.INTEGER,
      contentId: DataTypes.INTEGER,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Slide",
    }
  );
  return Slide;
};
