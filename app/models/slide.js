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
      this.belongsTo(models.presentation, {
        foreignKey: "presentationId",
        as: "Presentation",
        constraints: false,
      });

      this.belongsTo(models.slidetype, {
        foreignKey: "typeId",
        as: "SlideType",
        constraints: false,
      });

      this.belongsTo(models.multiplechoice, {
        foreignKey: "contentId",
        as: "MultipleChoice",
        constraints: false,
      });
      this.belongsTo(models.heading, {
        foreignKey: "contentId",
        as: "Heading",
        constraints: false,
      });
      this.belongsTo(models.paragraph, {
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
      modelName: "slide",
    }
  );
  return Slide;
};
