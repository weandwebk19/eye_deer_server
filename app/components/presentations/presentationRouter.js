const express = require("express");
const router = express.Router();
const PresentationController = require("./PresentationController");

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
router.post("/removeInGroup", function (req, res, next) {
  PresentationController.removePresentationInGroup(req, res);
});

module.exports = router;
