const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const fileSys = './public/filesys/';
const fs = require('fs');
const nthline = require('nthline')
const nodemailer = require('nodemailer');

const app = express();

app.use(express.static(path.resolve(__dirname, 'public', '')));

// Serve static files from the 'app' subfolder
app.use('/apps', express.static(path.resolve(__dirname, 'public', 'apps')));
app.use('/files', express.static(path.resolve(__dirname, 'public', 'filesys')));
app.use('/imgs', express.static(path.resolve(__dirname, 'public', 'imgs')));
app.use('/term', express.static('localhost:6060'))

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
        updatefilelist(socket)
    })
    socket.on("upload", (fileinfo, callback) => {
        console.log(fileinfo[0])
        console.log(fileinfo[1]); // <Buffer 25 50 44 ...>
    
        // save the content to the disk, for example
        fs.writeFile(`./public/filesys/${fileinfo[0]}`, fileinfo[1], (err) => {
            if (err) throw err;
          callback({ message: err ? "failure" : "success" });
        });
      });
    socket.on('delete', (data) => {
        deletefile(data, socket)
    })

    socket.on('email', () => {
        
        var logininfo = fs.readFileSync('login').toString().split("\n");
        socket.on('logindetails', (data) => {
            let sender = data[0]
            console.log(data)
            fs.writeFileSync('login', data[0]+'\n')
            fs.writeFileSync('login', data[1]+'\n')
            let mailTransporter = nodemailer.createTransport(
                    {
                        service: 'gmail',
                        auth: {
                            user: 'dominicbourne77@gmail.com', //data[0],
                            pass: 'toah ymdc fjuk vqvb' //data[1]
                        }
                    }
                );
            socket.on('email', (data) => {
                console.log(data)
                let mailDetails = {
                    from: sender,
                    to: data[0],
                    subject: data[1],
                    text: data[2]
                };
                mailTransporter.sendMail(mailDetails,function (err, data) {if (err) {
                    console.log('Error Occurs');
                    console.log(err)
                } else {
                    console.log('Email sent successfully');
                }
            });
            })
        })
    })
})

function updatefilelist(socket) {
    fs.readdir(fileSys, (err, files) => {
        if (err) throw err;
        console.log(files)
        socket.emit('filelist', files)
    });
}



function deletefile(file, socket) {
    exec(`rm ${file}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        updatefilelist(socket)
    });
}