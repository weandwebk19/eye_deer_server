const express = require("express");
const router = express.Router();
const groupController = require("./groupController");
const authMiddleware = require("../../components/auth/authMiddleware");
const upload = require("../../utils/multer");

// [GET] /groups/:id/members
router.get("/:id/members", function (req, res, next) {
  groupController.listMembers(req, res);
});

// [GET] /groups/:id/members/total
router.get("/:id/members/total", function (req, res, next) {
  groupController.totalMembers(req, res);
});

// [POST] /groups/:id/join
router.post("/:id/join", function (req, res, next) {
  groupController.joinTheGroup(req, res);
});

// [POST] /groups/create group
router.post("/create", upload.single("picture"), groupController.createGroup);

module.exports = router;
