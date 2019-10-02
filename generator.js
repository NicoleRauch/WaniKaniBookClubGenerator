const fs = require('fs');
const path = require('path');


const configFileName = process.argv[2];
const config = JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"}));

var template = fs.readFileSync("./" + config.template, {encoding: "utf8"});

// Replacements:


const resultFileName = configFileName.replace(".json", ".md");
fs.writeFileSync("./" + resultFileName, template, {encoding: "utf8"});

