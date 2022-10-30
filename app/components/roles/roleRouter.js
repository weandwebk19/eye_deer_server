const express = require('express');
const router = express.Router();
const roleController = require('./roleController');

// [GET] /roles
router.get('/roles', async function(req, res, next) {
    roleController.list(req, res);
});

module.exports = router;