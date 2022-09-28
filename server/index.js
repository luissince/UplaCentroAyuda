const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');


/**
 * Carga de variable de entorno
 */
require('dotenv').config();

/**
 * Inicializando el constructor
 */

const server = http.createServer(app);
const io = socket(server, {
    cors: { origin: "*" }
});
global.io = io;

io.on('connection', (socket) => {
    console.log('a user connected');

    // socket.on('message', (message) => {
    // console.log(message);
    // io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
    // });

    socket.on("disconnect", () => {
        console.log('desconnected ' + socket.id)
    });
});


/**
 * CORS para peticiones externas
 * setHeader('Access-Control-Allow-Origin', '*')
 * setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method')
 * setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
 */
app.use(cors());

/**
 * 
 */
app.set('port', process.env.PORT || 5000);

app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ limit: '1024mb', extended: false }));
/**
 * Cargar la app estatica compilada
 */
app.use(express.static(path.join(__dirname, "..", "app/build")));

/**
 * Mostar estaticanmente las imagenes del proyecto
 */
app.use(express.static(path.join(__dirname, "src/path/proyect")));

/**
 * Mostar estaticanmente las imagenes de la empresa
 */
app.use(express.static(path.join(__dirname, "src/path/company")));

/**
 * Cargar las rutas de la apis
 */
// app.use('/api/comprobante', require('./src/router/Comprobante'));
app.use('/api/user', require('./src/routers/User'));
app.use('/api/consult', require('./src/routers/Consult'));
/**
 * 
 */
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "app/build", "index.html"));
});

/**
 * 
 */
server.listen(app.get("port"), () => {
    console.log(`El servidor está corriendo en el puerto ${app.get("port")}`);
});