const db = require('../../models');
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class WorkplaceService {
    getListWorkplace = async () => {
        const workplaces = await models.Workplace.findAll({
            raw: true
        });
        return workplaces;
    }
}

module.exports = new WorkplaceService;