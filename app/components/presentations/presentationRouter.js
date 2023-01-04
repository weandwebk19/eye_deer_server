const express = require("express");
const router = express.Router();
const PresentationController = require("./PresentationController");
const groupMiddleware = require("../groups/groupMiddleware");

// Create new presentation
router.post("/create", function (req, res, next) {
  PresentationController.createPresentation(req, res);
});

// Get code of presentation
router.get("/:id/code", function (req, res, next) {
  PresentationController.getCodePresentation(req, res);
});

// Get slide list of presentation
router.get("/:id/slides", function (req, res, next) {
  PresentationController.getSlidesPresentation(req, res);
});

// remove presentation
router.post(
  "/removeInGroup",
  groupMiddleware.isOwner,
  function (req, res, next) {
    PresentationController.removePresentationInGroup(req, res);
  }
);

// Get user voted
router.get(
  "/:id/slides/:slideId/users/:userId/voted",
  function (req, res, next) {
    PresentationController.getUserVoted(req, res);
  }
);

// Get list chat messages of presentation
router.get("/:id/chat/messages", function (req, res, next) {
  PresentationController.getChatMessages(req, res);
});

module.exports = router;
