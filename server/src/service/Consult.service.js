const path = require("path");
const { sendSuccess, sendError, sendClient } = require('../tools/Message');
const conec = require('../tools/Conexion');
const { isDirectory, createFile, mkdir, chmod } = require('../tools/Tools');

class Consult {

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async all(req, res) {
        try {
            const list = await conec.query(`SELECT * FROM Soporte.Consulta`,);
            return sendSuccess(res, list);
        } catch (error) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async list(req, res) {
        try {
            const list = await conec.query(`SELECT
            idConsulta,
            asunto,
            tipoConsulta,
            contacto,
            descripcion,
            estado,
            FORMAT(fecha,'yyyy-MM-dd') AS fecha,
            hora
            FROM Soporte.Consulta
            ORDER BY fecha DESC, hora DESC
            OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`, [
                parseInt(req.params.posicionPagina),
                parseInt(req.params.filasPorPagina),
            ]);


            let resultList = list.map(function (item, index) {
                return {
                    ...item,
                    id: (index + 1) + parseInt(req.params.posicionPagina)
                }
            });

            const total = await conec.query(`SELECT COUNT(*) AS total FROM Soporte.Consulta`,);

            return sendSuccess(res, { "result": resultList, "total": total[0].total });
        } catch (error) {
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    async id(req, res) {
        try {
            const consulta = await conec.query(`SELECT
            co.idConsulta,
            iif(LEN(CAST(co.ticket AS varchar)) <6, replicate('0',6-len(cast(co.ticket as varchar )))+cast(co.ticket  as varchar),CAST(co.ticket AS VARCHAR)) AS ticket,
            concat(es.Est_Nombre,', ',es.Est_Paterno,' ',es.Est_Materno) AS estudiante,      
            co.asunto,
            CASE
                WHEN co.tipoConsulta = 1 THEN 'ATENCIÓN'
                WHEN co.tipoConsulta = 1 THEN 'INCIDENCIA'
                WHEN co.tipoConsulta = 1 THEN 'ORIENTACIÓN'
                WHEN co.tipoConsulta = 1 THEN 'QUEJA O RECLAMO'
                WHEN co.tipoConsulta = 1 THEN 'SUGERENCIA'
            END AS tipoConsulta,
            co.contacto,
            co.descripcion,
            CASE 
                WHEN co.estado = 1 THEN 'PENDIENTE'
                WHEN co.estado = 2 THEN 'PROGRESO'
                WHEN co.estado = 3 THEN 'RESULTO'
                WHEN co.estado = 4 THEN 'CERRADOS'
                ELSE 'CANCELADO'
            END AS estado,
            format(co.fecha,'yyyy/MM/dd') AS fecha,
            convert(varchar,co.hora,14) AS hora,
            co.c_cod_usuario
            FROM 
            Soporte.Consulta AS co 
            INNER JOIN Est_Estudiante AS es ON es.Est_Id = co.Est_Id
            WHERE idConsulta = ?`, [
                req.params.id
            ]);

            if (consulta.length > 0) {
                return sendSuccess(res, consulta[0]);
            } else {
                return sendClient(res, "Consulta no encontrado.");
            }
        } catch (error) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async add(req, res) {
        let connection = null;
        try {
            connection = await conec.beginTransaction();

            const resultConsulta = await conec.execute(connection, 'SELECT idConsulta FROM Soporte.Consulta');
            let idConsulta = "";
            if (resultConsulta.length != 0) {

                let quitarValor = resultConsulta.map(function (item) {
                    return parseInt(item.idConsulta.replace("CS", ''));
                });

                let valorActual = Math.max(...quitarValor);
                let incremental = valorActual + 1;
                let codigoGenerado = "";
                if (incremental <= 9) {
                    codigoGenerado = 'CS000' + incremental;
                } else if (incremental >= 10 && incremental <= 99) {
                    codigoGenerado = 'CS00' + incremental;
                } else if (incremental >= 100 && incremental <= 999) {
                    codigoGenerado = 'CS0' + incremental;
                } else {
                    codigoGenerado = 'CS' + incremental;
                }

                idConsulta = codigoGenerado;
            } else {
                idConsulta = "CS0001";
            }

            const resultTicket = await conec.execute(connection, 'SELECT ticket FROM Soporte.Consulta');
            let ticket = 0;
            if (resultTicket.length != 0) {

                let quitarValor = resultTicket.map(function (item) {
                    return parseInt(item.ticket);
                });

                let valorActual = Math.max(...quitarValor);
                let incremental = valorActual + 1;
    
                ticket = incremental;
            } else {
                ticket = 1;
            }
          
            await conec.execute(connection, `INSERT INTO Soporte.Consulta(
            idConsulta,
            ticket,
            asunto,
            tipoConsulta,
            contacto,
            descripcion,
            estado,
            fecha,
            hora,
            Est_Id,
            c_cod_usuario) 
            VALUES(?,?,?,?,?,?,?,GETDATE(),GETDATE(),?,?)`, [
                idConsulta,
                ticket,
                req.body.asunto,
                req.body.tipoConsulta,
                req.body.contacto,
                req.body.descripcion,
                req.body.estado,
                req.body.Est_Id,
                req.body.c_cod_usuario,
            ]);

            const file = path.join(__dirname, '../', 'path/file');

            const directory = await isDirectory(file);
            if (!directory) {
                await mkdir(file, { recursive: true });
                await chmod(file, 777);
            }

            let archivo = await conec.execute(connection, 'SELECT idArchivo FROM Soporte.Archivo');
            let idArchivo = 0;
            if (archivo.length != 0) {

                let quitarValor = archivo.map(function (item) {
                    return parseInt(item.idArchivo);
                });

                let valorActual = Math.max(...quitarValor);
                let incremental = valorActual + 1;
                idArchivo = incremental;
            } else {
                idArchivo = 1;
            }

            for (const value of req.body.files) {
                const nameFile = `${Date.now() + 'file'}.${value.extension}`;
                await createFile(path.join(file, nameFile), value.base64String);

                await conec.execute(connection, `INSERT INTO Soporte.Archivo(
                    idArchivo,
                    idConsulta,
                    nombre)
                    VALUES(?,?,?)`, [
                    idArchivo,
                    idConsulta,
                    nameFile
                ]);

                idArchivo++;
            }

            await conec.commit(connection);
            return sendSuccess(res, { "idConsulta": idConsulta, "message": "Se regitró correctamente la consulta." });
        } catch (error) {
            console.log(error);
            if (connection != null) {
                await conec.rollback(connection);
            }
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        } finally {
            if (connection != null) connection.parent.close();
        }
    }


}

module.exports = new Consult();