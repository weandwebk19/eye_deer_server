const express = require("express");
const router = express.Router();
const groupController = require("./groupController");
const authMiddleware = require("../../components/auth/authMiddleware");
const upload = require("../../utils/multer");

// [GET] /group/:id/members/total
router.get("/:id/members/total", function (req, res, next) {
  groupController.totalMembers(req, res);
});

// [GET] /group/:id/invite/:token group
router.get("/invite/:token", groupController.addMemberFromToken);

// [POST] /group/:id/invite group
router.post("/:id/invite", upload.none(), groupController.inviteMember);

// [POST] /group/:id/join
router.post("/:id/join", function (req, res, next) {
  groupController.joinTheGroup(req, res);
});

// [POST] /group/create group
router.post("/create", upload.single("picture"), groupController.createGroup);

module.exports = router;
