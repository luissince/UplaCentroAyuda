const consult = require('../service/Consult.service');

const consultController = {};

consultController.list = async (req, res) => consult.list(req, res);

consultController.id = async (req, res) => consult.id(req, res);

consultController.add = async (req, res) => consult.add(req, res);

consultController.sendConsult = async (req, res) => consult.sendConsult(req, res);

consultController.listConsultByIdStudent = async (req, res) => consult.listConsultByIdStudent(req, res);

consultController.listDetailtByIdConsult = async (req, res) => consult.listDetailtByIdConsult(req, res);

module.exports = consultController;