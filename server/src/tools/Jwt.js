const jwt = require('jsonwebtoken');
require('dotenv').config();

function createToken(user, expiresIn = '24h') {
    return new Promise((resolve, reject) => {
        jwt.sign(user, process.env.TOKEN, { expiresIn: expiresIn }, (error, token) => {
            if (error) {
                reject("error");
            } else {
                resolve(token);
            }
        });
    });
}

function verifyToken(req, res, next) {
    jwt.verify(req.token, process.env.TOKEN, (error, decoded) => {
        if (error) {
            res.status(403).send("Token invalid or expired");
        } else {
            req.decoded = decoded;
            next();
        }
    });
}

function token(req, res, next) {
    const bearerToken = req.headers['authorization'];
    if (typeof bearerToken !== 'undefined') {
        const token = bearerToken.split(" ")[1];
        req.token = token;
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

module.exports = { createToken, verifyToken, token }