const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');

class Factory {

    create() {
        this.server = http.createServer(app);
        const io = socket(this.server, {
            cors: { origin: "*" }
        });
        global.io = io;

        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('message', (message) => {
                console.log(message);
                io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
            });
        
            socket.on("disconnect", () => {
                console.log('desconnected ' + socket.id)
            });
        });
    }

    middleware() {
        app.use(cors());
        app.use(express.json({ limit: '1024mb' }));
        app.use(express.urlencoded({ limit: '1024mb', extended: false }));
    }

    router() {
        app.use(express.static(path.join(__dirname, "../../", "app/build")));
        app.use(require('./module/Module'));
        app.use((_, res) => res.sendFile(path.join(__dirname, "../../", "app/build", "index.html")));
    }

    listen(port) {
        this.server.listen(port, () => {
            console.log(`El servidor está corriendo en el puerto ${port}`);
        });
    }

}

module.exports = Factory;