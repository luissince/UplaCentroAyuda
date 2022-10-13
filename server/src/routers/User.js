const express = require('express');
const router = express.Router();
const user = require('../services/User');


router.get('/:id' ,async function (req, res) {
    return await user.id(req, res);
});

router.post('/login', async function (req, res) {
    return await user.login(req, res);
});

module.exports = router;