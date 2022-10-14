const consult = require('../service/Consult.service');

const consultController = {};

consultController.all = async (req, res) => consult.all(req, res);

consultController.list = async (req, res) => consult.list(req, res);

consultController.id = async (req, res) => consult.id(req, res);

consultController.add = async (req, res) => consult.add(req, res);

module.exports = consultController;