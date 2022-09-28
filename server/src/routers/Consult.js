const express = require('express');
const router = express.Router();
const { token } = require('../tools/Jwt');
const consult = require('../services/Consult');

router.get('/' ,async function (req, res) {
    return await consult.all(req, res);
});

router.get('/:posicionPagina/:filasPorPagina' ,async function (req, res) {
    return await consult.list(req, res);
});

router.post('/' ,async function (req, res) {
    return await consult.add(req, res);
});

router.put('/' ,async function (req, res) {
    return await consult.update(req, res);
});

router.delete('/:id', token ,async function (req, res) {
    return await consult.delete(req, res);
});

router.get('/:id' ,async function (req, res) {
    return await consult.id(req, res);
});

module.exports = router;