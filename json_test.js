//var http = require("http");
const http = require('http');
const fetch = require('node-fetch');
const url = 'https://api.covidtracking.com/v1/states/current.json';

let settings = { method: "Get" };

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        let ca = json[5];
        let state = "State: " + ca['state'];
        let pos_count = "Positive Cases: " + ca['positive'];
        let icu = "In ICU: " + ca['inIcuCurrently'];
        let deaths = "Deaths: " + ca['deaths'];
        let date = "Last Updates: " + ca['lastUpdateEt']
        
        let data = state + "\n" + pos_count + "\n" + icu + "\n" + deaths + "\n" + date;

        console.log("Running on 127.0.0.1:5000!");
        console.log(data);
        response.end(data);
    });
}).listen(5000);
/*
fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        console.log(json)
    });

*/
/*
http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type':'text/plain'});
    response.end('Hello World');_
}).listen(5000);

console.log("Running on 127.0.0.1:5000/");
*/