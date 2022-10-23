const express = require('express');
const router = express.Router();
const authController = require('./authController');

// [GET] /register
router.get('/register', async function(req, res, next) {
    res.send('register');
});

// [POST] /register
router.post('/register', async function(req, res, next) {
    authController.register(req, res);
});

module.exports = router;