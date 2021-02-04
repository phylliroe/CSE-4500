console.log("script is working");

var socket = io("http://192.168.86.50:8080");
var username;

window.onload = () => {
    enter_name();
}

socket.on("hello", data => {
    console.log("server said hey");
    console.log(data);
});

socket.on("message_sent", msg => {
    //let new_msg = `<li>${msg}</li>`;
    //document.getElementById("messages").innerHTML += new_msg;
    //console.log(msg.message);
    //let data = JSON.parse(msg);
    //let messages = document.getElementById("messages");
    //let new_message = '<li>' + msg.username + ": " + msg.message + '</li>';
    //console.log(new_message);
    //document.getElementById("messages").innerHTML += new_message;
    //messages.prepend(new_message);

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