const express = require('express');
const router = express.Router();
const workplaceController = require('./workplaceController');

// [GET] /workplaces
router.get('/workplaces', async function(req, res, next) {
    workplaceController.list(req, res);
});

module.exports = router;