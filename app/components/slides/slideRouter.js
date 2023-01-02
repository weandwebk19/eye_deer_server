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

// Update curent slide
router.put("/:id/update", function (req, res, next) {
  SlideController.updateCurrentSlide(req, res);
});

// Create new option
router.post("/:id/option/create", function (req, res, next) {
  SlideController.createOption(req, res);
});

// Handle change slide type
router.put(
  "/:id/content/:contentId/type/:typeId/update",
  function (req, res, next) {
    SlideController.changeSlideTypeContent(req, res);
  }
);

// Handle delte slide type
router.delete("/:id/content/:contentId/delete", function (req, res, next) {
  SlideController.deleteSlideContent(req, res);
});

// Delete a slide
router.delete("/:id/delete", function (req, res, next) {
  SlideController.deleteSlide(req, res);
});

module.exports = router;
