const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];

    });

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('receive', { message: msg, name: users[socket.id] });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});  