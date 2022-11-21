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
            const amountMember = await this.getAmountMembers(e.Group.id);
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
            const amountMember = await this.getAmountMembers(e.Group.id);
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

    getAmountMembers = async (groupId) => {
        const amount = await models.Group_User.count({
            distinct: true,
            col: 'userId',
            where: {groupId: groupId}
        })
        return amount;
    }
}

module.exports = new GroupService;