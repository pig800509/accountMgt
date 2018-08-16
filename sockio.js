const socketio = require('socket.io');

var sockio = {};

sockio.connect = (server) => {
    this.io = new socketio(server);
    this.io.on('connection', (socket) => {
        console.log('new connection');
    });
}

sockio.emitMsg = (room, msg) => {
    this.io.emit(room, msg);
}

module.exports = sockio;
