const express = require("express");
const router = express.Router();
const authController = require("./authController");
const authMiddleware = require("./authMiddleware");
const passport = require("./passport");

// [POST] /
router.post("/", authMiddleware.verifyToken, function (req, res, next) {
  res.status(200).json("Authentication successfully");
});

// [POST] /register
router.post("/register", function (req, res, next) {
  authController.register(req, res);
});

//[POST] /login
router.post(
  "/login",
  authMiddleware.passportAuthentication,
  function (req, res, next) {
    authController.login(req, res);
  }
);

// [POST] /refresh
router.post("/refresh", function (req, res, next) {
  authController.refreshToken(req, res);
});

// [POST] /auth/logout
router.post("/logout", authMiddleware.verifyToken, function (req, res, next) {
  authController.logout(req, res);
});

// [GET] /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// [GET] /auth/google/callback
router.get(
  "/google/callback",
  authMiddleware.googleAuth,
  function (req, res, next) {
    authController.login(req, res);
  }
);

// [POST] /auth/oauth/login
router.post("/oauth/login", function (req, res, next) {
  authController.OAuthLogin(req, res);
});

// [GET] /auth/user/verify?token=xxx
router.get("/user/verify", function (req, res, next) {
  authController.verifyEmail(req, res);
});

// [GET] /auth/user/cancel?token=xxx
router.get("/user/cancel", function (req, res, next) {
  authController.cancelEmail(req, res);
});

// Anonymous login get access token to play game
router.post("/user/anonymous/login", function (req, res, next) {
  authController.anonymousLogin(req, res);
});

module.exports = router;
