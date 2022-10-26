const workplaceService = require('./workplaceService');
class WorkplaceController {
    //[GET] /workplaces
    list = async function(req, res) {
        const workplaces = await workplaceService.getListWorkplace();
        const workplacesRes = workplaces.map((element) => {
            return {id: element.id, name: element.name}
        });
        res.status(200).json(workplacesRes);
    }
}

module.exports = new WorkplaceController;