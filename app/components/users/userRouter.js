const express = require("express");
const authMiddleware = require("../auth/authMiddleware");
const router = express.Router();
const userController = require("./userController");
const upload = require("../../utils/multer");

//Get a user by username or email or firstName or lastName or id
router.get("/", function (req, res, next) {
  userController.getUser(req, res);
});

router.get("/verify-status", function (req, res, next) {
  userController.verifyStatus(req, res);
});

//Search users by username or email or firstName
router.get("/search/items", function (req, res, next) {
  userController.getSearchUser(req, res);
});

//Get all groups user owned
router.get("/:id/groups/owned", function (req, res, next) {
  userController.ownedGroups(req, res);
});

//Get all groups user joined
router.get("/:id/groups/joined", function (req, res, next) {
  userController.joinedGroups(req, res);
});

//get user info by username
router.get("/profile/:username", userController.getUserByUsername);

//post use info to update profile
router.post(
  "/profile/:username",
  upload.single("avatarFile"),
  userController.updateProfileUser
);

// [POST] /users/verify/email/send
router.get("/verify/email/send", function (req, res, next) {
  userController.reSendVerifyEmail(req, res);
});

module.exports = router;
