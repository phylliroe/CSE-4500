var http = require("http");

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type':'text/plain'});
    response.end('Hello World');
}).listen(5000);

console.log("Running on 127.0.0.1:5000/");