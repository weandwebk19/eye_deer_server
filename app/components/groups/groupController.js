const uploadImage = require('../../utils/cloudinary');
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

    // [POST] /group/create
    createGroup = async function(req, res) {
        try{
            //upload image to cloudinary
            const urlPicture = req.file ? await uploadImage(req.file.path) : null;

            //receive data
            const groupInfo = {
                name: req.body.name, 
                capacity: req.body.capacity,
                status: req.body.status,
                description: req.body.description,
                picture: urlPicture,
                userId: req.body.userId
            };

            console.log(groupInfo);
            //create new group
            const groupId = await groupService.createGroup(groupInfo);

            res.status(200).json({success: true, message: "Success!", groupId: groupId});
        }
        catch(error){
            console.log(error);
            return res.status(500).json({success:false, message: "Server error!"})
        }
    }
}

module.exports = new GroupController;