const student = require('../service/Student.service');

const studentController = {};

studentController.filter = async (req, res) => student.filter(req, res);

module.exports = studentController;