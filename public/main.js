console.log("script is working");

var socket = io("http://192.168.86.50:8080");
var username;
var score = 0;

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

socket.on("existing_players", players => {
    console.log(players);
    let player_list = document.getElementById("users");
    player_list.innerHTML = "";

    Object.keys(players).forEach(function(key) {
        let player = document.createElement("li");
        player.className = "user";
        player.appendChild(document.createTextNode(key + " " + players[key]));
        player_list.insertBefore(player, player_list.childNodes[0]);
    });

    /*
    for (let i = 0; i < players.length; i++) {
        let player = document.createElement("li");
        player.className = "user";
        player.appendChild(document.createTextNode(players[i]));
        player_list.insertBefore(player, player_list.childNodes[0]);
    }
    */
});

socket.on("user_added", username => {
    console.log(username);
    let user = document.createElement("li");
    user.className = "user";
    user.appendChild(document.createTextNode(username + " " + score));
    let user_list = document.getElementById("users");
    user_list.insertBefore(user, user_list.childNodes[0]);

    set_input_name(username);
});

socket.on("message_sent", msg => {
    let new_item = document.createElement("li");
    new_item.className = "user_message";
    let new_message = document.createTextNode(msg.username + ": " + msg.message);
    new_item.appendChild(new_message);
    let messages = document.getElementById("messages");

    if (check_ul_size()) {
        messages.removeChild(messages.lastElementChild);
    }

    messages.insertBefore(new_item, messages.childNodes[0]);
});

socket.on("word", word => {
    document.getElementById("word2").innerHTML = word;
});

socket.on("correct", () => {
    console.log("You're correct!");
    score += 10;
    console.log(score);
});

socket.on("user_disconnect", username => {
    console.log(username + " has left!");
    remove_user(username);
});

function set_input_name(username) {
    document.getElementById("player_name").innerHTML = username;
}

function check_ul_size() {
    let size = document.getElementById("messages").getElementsByTagName("li").length;
    console.log(size);
    return (size == 20);
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

function remove_user(user) {
    let user_list = document.getElementById("users");
    let usernames = user_list.getElementsByTagName("li");
    //console.log(usernames);

    for (const i of usernames) {
        //console.log(i.textContent);
        if (i.textContent == user) {
            console.log("Removing " + i.textContent);
            user_list.removeChild(i);
        }
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

function get_word() {
    socket.emit("new_word");
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
var can_draw = false;

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

    if (is_drawing && can_draw) {
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
    pos.x = e.clientX - canvas.offsetLeft;
    pos.y = e.clientY - canvas.offsetTop;
}

function clear_canvas() {
    socket.emit("clear_canvas");
}

socket.on("clear", () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
});

socket.on('draw', data => {
    draw(data.x2, data.y2, data.x1, data.y1);
});

socket.on("can_draw", () => {
    can_draw = true;
    console.log(can_draw);
});