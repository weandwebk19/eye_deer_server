const db = require('../../models');
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class GroupService {
    getListOwnedGroup = async (userId) => {
        const groups = await models.Group_User.findAll({
            raw: false,
            where: {
                roleId: 1,
                userId: userId
            },
            include: [
                {
                    model: models.Group,
                    as: 'Group',
                }
            ]
        });
        const groupsResponse = await Promise.all(groups.map(async(e) => {
            const amountMember = await this.getTotalMembers(e.Group.id);
            return {
                id: e.Group.id,
                name: e.Group.name,
                description: e.Group.description,
                status: e.Group.status,
                capacity: e.Group.capacity,
                picture: e.Group.picture,
                amountMember: amountMember
            }
        }));

        return groupsResponse;
    }

    getListJoinedGroup = async (userId) => {
        const groups = await models.Group_User.findAll({
            raw: false,
            where: {
                userId: userId
            },
            include: [
                {
                    model: models.Group,
                    as: 'Group',
                }
            ]
        });
        const groupsResponse = await Promise.all(groups.map(async(e) => {
            const amountMember = await this.getTotalMembers(e.Group.id);
            return {
                id: e.Group.id,
                name: e.Group.name,
                description: e.Group.description,
                status: e.Group.status,
                capacity: e.Group.capacity,
                picture: e.Group.picture,
                amountMember: amountMember
            }
        }));

        return groupsResponse;
    }

    getTotalMembers = async (groupId) => {
        const total = await models.Group_User.count({
            distinct: true,
            col: 'userId',
            where: {groupId: groupId}
        })
        return total;
    }

    addUserToGroup = async function(groupId, userId){
        const groupUser = await models.Group_User.create({
            groupId,
            userId,
            roleId: 3
        })
       return groupUser;
    }

    createGroup = async (groupInfo) => {
        //insert new record to groups table
        const newGroup = await models.Group.create(
            {
                ...groupInfo
            }
        );

        //insert new record to group_users table
        await models.Group_User.create(
            {
                userId: groupInfo.userId,
                groupId: newGroup.id,
                roleId: 1
            }
        );

        //return id group
        return newGroup.id;
    }
}

module.exports = new GroupService;