const path = require("path");
const { sendSuccess, sendError, sendClient, sendSave } = require('../tools/Message');
const conec = require('../tools/Conexion');
const notification = require('../tools/Notificacion');
const { isDirectory, createFile, mkdir, chmod } = require('../tools/Tools');
const { adUser, removeUser, getUser } = require('../tools/User');

class Consult {

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async list(req, res) {
        try {
            const list = await conec.query(`SELECT
            co.idConsulta,
            iif(LEN(CAST(co.ticket AS varchar)) <6, replicate('0',6-len(cast(co.ticket as varchar )))+cast(co.ticket  as varchar),CAST(co.ticket AS VARCHAR)) AS ticket,
            concat(es.Est_Nombre,', ',es.Est_Paterno,' ',es.Est_Materno) AS estudiante,      
            co.asunto,
            CASE
                WHEN co.tipoConsulta = 1 THEN 'ATENCIÓN'
                WHEN co.tipoConsulta = 2 THEN 'INCIDENCIA'
                WHEN co.tipoConsulta = 3 THEN 'ORIENTACIÓN'
                WHEN co.tipoConsulta = 4 THEN 'QUEJA O RECLAMO'
                WHEN co.tipoConsulta = 5 THEN 'SUGERENCIA'
            END AS tipoConsulta,
            ISNULL(esa.Est_Celular,'') AS contacto,
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
            LEFT JOIN Est_Estudiante_Auxliar AS esa ON esa.Est_Id = es.Est_Id
            ORDER BY co.fecha DESC, co.hora DESC
			OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`, [
                parseInt(req.query.posicionPagina),
                parseInt(req.query.filasPorPagina),
            ]);

 
            let resultList = list.map(function (item, index) {
                return {
                    ...item,
                    id: (index + 1) + parseInt(req.query.posicionPagina)
                }
            });

            const total = await conec.query(`SELECT COUNT(*) AS total
            FROM 
            Soporte.Consulta AS co 
            INNER JOIN Est_Estudiante AS es ON es.Est_Id = co.Est_Id`,);

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
            es.Est_Id,
            concat(es.Est_Nombre,', ',es.Est_Paterno,' ',es.Est_Materno) AS estudiante,      
            co.asunto,
            co.tipoConsulta,
            ISNULL(esa.Est_eMail,'') AS email,
            ISNULL(esa.Est_Telefono,'') AS telefono,
            ISNULL(esa.Est_Celular,'') AS celular,
            co.descripcion,
            co.estado,
            format(co.fecha,'yyyy/MM/dd') AS fecha,
            convert(varchar,co.hora,14) AS hora,
            co.c_cod_usuario
            FROM 
            Soporte.Consulta AS co 
            INNER JOIN Est_Estudiante AS es ON es.Est_Id = co.Est_Id
            LEFT JOIN Est_Estudiante_Auxliar AS esa ON esa.Est_Id = es.Est_Id
            WHERE co.idConsulta = ?`, [
                req.query.idConsulta
            ]);

            if (consulta.length > 0) {
                return sendSuccess(res, consulta[0]);
            } else {
                return sendClient(res, "Consulta no encontrada.");
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
            descripcion,
            estado,
            fecha,
            hora,
            Est_Id,
            c_cod_usuario) 
            VALUES(?,?,?,?,?,?,GETDATE(),GETDATE(),?,?)`, [
                idConsulta,
                ticket,
                req.body.asunto,
                req.body.tipoConsulta,
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
            return sendSave(res, { "idConsulta": idConsulta, "message": "Se regitró correctamente su consulta." });
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

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async sendConsult(req, res) {
        let connection = null;
        try {
            connection = await conec.beginTransaction();

            if (req.body.detalle.length > 200) {
                return sendClient(res, "La descripción solo puede tener una longitud de 200 caracteres.");
            }

            const resultConsulta = await conec.execute(connection, 'SELECT idRespuesta FROM Soporte.Respuesta');
            let idRespuesta = "";
            if (resultConsulta.length != 0) {

                let quitarValor = resultConsulta.map(function (item) {
                    return parseInt(item.idRespuesta);
                });

                let valorActual = Math.max(...quitarValor);
                let incremental = valorActual + 1;

                idRespuesta = incremental;
            } else {
                idRespuesta = 1;
            }

            await conec.execute(connection, `INSERT INTO Soporte.Respuesta(
                idRespuesta,
                idConsulta,
                c_cod_usuario,
                detalle,
                fecha,
                hora
            ) VALUES(?,?,?,?,GETDATE(),GETDATE())`, [
                idRespuesta, 
                req.body.idConsulta,
                req.body.c_cod_usuario,
                req.body.detalle,
            ]);

            const consult = await conec.execute(connection, `SELECT 
            co.asunto, 
            co.descripcion,
            tu.tokenApp 
            FROM Soporte.Consulta  AS co 
            INNER JOIN Est_Estudiante AS es ON es.Est_Id = co.Est_Id
            INNER JOIN seguridad.TM_Usuario AS tu ON tu.c_cod_usuario = es.Est_Id
            WHERE co.idConsulta = ?`, [
                req.body.idConsulta
            ]);

            console.log(consult)

            await conec.commit(connection);

            // getUser(global.io);
            // console.log(global.io.of("/").sockets);


            // console.log(value["client"])

            // global.io.to("R01655A").emit("sdasd");
            // global.io.to("R01655A").emit('message', `Notificación al usuario.`);
            // global.io.to("R01655A").emit('message',{
            //     'title': consult.length > 0 ? "Su consulta: " + consult[0].asunto : "Asunto resuelto",
            //     'body': 'Su consulta ha sido atendida, verifiqué los mensajes recibos.',
            //     'payload': `Verificar mensajes.`
            // });

            if (consult.length > 0 && consult[0].tokenApp != null) {
                notification.sendPushToOneUser({
                    tokenId: consult[0].tokenApp,
                    data: {
                        title: consult[0].asunto,
                        subtitle: '&#128588;',
                        body: 'Su consulta ha sido atendida, verifiqué los mensajes recibos.',
                    }
                });
            }

            return sendSuccess(res, "Se registro correctamente la consulta.");
        } catch (ex) {
            console.log(ex);
            if (connection != null) {
                await conec.rollback(connection);
            }
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");

        } finally {
            if (connection != null) connection.parent.close();
        }
    }

    async listConsultByIdStudent(req, res) {
        try {
            const consulta = await conec.query(`SELECT
            co.idConsulta,
            iif(LEN(CAST(co.ticket AS varchar)) <6, replicate('0',6-len(cast(co.ticket as varchar )))+cast(co.ticket  as varchar),CAST(co.ticket AS VARCHAR)) AS ticket,      
            co.asunto,
            CASE
                WHEN co.tipoConsulta = 1 THEN 'ATENCIÓN'
                WHEN co.tipoConsulta = 2 THEN 'INCIDENCIA'
                WHEN co.tipoConsulta = 3 THEN 'ORIENTACIÓN'
                WHEN co.tipoConsulta = 4 THEN 'QUEJA O RECLAMO'
                WHEN co.tipoConsulta = 5 THEN 'SUGERENCIA'
            END AS tipoConsulta,
            ISNULL(esa.Est_Celular,'') AS contacto,
            co.descripcion,
            CASE 
                WHEN co.estado = 1 THEN 'PENDIENTE'
                WHEN co.estado = 2 THEN 'PROGRESO'
                WHEN co.estado = 3 THEN 'RESULTO'
                WHEN co.estado = 4 THEN 'CERRADOS'
                ELSE 'CANCELADO'
            END AS estado,
            format(co.fecha,'yyyy/MM/dd') AS fecha,
            convert(varchar,co.hora,14) AS hora
            FROM 
            Soporte.Consulta AS co 
            INNER JOIN Est_Estudiante AS es ON es.Est_Id = co.Est_Id
            LEFT JOIN Est_Estudiante_Auxliar AS esa ON esa.Est_Id = es.Est_Id
			WHERE co.Est_Id = ?`, [
                req.query.Est_Id
            ]);

            return sendSuccess(res, consulta);
        } catch (ex) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    async listDetailtByIdConsult(req, res) {
        try {
            const consulta = await conec.query(`SELECT
            co.idConsulta,
            iif(LEN(CAST(co.ticket AS varchar)) <6, replicate('0',6-len(cast(co.ticket as varchar )))+cast(co.ticket  as varchar),CAST(co.ticket AS VARCHAR)) AS ticket,      
            co.asunto,
            CASE
                WHEN co.tipoConsulta = 1 THEN 'ATENCIÓN'
                WHEN co.tipoConsulta = 2 THEN 'INCIDENCIA'
                WHEN co.tipoConsulta = 3 THEN 'ORIENTACIÓN'
                WHEN co.tipoConsulta = 4 THEN 'QUEJA O RECLAMO'
                WHEN co.tipoConsulta = 5 THEN 'SUGERENCIA'
            END AS tipoConsulta,
            co.descripcion,
            CASE 
                WHEN co.estado = 1 THEN 'PENDIENTE'
                WHEN co.estado = 2 THEN 'PROGRESO'
                WHEN co.estado = 3 THEN 'RESULTO'
                WHEN co.estado = 4 THEN 'CERRADOS'
                ELSE 'CANCELADO'
            END AS estado
            FROM 
            Soporte.Consulta AS co 
            INNER JOIN Est_Estudiante AS es ON es.Est_Id = co.Est_Id
            LEFT JOIN Est_Estudiante_Auxliar AS esa ON esa.Est_Id = es.Est_Id
            WHERE co.idConsulta = ?`, [
                req.query.idConsulta
            ]);

            const respuestas = await conec.query(`select 
            detalle 
            from Soporte.Respuesta 
            where idConsulta = ?`, [ 
                req.query.idConsulta
            ]);
            return sendSuccess(res, { "consulta": consulta[0], "respuestas": respuestas });
        } catch (ex) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

}

module.exports = new Consult();