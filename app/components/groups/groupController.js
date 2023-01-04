const uploadImage = require("../../utils/cloudinary");
const groupService = require("./groupService");
const userService = require("../users/userService");
const sendEmail = require("../../utils/sendVerifyEmail");
const jwt = require("jsonwebtoken");
const { getRole } = require("./groupService");

class GroupController {
  //[GET] /groups/:id
  groupInfo = async function (req, res) {
    const groupId = req.params.id;
    if (groupId === undefined) {
      res.status(404).json("Group not found");
      return;
    }
    const info = await groupService.getGroupById(groupId);
    res.status(200).json(info);
  };

  // [GET] /groups/:id/members/total
  totalMembers = async function (req, res) {
    const groupId = req.params.groupId;
    if (groupId === undefined) {
      res.status(404).json("Group not found");
      return;
    }
    const total = await groupService.getTotalMembers(groupId).catch((err) => {
      res.status(500).json(err.message);
      return;
    });

    res.status(200).json(total);
  };

  // [GET] /groups/:id/members
  listMembers = async function (req, res) {
    const groupId = req.params.id;
    if (groupId === undefined) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
        data: [],
      });
    }

    try {
      const members = await groupService.getListMembers(groupId);

      return res.status(200).json({
        success: true,
        message: "Get list members of group " + groupId + " successfully",
        data: members,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
        data: [],
      });
    }
  };

  // [GET] /groups/:id/presentations
  listPresentations = async function (req, res) {
    const groupId = req.params.id;
    if (groupId === undefined) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
        data: [],
      });
    }

    try {
      const presentations = await groupService.getListPresentations(groupId);

      return res.status(200).json({
        success: true,
        message:
          "Get list presentations of group " + groupId + " successfully.",
        data: presentations,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
        data: [],
      });
    }
  };

  // [POST] /groups/:id/join
  joinTheGroup = async function (req, res) {
    const user = req.user;
    const groupId = req.params.id;
    //Check if the user is exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: { groupId },
      });
    }
    //Check if the group is exists
    if (!groupId) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
        data: { groupId },
      });
    }

    try {
      // Check user is joined group
      const isJoined = await groupService.isJoinedGroup(groupId, user.userId);
      console.log(isJoined);
      if (isJoined) {
        return res.status(406).json({
          success: false,
          message: "You have already joined this group",
          data: { groupId },
        });
      }

      //Add user to group
      const groupUser = await groupService.addUserToGroup(groupId, user.id);

      //Add user to group successfully
      return res.status(201).json({
        success: true,
        message: "Join the group successfully",
        data: groupUser,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding user",
        data: { groupId },
      });
    }
  };

  // [POST] /groups/create
  createGroup = async function (req, res) {
    try {
      //upload image to cloudinary
      const urlPicture = req.file ? await uploadImage(req.file.path) : null;

      //receive data
      const groupInfo = {
        name: req.body.name,
        capacity: req.body.capacity,
        status: req.body.status,
        description: req.body.description,
        picture: urlPicture,
        userId: req.body.userId,
      };

      console.log(groupInfo);
      //create new group
      const groupId = await groupService.createGroup(groupInfo);

      res
        .status(200)
        .json({ success: true, message: "Success!", groupId: groupId });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Server error!" });
    }
  };

  // [POST] /group/create
  inviteMember = async function (req, res) {
    try {
      //get info
      const user = req.user;
      const groupId = req.params.id;
      const memberId = req.body.memberId;

      //check is member user?
      const member = await userService.getUserById(memberId);
      if (!member) {
        res
          .status(422)
          .json({ success: false, message: "Member is not exists!" });
        return;
      }

      //get user info
      const userInfo = await userService.getUserById(user.id);

      //generate token to verify who join group, expire token is 7 days
      const token = jwt.sign(
        { groupId: groupId, memberId: memberId },
        process.env.JWT_ACCESS_KEY
      );

      //send email to member
      const subject = "[Eye Deer] - Join Group";
      const content = `${userInfo.lastName} ${userInfo.firstName}(${userInfo.email}) has invited you join to their group.<br>Click below button to join this group!`;
      const link = `${process.env.FRONTEND_BASE_URL}/groups/invite/${token}`;
      await sendEmail(member.email, subject, content, link);

      //return
      res.status(200).json({ success: true, message: "Success!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Server error!" });
    }
  };

  addMemberFromToken = async function (req, res) {
    try {
      //get token
      const token = req.params.token;

      //decode and get info
      const info = jwt.verify(token, process.env.JWT_ACCESS_KEY, {
        expiresIn: "7d",
      });
      console.log(info);

      //add member to group
      await groupService.addUserToGroup(info.groupId, info.memberId);

      //return
      res
        .status(200)
        .json({ success: true, message: "Success!", groupId: info.groupId });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Server error!" });
    }
  };

  // [GET] /groups/:id/owner
  ownerInfo = async function (req, res) {
    const groupId = req.params.id;
    if (groupId === undefined) {
      return res.status(404).json({
        success: false,
        message: "Group is wrong",
        data: {},
      });
    }

    try {
      const owner = await groupService.getOwner(groupId);

      return res.status(200).json({
        success: true,
        message: "Get owner of group " + groupId + " successfully",
        data: owner,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
        data: {},
      });
    }
  };

  // [GET] /groups/:id/co-owner
  listCoOwners = async function (req, res) {
    const groupId = req.params.id;
    if (groupId === undefined) {
      return res.status(404).json({
        success: false,
        message: "Group is wrong",
        data: [],
      });
    }

    try {
      const owners = await groupService.getlistCoOwners(groupId);

      return res.status(200).json({
        success: true,
        message: "Get co-owners of group " + groupId + " successfully",
        data: owners,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
        data: [],
      });
    }
  };

  // [POST] /groups/:id/co-owner/terminate
  terminateCoOwner = async function (req, res) {
    const groupId = req.params.id;
    const userId = req.params.userId;
    if (groupId === undefined) {
      return res.status(404).json({
        success: false,
        message: "Group is wrong",
      });
    }

    if (userId === undefined) {
      return res.status(404).json({
        success: false,
        message: "User is wrong",
      });
    }

    try {
      const role = await groupService.getRole(groupId, userId);
      if (role !== 2) {
        return res.status(406).json({
          success: false,
          message: "This user is not co-owner",
        });
      }
      await groupService.changeRole(groupId, userId, 3);

      return res.status(200).json({
        success: true,
        message: "Terminate co-owners of group successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [POST] /groups/:id/co-owner/assign
  assignCoOwner = async function (req, res) {
    const groupId = req.params.id;
    const userId = req.params.userId;
    if (groupId === undefined) {
      return res.status(404).json({
        success: false,
        message: "Group is wrong",
      });
    }

    if (userId === undefined) {
      return res.status(404).json({
        success: false,
        message: "User is wrong",
      });
    }

    try {
      const role = await groupService.getRole(groupId, userId);
      if (role === 2) {
        return res.status(406).json({
          success: false,
          message: "The co-ownership has been already assigned for this user.",
        });
      }
      await groupService.changeRole(groupId, userId, 2);

      return res.status(200).json({
        success: true,
        message: "Successfully assigned.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [DELETE] /groups/:id/members/:userId/kickout
  kickOutMember = async function (req, res) {
    const groupId = req.params.id;
    const userId = req.params.userId;
    if (groupId === undefined) {
      return res.status(404).json({
        success: false,
        message: "Group is wrong",
      });
    }

    if (userId === undefined) {
      return res.status(404).json({
        success: false,
        message: "User is wrong",
      });
    }

    try {
      // Check user is joined group
      const isJoined = await groupService.isJoinedGroup(groupId, userId);
      if (!isJoined) {
        return res.status(406).json({
          success: false,
          message: "This user has not joined group yet",
        });
      }

      await groupService.removeMember(groupId, userId);

      return res.status(200).json({
        success: true,
        message: "Remove member out of group successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  getRoleInGroup = async (req, res) => {
    try{
      const userId = req.user.id;
      const groupId = req.params.id;

      const roleType = await groupService.getRole(groupId, userId);
      res.status(200).json({
        success: true,
        message: "Get role successfully",
        data: {roleType},
      })
    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      })
    }
  }

  addPresentationToGroup = async (req, res) => {
    try{
      const {groupId, presentationId} = req.body;
      const status = await groupService.addPresentationToGroup(groupId, presentationId);

      if(!status){
        res.status(400).json({
          success: false,
          message: "Presentation is already in group"
        })

        return;
      }
      
      res.status(200).json({
        success: true,
        message: "Add presentation successfully",
      })
    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      })
    }
  }

  removeGroup = async (req, res) => {
    try{
      const {groupId} = req.body;
      await groupService.removeGroup(groupId);
      
      res.status(200).json({
        success: true,
        message: "Remove successfully",
      })
    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      })
    }
  }
}

module.exports = new GroupController();
