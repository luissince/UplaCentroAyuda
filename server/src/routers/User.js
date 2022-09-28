const express = require('express');
const router = express.Router();
const { token } = require('../tools/Jwt');
const user = require('../services/User');

router.get('/' ,async function (req, res) {
    return await user.all(req, res);
});

router.get('/:posicionPagina/:filasPorPagina' ,async function (req, res) {
    return await user.list(req, res);
});

router.post('/' ,async function (req, res) {
    return await user.add(req, res);
});

router.put('/' ,async function (req, res) {
    return await user.update(req, res);
});

router.delete('/:id' ,async function (req, res) {
    return await user.delete(req, res);
});

router.get('/:id' ,async function (req, res) {
    return await user.id(req, res);
});

router.post('/login', async function (req, res) {
    return await user.login(req, res);
});

module.exports = router;