var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.use(express.static(`${__dirname}/public`));

io.on('connection', socket => {
    console.log("connected")
    socket.emit("hello", {data: "data"});

    socket.on('disconnect', () => {
        console.log("client is gone");
    });
});

http.listen(port, () => {
    console.log(`server started on ${port}`);
});

/*
const express = require('express');
const http = require('http');
const app = express();
//const http = require('http').Server(app);
const server = http.createServer(app)
const port = 8080;

var socketio = require('socket.io')(server);

app.get('/', (req, res) => {
    //res.send('Hello World!');
    res.sendFile(__dirname + "/socket.html");
});

socketio.on('connection', (client) => {
    console.log("Client connected!");
});

/*
app.listen(port, '0.0.0.0', () => {
    console.log(`Running on ${port}`);
});*/

//server.listen(port);