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

    // emit to all clients
    socket.on('message', data => {
        console.log(data);
        io.emit("message_sent", data);
    });
});


http.listen(port, () => {
    console.log(`server started on ${port}`);
});
