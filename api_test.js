const http = require("http");
const fetch = require('node-fetch');

// URL to Covid data for California 
const url = 'https://api.covidtracking.com/v1/states/ca/current.json';

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let x = "State: " + data['state'] + "\nPositive: " + data['positive'] + "\nIn ICU: " + 
                    data['inIcuCurrently'] + "\nDeaths: " + data['death'];

            response.end(x);
        });
}).listen(5000);

console.log("Running on 127.0.0.1:5000!");