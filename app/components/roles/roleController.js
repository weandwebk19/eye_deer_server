const roleService = require("./roleService");
class RoleController {
  //[GET] /roles
  list = async function (req, res) {
    const roles = await roleService.getListRole();
    const rolesRes = roles.map((element) => {
      return { id: element.id, name: element.name };
    });
    res.status(200).json(rolesRes);
  };
}

module.exports = new RoleController();
