const express = require('express');
const router = express.Router();
const { token, verifyToken } = require('../tools/Jwt');
const consult = require('../services/Consult');

router.get('/', token, verifyToken, async function (req, res) {
    return await consult.all(req, res);
});

router.get('/:posicionPagina/:filasPorPagina', token, verifyToken, async function (req, res) {
    return await consult.list(req, res);
});

router.post('/', token, verifyToken, async function (req, res) {
    return await consult.add(req, res);
});


router.get('/:id', token, verifyToken, async function (req, res) {
    return await consult.id(req, res);
});

module.exports = router;