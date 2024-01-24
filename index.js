const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const fileSys = './filesys/';
const fs = require('fs');

const app = express();

app.use(express.static(path.resolve(__dirname, 'public', '')));

// Serve static files from the 'app' subfolder
app.use('/apps', express.static(path.resolve(__dirname, 'public', 'apps')));
app.use('/files', express.static(path.resolve(__dirname, 'public', 'filesys')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public'));
});

const server = app.listen(3000, () => {
    console.log('Server running!')
});

const io = socketio(server)

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('files', () => {
        var filelist = []
        fs.readdir(fileSys, (err, files) => {
            console.log(files)
            for (file in files){
            fileHtml = `<div id='file' href='/files/${file}'>${file}</div>`
            filelist.push_back(fileHtml)
            }
            socket.emit('filelist', filelist)
        });
    })

})

