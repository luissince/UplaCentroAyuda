const { Router } = require('express');
const router = Router();
const { token, verifyToken } = require('../tools/Jwt');

/**
 * Validar Api
 */
router.get('/api', async (req, res) => res.send("API OKEY"));

/**
 * Modulo de Usuarios
 */
const userController = require('../controller/User.controller');

router.get('/api/user/:id', userController.id);

router.post('/api/user/login', userController.login);

/**
 * Modulo de consultas
 */
const consultController = require('../controller/Consult.controller');

router.get('/api/consult/', token, verifyToken, consultController.all);

router.get('/api/consult/:posicionPagina/:filasPorPagina', token, verifyToken, consultController.list);

router.post('/api/consult/', token, verifyToken, consultController.add);

router.get('/api/consult/:id', token, verifyToken, consultController.id);

/**
 * Modulo de estudiante
 * 
 */
const studentController = require('../controller/Student.controller');

router.get('/api/student/filter/:data', token, verifyToken, studentController.filter);

module.exports = router;