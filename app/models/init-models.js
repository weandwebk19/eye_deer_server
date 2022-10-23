const {DataTypes } = require('sequelize');
const userModel = require('./user');
const roleModel = require('./role');

function initModels(sequelize) {
    const user = userModel(sequelize, DataTypes);
    const role = roleModel(sequelize, DataTypes);

    return  {
        user,
        role
    }
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;