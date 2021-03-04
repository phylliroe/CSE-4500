var express = require('express');
//var cors = require('cors');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

var clients = [];
var timer = 60;

//app.use(cors());
//app.options('*', cors());
app.use(express.static(`${__dirname}/public`));

setInterval(() => {
    if (timer > 0) {
        timer--;
        io.emit("time_down", timer);
    }
}, 1000);

io.on('connection', socket => {
    console.log("connected")
    //socket.emit("hello", {data: socket.username});
    socket.emit("timer", timer);

    socket.on('disconnect', () => {
        for (let i = 0; i < clients.length; i++) {
            if (clients[i] === socket.username) {
                clients.splice(i, 1);
                console.log(socket.username + " has disconnected!");
                console.log(clients);
            }
        }
    });

    // emit to all clients
    socket.on('message', data => {
        console.log(data);
        //io.emit("message_sent", data);
        io.emit("message_sent", {username: socket.username, message: data});
    });

    socket.on('name', data => {
        console.log(`${data} joined!`);
        socket.username = data;
        clients.push(data);
        console.log(clients);
        console.log("There is now " + clients.length + " clients");

        io.emit("user_added", clients);

        if (clients.length == 1) {
            console.log(socket.username +" is the first user!");
            socket.join("first")
            console.log(io.sockets.adapter.rooms['first']);
            io.to("first").emit("first_message");
        }
    });

    socket.on('reset_time', () => {
        timer = 60;        
    });

    socket.on("clear_canvas", () => {
        io.emit("clear");
    });
});

http.listen(port, () => {
    console.log(`server started on ${port}`);
});
