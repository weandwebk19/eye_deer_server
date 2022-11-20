const express = require('express');
const authMiddleware = require('../auth/authMiddleware');
const router = express.Router();
const userController = require('./userController');
const upload = require('../../utils/multer');

router.get('/:username', function (req, res, next) {
    userController.getUserByUsername(req, res);
});

router.get('/:email', function (req, res, next) {
    userController.getUserByEmail(req, res);
});

router.get('/users', async function(req, res, next) {
    res.send('users');
});


//get user info by username
router.get('/profile/:username', authMiddleware.verifyToken, userController.getUserByUsername);

//post use info to update profile
router.post('/profile/:username', upload.single('avatarFile'), authMiddleware.verifyToken, userController.updateProfileUser);

module.exports = router;