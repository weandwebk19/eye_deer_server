const express = require('express');
const router = express.Router();
const groupController = require('./groupController');
const authMiddleware = require('../../components/auth/authMiddleware');
const upload = require('../../utils/multer');


// [GET] /group/:id/members/total
router.get('/:id/members/total', function(req, res, next) {
    groupController.totalMembers(req, res);
});

// [POST] /group/:id/join
router.get('/:id/join', function(req, res, next) {
    groupController.joinTheGroup(req, res);
});

// [POST] /group/create group
router.post('/create', upload.single('picture') , groupController.createGroup);

module.exports = router;