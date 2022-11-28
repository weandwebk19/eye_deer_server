const uploadImage = require("../../utils/cloudinary");
const groupService = require("./groupService");
const userService = require("../users/userService");
const sendEmail = require("../../utils/sendVerifyEmail");
const jwt = require('jsonwebtoken');

class GroupController {
  // [GET] /group/:id/members/total
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

  // [POST] /group/:id/join
  joinTheGroup = async function (req, res) {
    const user = req.user;
    const groupId = req.params.id;
    //Check if the user is exists
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: { groupId },
      });
    }
    //Check if the group is exists
    if (!groupId) {
      res.status(404).json({
        success: false,
        message: "Group not found",
        data: { groupId },
      });
    }

    //Add user to group
    const groupUser = await groupService
      .addUserToGroup(groupId, user.id)
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "An error occurred while adding user",
          data: { groupId },
        });
      });

    //Add user to group successfully
    res.status(201).json({
      success: true,
      message: "Add user to group successfully",
      data: groupUser,
    });
  };

  // [POST] /group/create
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
      if(!member){
        res.status(422).json({success: false, message:  "Member is not exists!"});
        return;
      }

      //get user info
      const userInfo = await userService.getUserById(user.id);
      
      //generate token to verify who join group, expire token is 7 days
      const token = jwt.sign({groupId: groupId, memberId: memberId}, process.env.JWT_ACCESS_KEY);

      //send email to member
      const subject = "[Eye Deer] - Join Group";
      const content = `${userInfo.lastName} ${userInfo.firstName}(${userInfo.email}) has invited you join to their group.<br>Click below button to join this group!`;
      const link = `${process.env.FRONTEND_BASE_URL}/group/invite/${token}`;
      await sendEmail(member.email, subject, content, link);

      //return
      res
        .status(200)
        .json({ success: true, message: "Success!"});
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
      const info = jwt.verify(token, process.env.JWT_ACCESS_KEY, { expiresIn: "7d" });
      console.log(info);

      //add member to group
      await groupService.addUserToGroup(info.groupId, info.memberId);

      //return
      res.status(200).json({ success: true, message: "Success!", groupId: info.groupId });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Server error!" });
    }
  };
}

module.exports = new GroupController();
