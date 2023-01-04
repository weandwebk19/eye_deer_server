const express = require("express");
const router = express.Router();
const PresentationController = require("./PresentationController");
const groupMiddleware = require('../groups/groupMiddleware');

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

// remove presentation in group
router.post("/removeInGroup", groupMiddleware.isOwner, function (req, res, next) {
  PresentationController.removePresentationInGroup(req, res);
});

// Get user voted
router.get(
  "/:id/slides/:slideId/users/:userId/voted",
  function (req, res, next) {
    PresentationController.getUserVoted(req, res);
  }
);

// remove presentation
router.post("/remove", function (req, res, next) {
  PresentationController.removePresentation(req, res);
});

// get my presentation
router.get("/my-presentations" , function (req, res, next) {
  PresentationController.getMyPresentations(req, res);
});

// get my co-presentation
router.get("/my-co-presentations" , function (req, res, next) {
  PresentationController.getMyCoPresentations(req, res);
});

// find presentation by name
router.post("/find-by-name" , function (req, res, next) {
  PresentationController.findPresentationsByName(req, res);
});

// find one presentation by id
router.post("/find-by-id" , function (req, res, next) {
  PresentationController.findPresentationById(req, res);
});

// update presentation
router.post("/update", function (req, res, next) {
  PresentationController.updatePresentation(req, res);
});

module.exports = router;
