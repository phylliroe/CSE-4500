var express = require('express');
//var cors = require('cors');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

var Sentencer = require('sentencer');

var clients = [];
var timer = 60;

var word;

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

    //let n = Sentencer.make("{{ noun }}");
    //console.log(n);
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

        //console.log(socket.adapter.rooms);
        let room = io.sockets.adapter.rooms.get("first");
        console.log(room);
        if (typeof room === "undefined") {
            console.log("first is gone");
        }
        else {
            console.log("first is still here!");
        }
    });

    // emit to all clients
    socket.on('message', data => {
        console.log(data);
        //io.emit("message_sent", data);

        if (data.toLowerCase() == word) {
            console.log(data + " = " + word);
        }
        else {
            console.log(data + " != " + word);
        }

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
            console.log(socket.adapter.rooms);
            console.log(io.sockets.adapter.rooms.get("first"))
            //console.log(socket.adapter.rooms["first"]);
            io.to("first").emit("first_message");
            io.to("first").emit("can_draw");
        }
        else {
            socket.join("guessers");
            console.log(socket.adapter.rooms);
        }
    });

    socket.on('reset_time', () => {
        timer = 61;        
    });

    socket.on("clear_canvas", () => {
        io.emit("clear");
    });

    socket.on("pos", data => {
        //console.log(data);
        socket.broadcast.emit("draw", data);
    });

    socket.on("new_word", () => {
        word = Sentencer.make("{{ noun }}");
        io.emit("word", word);
    });
});

http.listen(port, () => {
    console.log(`server started on ${port}`);
});
