const groupService = require('./groupService');
class GroupController {

    // [GET] /group/:id/members/total
    totalMembers = async function(req, res) {
        const groupId = req.params.groupId;
        if(groupId === undefined) {
            res.status(404).json("Group not found");
            return;
        }
        const total = await groupService.getTotalMembers(groupId)
        .catch(err => {
            res.status(500).json(err.message);
            return;
        });

        res.status(200).json(total);
    }

    // [POST] /group/:id/join
    joinTheGroup = async function(req, res) {
        const user = req.user;
        const groupId = req.params.id;
        //Check if the user is exists
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
                data: {groupId}
              }
            )
        }
        //Check if the group is exists
        if (!groupId) {
            res.status(404).json({
                success: false,
                message: "Group not found",
                data: {groupId}
              }
            )
        }

        //Add user to group
        const groupUser = await groupService.addUserToGroup(groupId, user.id)
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "An error occurred while adding user",
                data: {groupId}
              }
            );
            return;
        });

        //Add user to group successfully
        res.status(201).json({
            success: true,
            message: "Add user to group successfully",
            data: groupUser
          }
        );
    }
}

module.exports = new GroupController;