const path = require("path");
const { sendSuccess, sendError, sendClient } = require('../tools/Message');
const conec = require('../database/Conexion');
const { isDirectory, isFile, removeFile, createFile, mkdir, chmod } = require('../tools/Tools');

class Consult {

    async all(req, res) {
        try {
            const list = await conec.query(`SELECT * FROM Soporte.Consulta`,);
            return sendSuccess(res, list);
        } catch (error) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

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
            idConsulta,
            asunto,
            tipoConsulta,
            contacto,
            descripcion,
            estado,
            format(fecha,'yyyy/MM/dd') AS fecha,
            convert(varchar,hora,14) AS hora,
            c_cod_usuario
            FROM 
            Soporte.Consulta 
            WHERE idConsulta = ?`, [
                req.params.id
            ]);

            if (consulta.length > 0) {
                return sendSuccess(res, consulta[0]);
            } else {
                return sendClient(res, "Consulta no encontrado.");
            }
        } catch (error) {
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    async add(req, res) {
        let connection = null;
        try {
            connection = await conec.beginTransaction();

            const result = await conec.execute(connection, 'SELECT idConsulta FROM Soporte.Consulta');
            let idConsulta = "";
            if (result.length != 0) {

                let quitarValor = result.map(function (item) {
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

            await conec.execute(connection, `INSERT INTO Soporte.Consulta(
            idConsulta,
            asunto,
            tipoConsulta,
            contacto,
            descripcion,
            estado,
            fecha,
            hora,
            c_cod_usuario) 
            VALUES(?,?,?,?,?,?,GETDATE(),GETDATE(),?)`, [
                idConsulta,
                req.body.asunto,
                req.body.tipoConsulta,
                req.body.contacto,
                req.body.descripcion,
                req.body.estado,
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