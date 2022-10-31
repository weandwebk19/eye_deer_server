const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authMiddleware = require('./authMiddleware');

// [GET] /register
router.get('/register', function(req, res, next) {
    res.send('register');
});

// [POST] /register
router.post('/register', function(req, res, next) {
    authController.register(req, res);
});

//[POST] /login
router.post('/login', authMiddleware.passportAuthentication, function(req, res, next) {
    authController.login(req, res);
});

// [POST] /refresh
router.post('/refresh', function(req, res, next) {
    authController.refreshToken(req, res);
});

// [POST] /logout
router.post('/logout', authMiddleware.verifyToken, function(req, res, next) {
    authController.logout(req, res);
});

module.exports = router;