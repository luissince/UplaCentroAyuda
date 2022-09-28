const { sendSuccess, sendError, sendClient } = require('../tools/Message');
const conec = require('../database/Conexion');

class Consult {

    async all(req, res) {
        try {
            const list = await conec.query(`SELECT * FROM Consulta`,);
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
            FROM Consulta
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

            const total = await conec.query(`SELECT COUNT(*) AS total FROM Consulta`,);

            return sendSuccess(res, { "result": resultList, "total": total[0].total });
        } catch (error) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    async id(req, res) {
        try {

            const consulta = await conec.query("SELECT * FROM Consulta WHERE idConsulta = ?", [
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

    async add(req, res) {
        let connection = null;
        try {
            connection = await conec.beginTransaction();

            const result = await conec.execute(connection, 'SELECT idConsulta FROM Consulta');
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

            await conec.execute(connection, `INSERT INTO Consulta(
            idConsulta,
            asunto,
            tipoConsulta,
            contacto,
            descripcion,
            estado,
            fecha,
            hora,
            idUsuario) 
            VALUES(?,?,?,?,?,?,GETDATE(),GETDATE(),?)`, [
                idConsulta,
                req.body.asunto,
                req.body.tipoConsulta,
                req.body.contacto,
                req.body.descripcion,
                req.body.estado,
                req.body.idUsuario,
            ]);

            await conec.commit(connection);

            return sendSuccess(res, "Se regitró correctamente la consulta.");
        } catch (error) {
            if (connection != null) {
                await conec.rollback(connection);
            }
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        } finally {
            if (connection != null) connection.parent.close();
        }
    }

    async update(req, res) {
        let connection = null;
        try {
            connection = await conec.beginTransaction();

            const validate = await conec.execute(connection, `SELECT * FROM Usuario 
            WHERE email = ? AND idUsuario <> ?`, [
                req.body.email,
                req.body.idUsuario,
            ]);

            if (validate.length > 0) {
                await conec.rollback(connection);
                return sendClient(res, "Ya existe un usuario con el mismo correo electrónico.");
            }

            await conec.execute(connection, `UPDATE Usuario 
            SET 
            nombres = ?,
            apellidos = ?,
            email = ?,
            estado = ?,
            fupdate = GETDATE(),
            hupdate = GETDATE()
            WHERE idUsuario = ?`, [
                req.body.nombres,
                req.body.apellidos,
                req.body.email,
                req.body.estado,
                req.body.idUsuario,
            ]);

            await conec.commit(connection);

            return sendSuccess(res, "Se actualizó correctamente el usuario.");
        } catch (error) {
            if (connection != null) {
                await conec.rollback(connection);
            }
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        } finally {
            if (connection != null) connection.parent.close();
        }
    }

    async delete(req, res) {
        let connection = null;
        try {
            connection = await conec.beginTransaction();

            await conec.execute(connection, `DELETE FROM Consulta WHERE idConsulta = ?`, [
                req.params.id
            ]);

            await conec.commit(connection);

            return sendSuccess(res, "Se eliminó correctamente la consulta.");
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