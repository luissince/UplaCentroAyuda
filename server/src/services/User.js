const bcrypt = require('bcrypt');
const saltRounds = 10;
const { sendSuccess, sendError, sendClient } = require('../tools/Message');
const { createToken, verifyToken } = require('../tools/Jwt');
const conec = require('../database/Conexion');

class User {

    async all(req, res) {
        try {
            const list = await conec.query(`SELECT * FROM Soporte.Usuario`,);
            return sendSuccess(res, list);
        } catch (error) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    async list(req, res) {
        try {
            const list = await conec.query(`SELECT
            idUsuario,
            nombres,
            apellidos,
            email,
            clave,
            estado,
            FORMAT(fecha,'yyyy-MM-dd') AS fecha,
            hora
            FROM Soporte.Usuario
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

            const total = await conec.query(`SELECT COUNT(*) AS total FROM Soporte.Usuario`,);

            return sendSuccess(res, { "result": resultList, "total": total[0].total });
        } catch (error) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

    async id(req, res) {
        try {

            const usuario = await conec.query("SELECT * FROM Soporte.Usuario WHERE idUsuario = ?", [
                req.params.id
            ]);

            if (usuario.length > 0) {
                return sendSuccess(res, usuario[0]);
            } else {
                return sendClient(res, "Usuario no encontrado.");
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

            const validate = await conec.execute(connection, 'SELECT idUsuario FROM Soporte.Usuario WHERE email = ?', [
                req.body.email,
            ]);

            if (validate.length > 0) {
                await conec.rollback(connection);
                return sendClient(res, "Ya existe un usuario con el mismo correo electrónico.");
            }

            const result = await conec.execute(connection, 'SELECT idUsuario FROM Soporte.Usuario');
            let idUsuario = "";
            if (result.length != 0) {

                let quitarValor = result.map(function (item) {
                    return parseInt(item.idUsuario.replace("US", ''));
                });

                let valorActual = Math.max(...quitarValor);
                let incremental = valorActual + 1;
                let codigoGenerado = "";
                if (incremental <= 9) {
                    codigoGenerado = 'US000' + incremental;
                } else if (incremental >= 10 && incremental <= 99) {
                    codigoGenerado = 'US00' + incremental;
                } else if (incremental >= 100 && incremental <= 999) {
                    codigoGenerado = 'US0' + incremental;
                } else {
                    codigoGenerado = 'US' + incremental;
                }

                idUsuario = codigoGenerado;
            } else {
                idUsuario = "US0001";
            }

            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(req.body.clave, salt);

            await conec.execute(connection, `INSERT INTO Soporte.Usuario(
            idUsuario,
            nombres,
            apellidos,
            email,
            clave,
            estado,
            fecha,
            hora,
            fupdate,
            hupdate) 
            VALUES(?,?,?,?,?,?,GETDATE(),GETDATE(),GETDATE(),GETDATE())`, [
                idUsuario,
                req.body.nombres,
                req.body.apellidos,
                req.body.email,
                hash,
                1
            ]);

            await conec.commit(connection);

            return sendSuccess(res, "Se regitró correctamente el usuario.");
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

            const validate = await conec.execute(connection, `SELECT * FROM Soporte.Usuario 
            WHERE email = ? AND idUsuario <> ?`, [
                req.body.email,
                req.body.idUsuario,
            ]);

            if (validate.length > 0) {
                await conec.rollback(connection);
                return sendClient(res, "Ya existe un usuario con el mismo correo electrónico.");
            }

            await conec.execute(connection, `UPDATE Soporte.Usuario 
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

            await conec.execute(connection, `DELETE FROM Soporte.Usuario WHERE idUsuario = ?`, [
                req.params.id
            ]);

            await conec.commit(connection);

            return sendSuccess(res, "Se eliminó correctamente el usuario.");
        } catch (error) {
            if (connection != null) {
                await conec.rollback(connection);
            }
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        } finally {
            if (connection != null) connection.parent.close();
        }
    }


    async login(req, res) {
        try {
            let validate = await conec.query(`SELECT idUsuario,clave FROM Soporte.Usuario 
            WHERE email = ?`, [
                req.body.email,
            ]);

            if (validate.length == 0) {
                return sendClient(res, "Datos incorrectos, intente nuevamente.");
            }

            let hash = bcrypt.compareSync(req.body.clave, validate[0].clave);
            if (!hash) {
                return sendClient(res, "Datos incorrectos, intente nuevamente.");
            }

            const usuario = await conec.query(`SELECT
            idUsuario,
            nombres,
            apellidos,
            email,
            estado
            FROM Soporte.Usuario WHERE idUsuario = ?`, [
                validate[0].idUsuario
            ]);

            if (usuario[0].estado == 0) {
                return sendClient(res, "Su cuenta se encuentra inactiva.");
            }

            const token = await createToken(usuario[0], 'userkeylogin');

            return sendSuccess(res, { ...usuario[0], token });
        } catch (error) {
            console.log(error);
            return sendError(res, "Se produjo un error de servidor, intente nuevamente.");
        }
    }

}

module.exports = new User();