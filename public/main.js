console.log("script is working");
var socket = io("http://localhost:8080");

socket.on("hello", data => {
    console.log("server said hey");
});