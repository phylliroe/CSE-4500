console.log("script is working");

var socket = io("http://192.168.86.50:8080");
var username;

//var canvas = document.getElementById("canvas");
var test = document.getElementById("timer");
console.log(test);

window.onload = () => {
    enter_name();

}

/**
 * 
 * SOCKET IO TESTS
 */
socket.on("hello", data => {
    console.log("server said hey");
    console.log(data);
});

socket.on("timer", val => {
    document.getElementById("timer").innerHTML = val;
});

socket.on("time_down", val => {
    document.getElementById("timer").innerHTML = val;
});

socket.on("first_message", () => {
    console.log("I am first!");
});

socket.on("message_sent", msg => {
    let new_item = document.createElement("li");
    let new_message = document.createTextNode(msg.username + ": " + msg.message);
    new_item.appendChild(new_message);
    let messages = document.getElementById("messages");

    if (check_ul_size()) {
        messages.removeChild(messages.lastElementChild);
    }

    messages.insertBefore(new_item, messages.childNodes[0]);
});

function check_ul_size() {
    let size = document.getElementById("messages").getElementsByTagName("li").length;
    console.log(size);
    return (size == 5);
}

function send() {
    let txt = document.getElementById("text");
    let message = txt.value; 
    
    if (message) {
        console.log(message);
        socket.emit("message", message);
        txt.value = "";
    }
}

function enter_name() {
    while(true) {
        username = prompt("Enter name: ");
        if (username) {
            document.getElementById("username").innerHTML +=  ` ${username}`;
            socket.emit('name', username);
            break;
        }
    }
}

function reset_timer() {
    socket.emit("reset_time");
}

/*
DRAWING TESTS
*/
var canvas = document.getElementById("canvas");
console.log(canvas);
var c = canvas.getContext('2d');

var pos = {
    x: 0,
    y: 0, 
    prev_x: 0,
    prev_y: 0
};

var is_drawing = false;


canvas.addEventListener('mousedown', (e) => {
    is_drawing = true;
    pos.prev_x = pos.x;
    pos.prev_y = pos.y;
});

canvas.addEventListener('mouseup', (e) => {
    is_drawing = false;
    pos.prev_x = 0;
    pos.prev_y = 0;
});

canvas.addEventListener('mousemove', (e) => {
    pos.x = e.clientX - canvas.offsetLeft;
    pos.y = e.clientY - canvas.offsetTop;

    if (is_drawing) {
        socket.emit("pos", {x1: pos.x, y1:pos.y, x2: pos.prev_x, y2:pos.prev_y});
        draw(pos.prev_x, pos.prev_y,pos.x, pos.y);
        pos.prev_x = pos.x;
        pos.prev_y = pos.y;
    }
});

//canvas.addEventListener('mou')

function draw(prevx, prevy, x, y) {
    c.beginPath();
    c.lineWidth = 4;
    c.lineCap = 'round';
    c.strokeStyle = '#0000ff';

    ///set_pos();

    c.moveTo(prevx, prevy);
    c.lineTo(x, y);
    c.stroke();

    //prevx = x;
    //prevy = y;
}

function set_pos(e) {
    //console.log("pos: " + pos.x + ", " + pos.y);
    //console.log("e: " + e.clientX + ", " + e.clientY);
    pos.x = e.clientX - canvas.offsetLeft;
    pos.y = e.clientY - canvas.offsetTop;
}

/*
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', set_pos);
canvas.addEventListener('mouseenter', set_pos);


function draw(e) {
    if (e.buttons !== 1) {
        return;
    }

    c.beginPath();
    c.lineWidth = 4;
    c.lineCap = 'round';
    c.strokeStyle = '#0000ff';

    c.moveTo(pos.x, pos.y);
    set_pos(e);
    c.lineTo(pos.x, pos.y);
    c.stroke();
    socket.emit("pos", {x: pos.x, y: pos.y});
}

function set_pos(e) {
    //console.log("pos: " + pos.x + ", " + pos.y);
    //console.log("e: " + e.clientX + ", " + e.clientY);
    pos.x = e.clientX - canvas.offsetLeft;
    pos.y = e.clientY - canvas.offsetTop;
}
*/

function clear_canvas() {
    //c.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear_canvas");
}

socket.on("clear", () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
});

/*
socket.on("draw", data => {
    console.log(data);
    pos.x = data.x;
    pos.y = data.y;
    //draw();
});
*/

socket.on('draw', data => {
    draw(data.x2, data.y2, data.x1, data.y1);
});