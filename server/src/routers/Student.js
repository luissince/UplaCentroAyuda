const express = require('express');
const router = express.Router();
const student = require('../services/Student');

router.get('/filter/:data' ,async function (req, res) {
    return await student.filter(req, res);
});

module.exports = router;