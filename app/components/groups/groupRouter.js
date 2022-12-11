const express = require("express");
const router = express.Router();
const groupController = require("./groupController");
const authMiddleware = require("../../components/auth/authMiddleware");
const upload = require("../../utils/multer");

// Get the information of group by id
router.get("/:id", function (req, res, next) {
  groupController.groupInfo(req, res);
});

// Get list members of group
router.get("/:id/members", function (req, res, next) {
  groupController.listMembers(req, res);
});

// Get list presentations of group
router.get("/:id/presentations", function (req, res, next) {
  groupController.listPresentations(req, res);
});

// Get total members of group
router.get("/:id/members/total", function (req, res, next) {
  groupController.totalMembers(req, res);
});

// Add members to group with token
router.get("/invite/:token", groupController.addMemberFromToken);

// Invite member join the group
router.post("/:id/invite", upload.none(), groupController.inviteMember);

// Make a user join the group
router.post("/:id/join", function (req, res, next) {
  groupController.joinTheGroup(req, res);
});

// Create a new group
router.post("/create", upload.single("picture"), groupController.createGroup);

// Get ownership info of group
router.get("/:id/owner", function (req, res, next) {
  groupController.ownerInfo(req, res);
});

// Get co-owner info of group
router.get("/:id/co-owner", function (req, res, next) {
  groupController.listCoOwners(req, res);
});

// Terminate privileges co-owner of a member
router.put("/:id/co-owner/:userId/terminate", function (req, res, next) {
  groupController.terminateCoOwner(req, res);
});

// Assign co-owner privileges to a member of a group
router.put("/:id/co-owner/:userId/assign", function (req, res, next) {
  groupController.assignCoOwner(req, res);
});

// Kick-out a member of a group
router.delete("/:id/members/:userId/kickout", function (req, res, next) {
  groupController.kickOutMember(req, res);
});

module.exports = router;
