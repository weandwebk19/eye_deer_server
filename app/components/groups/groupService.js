const { raw } = require("express");
const db = require("../../models");
const models = db.sequelize.models;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");
const Op = db.Sequelize.Op;

class GroupService {
  getGroupById = async (groupId) => {
    const group = await models.Group.findOne({
      raw: true,
      where: {
        id: groupId,
      },
    });

    const totalMember = await this.getTotalMembers(groupId);

    const res = {
      ...group,
      totalMember,
    };
    return res;
  };

  getListOwnedGroup = async (userId) => {
    const sqlGetDBName = "select database() as DBName;";
    const DBName = (
      await sequelize.query(sqlGetDBName, { type: QueryTypes.SELECT })
    )[0].DBName;

    const sql = `select ${DBName}.groups.*, count(group_users.userId) as totalMembers
      from (select * from group_users where group_users.userId = '${userId}' and group_users.roleId = 1) as gr
      join ${DBName}.groups on gr.groupId = ${DBName}.groups.id
      join group_users on gr.groupId = group_users.groupId
      where ${DBName}.groups.deletedAt is null
      group by gr.groupId`;

    const groups = await sequelize.query(sql, { type: QueryTypes.SELECT });

    return groups;
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
          where: {
            deletedAt: null,
          },
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
          attributes: { exclude: ["password"] },
        },
      ],
      where: {
        groupId: groupId,
        roleId: { [Op.and]: [{ [Op.ne]: 1 }, { [Op.ne]: 2 }] },
      },
      raw: false,
    });
    const membersResponse = members.map((member) => {
      return member.User;
    });
    return membersResponse;
  };

  getListPresentations = async (groupId) => {
    // query with sequelize model
    // const presentations = await models.Group_Presentation.findAll({
    //   attributes: [],
    //   include: [
    //     {
    //       model: models.Presentation,
    //       as: "Presentation",
    //     },
    //   ],
    //   where: {
    //     groupId: groupId,
    //   },
    //   raw: false,
    // });
    // const presentationsResponse = presentations.map((presentation) => {
    //   return presentation.Presentation;
    // });
    // return presentationsResponse;

    //query with sql
    const sql = `select presentations.*,  count(slides.id) as slides
      from group_presentations join presentations on group_presentations.presentationId = presentations.id
      left join slides on presentations.id = slides.presentationId
      where group_presentations.groupId = ${groupId} and presentations.deletedAt is null
      group by presentations.id`;

    const presentations = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return presentations;
  };

  isJoinedGroup = async (groupId, userId) => {
    const count = await models.Group_User.count({
      where: {
        groupId: groupId,
        userId: userId,
      },
    }).catch((err) => {
      return false;
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

  getOwner = async (groupId) => {
    const owner = await models.Group_User.findOne({
      where: { groupId: groupId, roleId: 1 },
      include: [
        {
          model: models.User,
          as: "User",
          attributes: { exclude: ["password"] },
        },
      ],
      raw: false,
    });
    return owner.User;
  };

  getlistCoOwners = async (groupId) => {
    const coOwners = await models.Group_User.findAll({
      where: { groupId: groupId, roleId: 2 },
      include: [
        {
          model: models.User,
          as: "User",
          attributes: { exclude: ["password"] },
        },
      ],
      raw: false,
    });
    const coOwnersResponse = coOwners.map((coOwner) => {
      return coOwner.User;
    });
    return coOwnersResponse;
  };

  getRole = async (groupId, userId) => {
    try {
      const groupUser = await models.Group_User.findOne({
        attributes: ["roleId"],
        where: { groupId: groupId, userId: userId },
        raw: false,
      });
      return groupUser.roleId;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  changeRole = async (groupId, userId, role) => {
    try {
      const groupUser = await models.Group_User.update(
        { roleId: role },
        { where: { groupId: groupId, userId: userId } }
      );
      return groupUser;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  removeMember = async (groupId, userId) => {
    try {
      const groupUser = await models.Group_User.destroy({
        where: { groupId: groupId, userId: userId },
        force: true,
      });
      return groupUser;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  addPresentationToGroup = async (groupId, presentationId) => {
    try {
      const presentation = await models.Group_Presentation.findOne({
        raw: true,
        where: {
          groupId,
          presentationId,
        },
      });
      if (presentation) {
        return false;
      }

      await models.Group_Presentation.create({
        groupId,
        presentationId,
      });

      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  removeGroup = async (groupId) => {
    await models.Group.destroy({
      where: { id: groupId },
    });
  };
}

module.exports = new GroupService();
