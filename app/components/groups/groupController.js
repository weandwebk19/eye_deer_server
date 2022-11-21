const groupService = require('./groupService');
class GroupController {
    // [GET] /group/owned?userId=123
    ownedGroups = async function(req, res) {
        const userId = req.query.userId;
        if(userId === undefined) {
            res.status(404).json("User not found");
            return;
        }
        const groups = await groupService.getListOwnedGroup(userId)
        .catch(err => {
            res.status(500).json(err.message);
            return;
        });

        res.status(200).json(groups);
    }

    // [GET] /group/joined?userId=123
    joinedGroups = async function(req, res) {
        const userId = req.query.userId;
        if(userId === undefined) {
            res.status(404).json("User not found");
            return;
        }
        const groups = await groupService.getListJoinedGroup(userId)
        .catch(err => {
            res.status(500).json(err.message);
            return;
        });

        res.status(200).json(groups);
    }

    // [GET] /group/members?groupId=xxx
    amountMembers = async function(req, res) {
        const groupId = req.query.groupId;
        if(groupId === undefined) {
            res.status(404).json("Group not found");
            return;
        }
        const amount = await groupService.getAmountMembers(groupId)
        .catch(err => {
            res.status(500).json(err.message);
            return;
        });

        res.status(200).json(amount);
    }
}

module.exports = new GroupController;