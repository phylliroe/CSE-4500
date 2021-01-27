// JSON string
let json_string = '{"first":1, "second": 2, "third": 3}';

// JS object
let json_obj = {
    "Course": "CSE 4500",
    "Term": "Spring 2021",
    "Name": "Andrew Loop-Perez",
    "Fourth": 4
}

// Parse string to object 
console.log("JSON Parse:");
let parse = JSON.parse(json_string);
for (x in parse) {
    console.log(parse[x]);
}

// Stringify object to string 
console.log("\nJSON Stringifiy:");
let stringified = JSON.stringify(json_obj);
console.log(stringified);
