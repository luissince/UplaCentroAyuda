const user = require('../service/User.service');

const userController = {};

userController.id = async (req, res) => user.id(req, res);

userController.login = async (req, res) => user.login(req, res);

userController.token = async (req, res) => user.token(req, res);

module.exports = userController;