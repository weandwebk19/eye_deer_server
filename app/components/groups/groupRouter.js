const express = require('express');
const router = express.Router();
const groupController = require('./groupController');

// [GET] /group/:id/members/total
router.get('/:id/members/total', function(req, res, next) {
    groupController.totalMembers(req, res);
});

// [POST] /group/:id/join
router.get('/:id/join', function(req, res, next) {
    groupController.joinTheGroup(req, res);
});

module.exports = router;