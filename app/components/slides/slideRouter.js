const express = require("express");
const router = express.Router();
const SlideController = require("./slideController");

// Create new Slide
router.post("/create", function (req, res, next) {
  SlideController.createSlide(req, res);
});

module.exports = router;
