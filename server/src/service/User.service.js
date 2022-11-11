const { sendSuccess, sendError, sendClient } = require('../tools/Message');
const { SHA1, MD5 } = require('../tools/Tools');
const { createToken } = require('../tools/Jwt');
const conec = require('../tools/Conexion');
require('dotenv').config();

class UserService {

    async token(req, res) {
        return sendSuccess(res, "OK");
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async id(req, res) {
        try {
            const usuario = await conec.query(`SELECT 
            c_nom_usuario,
            c_apP_usuario,
            c_apM_usuario 
            FROM seguridad.TD_Usuario 
            where c_cod_usuario = ?`, [
                req.params.id
            ]);

            if (usuario.length > 0) {
                return sendSuccess(res, usuario[0]);
            } else {
                return sendClient(res, "Usuario no encontrado.");
            }
        } catch (error) {
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async login(req, res) {
        try {
            const validate = await conec.query(`SELECT 
            c_cod_usuario,
            c_pas_usuario 
            FROM seguridad.TM_Usuario 
            WHERE c_cod_usuario = ?`, [
                req.body.codigo,
            ]);

            if (validate.length == 0) {
                return sendClient(res, "Datos incorrectos, intente nuevamente.");
            }

            const password = SHA1("|#o5o34+-o/g+)d1)2" + MD5(req.body.clave));

            const tokenFirebase = req.body.token == undefined || req.body.token == null ? "" : req.body.token;

            const xml = "<Autentificar><usuario>" + req.body.codigo + "</usuario><contrasena>" + password + "</contrasena><token>" + tokenFirebase + "</token></Autentificar>";

            const passValidate = await conec.procedure("seguridad.paCon_AutentificarUsuariocr", [
                {
                    "name": "xml",
                    "data": xml
                }
            ]);

            if (passValidate[0].rpta != "Correcto") {
                return sendClient(res, "Datos incorrectos, intente nuevamente.");
            }

            const token = await createToken({ "idUsuario": passValidate[0].docNumId });

            return sendSuccess(res, { ...passValidate[0], token });
        } catch (error) {
            return sendError(res, "Se produjo un error de servidor, intente nuevamente. ");
        }
    }
}

module.exports = new UserService();