const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', socket => {
    console.log('connected!');
    socket.emit('hello', {data: 'hey'});
});

setInterval(() => {
    let b = randnum();
    io.emit('interval', b);
}, 5000);

setInterval(() => {
    let c = randnum();
    let d = 0;
    io.emit('interval', d);
}, 7000);

setInterval(() => {
    pcall();
}, 5000);

function randnum() {
    let a = Math.floor(Math.random() * 101);
    return a; 
}

function pcall() {
    //let pyshell = require('python-shell');
    //pyshell.run("pytest.py", function(err, results) {
    //    if (err) throw err;
    //    console.log(results);
    //});
    console.log("called");
    const spawn = require('child_process').spawn;
    const p = spawn('python', ['pytest.py']);

    p.stdout.on("data", data => {
        //console.log(JSON.parse(data));
        //let d = JSON.parse(data.toString());
        io.emit('py', JSON.parse(data));
        //return data.toString();
    });

    console.log("done")
}

//pcall();

server.listen(8080, () => {
    console.log('running.....');
})