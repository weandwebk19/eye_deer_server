const express = require("express");
const router = express.Router();
const groupController = require("./groupController");
const authMiddleware = require("../../components/auth/authMiddleware");
const upload = require("../../utils/multer");

// [GET] /groups/:id
router.get("/:id", function (req, res, next) {
  groupController.groupInfo(req, res);
});

// [GET] /groups/:id/members
router.get("/:id/members", function (req, res, next) {
  groupController.listMembers(req, res);
});

// [GET] /groups/:id/members/total
router.get("/:id/members/total", function (req, res, next) {
  groupController.totalMembers(req, res);
});

// [GET] /groups/:id/invite/:token group
router.get("/invite/:token", groupController.addMemberFromToken);

// [POST] /groups/:id/invite group
router.post("/:id/invite", upload.none(), groupController.inviteMember);

// [POST] /groups/:id/join
router.post("/:id/join", function (req, res, next) {
  groupController.joinTheGroup(req, res);
});

// [POST] /groups/create group
router.post("/create", upload.single("picture"), groupController.createGroup);

// [GET] /groups/:id/owner
router.get("/:id/owner", function (req, res, next) {
  groupController.ownerInfo(req, res);
});

// [GET] /groups/:id/co-owner
router.get("/:id/co-owner", function (req, res, next) {
  groupController.listCoOwners(req, res);
});

// [PUT] /groups/:id/co-owner/:userId/terminate
router.put("/:id/co-owner/:userId/terminate", function (req, res, next) {
  groupController.terminateCoOwner(req, res);
});

// [PUT] /groups/:id/co-owner/:userId/assign
router.put("/:id/co-owner/:userId/assign", function (req, res, next) {
  groupController.assignCoOwner(req, res);
});

// [DELETE] /groups/:id/members/:userId/kickout
router.delete("/:id/members/:userId/kickout", function (req, res, next) {
  groupController.kickOutMember(req, res);
});

module.exports = router;
