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

module.exports = router;
