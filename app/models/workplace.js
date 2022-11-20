'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Workplace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.hasMany(models.User, {
      //   foreignKey: 'workplaceId',
      //   as: 'Workplace_User_FK'
      // });
    }
  }
  Workplace.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Workplace',
  });
  return Workplace;
};