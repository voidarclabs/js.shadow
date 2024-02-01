const express = require("express");
const fs = require("fs");
const http = require("http");
var SSHClient = require("ssh2").Client;
var utf8 = require("utf8");
const app = express();

var serverPort = 6060;

var server = http.createServer(app);

//set the template engine ejs
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

server.listen(serverPort);

//socket.io instantiation
const io = require("socket.io")(server);

//Socket Connection

io.on("connection", function(socket) {
  var ssh = new SSHClient();
  ssh
    .on("ready", function() {
      socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
      connected = true;
      ssh.shell(function(err, stream) {
        if (err)
          return socket.emit(
            "data",
            "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
          );
        socket.on("data", function(data) {
          stream.write(data);
        });
        stream
          .on("data", function(d) {
            socket.emit("data", utf8.decode(d.toString("binary")));
          })
          .on("close", function() {
            ssh.end();
          });
      });
    })
    .on("close", function() {
      socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
    })
    .on("error", function(err) {
      console.log(err);
      socket.emit(
        "data",
        "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
      );
    })
    .connect({
      host: "0.0.0.0",
      port: "6060", // Generally 22 but some server have diffrent port for security Reson
      username: "root", // user name
      password: "toor" // Set password or use PrivateKey
      // privateKey: require("fs").readFileSync("PATH OF KEY ") // <---- Uncomment this if you want to use privateKey ( Example : AWS )
    });
});
