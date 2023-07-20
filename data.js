const fs = require("fs");

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
console.log(`The length of the JSON file is ${data.length}`);
