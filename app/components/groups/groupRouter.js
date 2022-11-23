const express = require('express');
const router = express.Router();
const groupController = require('./groupController');
const authMiddleware = require('../../components/auth/authMiddleware');
const upload = require('../../utils/multer');


// [GET] /group/owned
router.get('/owned',  async function(req, res, next) {
    groupController.ownedGroups(req, res);
});

// [GET] /group/joined
router.get('/joined',  async function(req, res, next) {
    groupController.joinedGroups(req, res);
});

// [GET] /group/members
router.get('/members',  async function(req, res, next) {
    groupController.amountMembers(req, res);
});

// [POST] /group/create group
router.post('/create', upload.single('picture') , groupController.createGroup);

module.exports = router;