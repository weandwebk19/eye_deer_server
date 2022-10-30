const db = require('../../models');
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class RoleService {
    getListRole = async () => {
        const roles = await models.Role.findAll({
            raw: true
        });
        return roles;
    }
}

module.exports = new RoleService;