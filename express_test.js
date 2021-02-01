var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

var clients = []

app.use(express.static(`${__dirname}/public`));

io.on('connection', socket => {
    console.log("connected")
    socket.emit("hello", {data: socket.username});

    socket.on('disconnect', () => {
        console.log("client is gone");
    });

    // emit to all clients
    socket.on('message', data => {
        console.log(data);
        io.emit("message_sent", data);
    });

    socket.on('name', data => {
        console.log(`${data} connected!`);
        socket.username = data;
        console.log("username is: " + socket.username);
        clients.push(data);
        console.log(clients);
        console.log("There is now " + clients.length + " clients");
    });
});

http.listen(port, () => {
    console.log(`server started on ${port}`);
});
