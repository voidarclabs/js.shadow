const express = require('express');
const socketio = require('socket.io');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '/public'));
});

const server = app.listen(3000, () => {
    console.log('Server running!')
});

const io = socketio(server)

io.on('connection', (socket) => {
    console.log(socket)
})

