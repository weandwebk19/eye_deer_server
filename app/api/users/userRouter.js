const express = require('express');
const router = express.Router();
const {models} = require('../../models');

router.get('/', async function(req, res, next) {
    const users = await models.user.findAll();
    res.json({users: users});
});

module.exports = router;