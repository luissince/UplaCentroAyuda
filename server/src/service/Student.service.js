const { sendSuccess, sendError } = require('../tools/Message');
const conec = require('../tools/Conexion');

class Student {

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async filter(req, res) {
        try {
            const data = req.params.data;
            const tipo = data.trim().length == 7 ? "1" : "0";

            const xml = "<Dato><est_id>" + data + "</est_id><tipo>" + tipo + "</tipo></Dato>";

            const usuario = await conec.procedure("Trica.paLis_DatosEstudiantes", [
                {
                    "name": "xml",
                    "data": xml
                }
            ]);

            return sendSuccess(res, usuario);
        } catch (error) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

}

module.exports = new Student();