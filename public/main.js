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
    y: 0
};

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
}

function set_pos(e) {
    //console.log("pos: " + pos.x + ", " + pos.y);
    //console.log("e: " + e.clientX + ", " + e.clientY);
    pos.x = e.clientX - canvas.offsetLeft;
    pos.y = e.clientY - canvas.offsetTop;
}

function clear_canvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}