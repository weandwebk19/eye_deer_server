const express = require("express");
const router = express.Router();
const SlideController = require("./slideController");

// Create new Slide
router.post("/create", function (req, res, next) {
  SlideController.createSlide(req, res);
});

// Increase vote
router.put("/:id/option/:optionId", function (req, res, next) {
  SlideController.increaseVote(req, res);
});

// Get option
router.get("/:id/option/:optionId", function (req, res, next) {
  SlideController.getOption(req, res);
});

module.exports = router;
