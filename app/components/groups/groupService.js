const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class GroupService {
  getListOwnedGroup = async (userId) => {
    const groups = await models.Group_User.findAll({
      raw: false,
      where: {
        roleId: 1,
        userId: userId,
      },
      include: [
        {
          model: models.Group,
          as: "Group",
        },
      ],
    });
    const groupsResponse = await Promise.all(
      groups.map(async (e) => {
        const totalMembers = await this.getTotalMembers(e.Group.id);
        return {
          id: e.Group.id,
          name: e.Group.name,
          description: e.Group.description,
          status: e.Group.status,
          capacity: e.Group.capacity,
          picture: e.Group.picture,
          totalMembers: totalMembers,
        };
      })
    );

    return groupsResponse;
  };

  getListJoinedGroup = async (userId) => {
    const groups = await models.Group_User.findAll({
      raw: false,
      where: {
        roleId: { [Op.ne]: 1 },
        userId: userId,
      },
      include: [
        {
          model: models.Group,
          as: "Group",
        },
      ],
    });
    const groupsResponse = await Promise.all(
      groups.map(async (e) => {
        const totalMembers = await this.getTotalMembers(e.Group.id);
        return {
          id: e.Group.id,
          name: e.Group.name,
          description: e.Group.description,
          status: e.Group.status,
          capacity: e.Group.capacity,
          picture: e.Group.picture,
          totalMembers: totalMembers,
        };
      })
    );

    return groupsResponse;
  };

  getTotalMembers = async (groupId) => {
    const total = await models.Group_User.count({
      distinct: true,
      col: "userId",
      where: { groupId: groupId },
    });
    return total;
  };

  getListMembers = async (groupId) => {
    const members = await models.Group_User.findAll({
      attributes: [],
      include: [
        {
          model: models.User,
          as: "User",
          attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        },
      ],
      where: { groupId: groupId },
      raw: false,
    });
    const membersResponse = members.map((member) => {
      return member.User;
    });
    return membersResponse;
  };

  isJoinedGroup = async (groupId, userId) => {
    const count = await models.Group_User.count({
      where: {
        groupId: groupId,
        userId: userId,
      },
    }).catch((err) => {
      return true;
    });
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  };

  addUserToGroup = async function (groupId, userId) {
    const groupUser = await models.Group_User.create({
      groupId,
      userId,
      roleId: 3,
    }).catch((err) => {
      return err.message;
    });
    return groupUser;
  };

  createGroup = async (groupInfo) => {
    //insert new record to groups table
    const newGroup = await models.Group.create({
      ...groupInfo,
    });

    //insert new record to group_users table
    await models.Group_User.create({
      userId: groupInfo.userId,
      groupId: newGroup.id,
      roleId: 1,
    });

    //return id group
    return newGroup.id;
  };
}

module.exports = new GroupService();
