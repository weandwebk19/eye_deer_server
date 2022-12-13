'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paragraph extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Paragraph.init({
    heading: DataTypes.STRING,
    paragraph: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Paragraph',
  });
  return Paragraph;
};