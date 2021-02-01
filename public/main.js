console.log("script is working");
var socket = io("http://localhost:8080");

window.onload = () => {
    enter_name();
}

socket.on("hello", data => {
    console.log("server said hey");
    console.log(data);
});

socket.on("message_sent", msg => {
    let new_msg = `<li>${msg}</li>`;
    document.getElementById("messages").innerHTML += new_msg;
});

function send() {
    let txt = document.getElementById("text").value;
    console.log(txt);
    socket.emit("message", txt);
}

function enter_name() {
    let name = prompt("Enter name: ");

    socket.emit('name', name);
}