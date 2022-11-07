const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.get('/:username', function (req, res, next) {
    userController.getUserByUsername(req, res);
});

router.get('/:email', function (req, res, next) {
    userController.getUserByEmail(req, res);
});

router.get('/users', async function(req, res, next) {
    res.send('users');
});

module.exports = router;