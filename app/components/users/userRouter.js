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

//Get all groups user owned
router.get('/:id/groups/owned', function (req, res, next) {
    userController.ownedGroups(req, res);
});

//Get all groups user joined
router.get('/:id/groups/joined', function (req, res, next) {
    userController.joinedGroups(req, res);
});


//get user info by username
router.get('/profile/:username', userController.getUserByUsername);

//post use info to update profile
router.post('/profile/:username', upload.single('avatarFile'), userController.updateProfileUser);

module.exports = router;