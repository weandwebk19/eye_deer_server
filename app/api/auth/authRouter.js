const express = require('express');
const router = express.Router();
const {models} = require('../../models');

// [GET] /register
router.get('/register', async function(req, res, next) {
   res.send('register')
});

// [POST] /register
router.post('/register', async function(req, res, next) {
    const users = await models.user.findAll();
    res.json({users: users});
});

module.exports = router;