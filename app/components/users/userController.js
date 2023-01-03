const userService = require("./userService");
const bcrypt = require("bcrypt");
const uploadImage = require("../../utils/cloudinary");
const groupService = require("../groups/groupService");
const authService = require("../auth/authService");
class UserController {
  //[GET] /users?username={username}&email={email}....
  getUser = async (req, res) => {
    const query = req.query;
    if (query !== undefined) {
      const user = await userService.getUsers(query);
      res.status(200).json(user);
    } else {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    }
  };

  //[GET] /users/search/items?term={term}
  getSearchUser = async (req, res) => {
    const query = req.query;
    if (query.term !== undefined) {
      const term = query.term;
      const users = await userService.getSearchUsers(term);
      res.status(200).json(users);
    } else {
      res.status(400).json("Users not found");
    }
  };

  getUserByUsername = async (req, res) => {
    const params = req.params;
    if (params.username !== undefined) {
      const user = await userService.getUserByUsername(params.username);
      res.status(200).json(user);
    } else {
      res.status(404);
    }
  };

  //[POST] /users/profile/:username
  updateProfileUser = async (req, res) => {
    try {
      const [username, password] = [
        req.params.username,
        req.body.currentPassword,
      ];

      //check user
      const user = await userService.getUserByUsername(username);
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        res
          .status(401)
          .json({ success: false, message: "Password incorrect!" });
        return;
      }

      //save avatar
      const avatarLink = req.file ? await uploadImage(req.file.path) : null;

      //udpate profile user
      const userInfo = { ...req.body, avatarLink };
      await userService.updateProfileUser(username, userInfo);

      res.status(200).json({ success: true, message: "Update successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error!" });
    }
  };

  // [GET] users/:id/groups/owned
  ownedGroups = async function (req, res) {
    try{
      const userId = req.user.id;

      const groups = await groupService.getListOwnedGroup(userId);

      res.status(200).json({
        success: true,
        message: "Get successfully",
        data: {groups}
      })
    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: true,
        message: "Server error",
      })
    }
  };

  // [GET] users/:id/groups/joined
  joinedGroups = async function (req, res) {
    const userId = req.params.id;
    if (userId === undefined) {
      res.status(404).json("User not found");
      return;
    }
    const groups = await groupService
      .getListJoinedGroup(userId)
      .catch((err) => {
        res.status(500).json(err.message);
        return;
      });

    res.status(200).json(groups);
  };

  // [POST] /users/verify/email/send
  reSendVerifyEmail = async (req, res) => {
    try {
      const user = req.user;
      const email = user?.email;
      const userId = user?.id;
      await authService.sendVerifyEmail(email, userId);
      return res.status(200).json({
        success: true,
        message: "Send verification email successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  //[GET] /users/verify-status
  verifyStatus = async (req, res) => {
    try {
      const user = req.user;
      if (user !== undefined) {
        const status = await userService.getVerifyStatus(user.id);
        res.status(200).json(status);
      } else {
        res.status(404).json("User not found");
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };
}

module.exports = new UserController();
