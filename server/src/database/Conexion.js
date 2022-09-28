const sql = require('mssql')
require('dotenv').config();

class Conexion {
    constructor() {

        this.config = {
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            server: process.env.HOST,
            port: parseInt(process.env.PORTHOST),
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            synchronize: true,
            trustServerCertificate: true,
        };
    }

    query(slq, param = []) {
        return new Promise(async (resolve, reject) => {
            const pool = new sql.ConnectionPool(this.config);
            try {
                await pool.connect();
                for (let value of param) {
                    if (typeof value === 'number') {
                        slq = slq.replace('?', value);
                    } else if (typeof value === 'boolean') {
                        slq = slq.replace('?', value ? 1 : 0);
                    } else {
                        slq = slq.replace('?', "\'" + value + "\'");
                    }
                }
                let result = await pool.query(slq);
                resolve(result.recordset);
            } catch (err) {
                console.error(err.precedingErrors[0].originalError.info.message);
                reject(err.precedingErrors[0].originalError.info.message);
            } finally {
                pool.close();
            }
        });
    }

    procedure(slq, param = []) {
        return new Promise(async (resolve, reject) => {
            const pool = new sql.ConnectionPool(this.config);
            try {
                await pool.connect();
                const request = pool.request();

                for (let value of param) {
                    if (typeof value.data === 'number') {
                        if (Number.isInteger(value.data)) {
                            request.input(value.name, sql.Int, value.data);
                        } else {
                            request.input(value.name, sql.Float, value.data);
                        }
                    } else if (typeof value.data === 'boolean') {
                        request.input(value.name, sql.Bit, value.data);
                    } else {
                        request.input(value.name, sql.VarChar, value.data);
                    }
                }

                const result = await request.execute(slq);
                resolve(result.recordset);
            } catch (err) {
                reject(err.precedingErrors[0].originalError.info.message);
            } finally {
                pool.close();
            }
        });
    }

    beginTransaction() {
        return new Promise(async (resolve, reject) => {
            const connection = new sql.ConnectionPool(this.config);
            try {
                await connection.connect();
                const transaction = new sql.Transaction(connection);
                await transaction.begin();
                resolve(transaction);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    execute(connection, slq, param = []) {
        return new Promise(async (resolve, reject) => {
            try {
                for (let value of param) {
                    if (typeof value === 'number') {
                        slq = slq.replace('?', value);
                    } else if (typeof value === 'boolean') {
                        slq = slq.replace('?', value ? 1 : 0);
                    } else {
                        slq = slq.replace('?', "\'" + value + "\'");
                    }
                }
                let result = await connection.request().query(slq);
                resolve(result.recordset);
            } catch (err) {
                reject(err.originalError.info.message);
            }
        });
    } 

    commit(connection) {
        return new Promise(async (resolve, reject) => {
            await connection.commit();
            resolve();
        });
    }

    rollback(connection) {
        return new Promise(async (resolve, reject) => {
            await connection.rollback();
            resolve();
        });
    }

}

module.exports = new Conexion();