const express = require("express");
const router = express.Router();
const workplaceController = require("./workplaceController");

// [GET] /workplaces
router.get("/", async function (req, res, next) {
  workplaceController.list(req, res);
  // res.render("index", { title: "Express" });
});

module.exports = router;
