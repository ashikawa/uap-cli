/*jslint node:true, plusplus:true, unparam:true, evil:true*/
/*global Promise*/
'use strict';

var fs       = require('fs'),
    yaml     = require('yamlparser/yamlparser'),
    uap      = require('uap-ref-impl/lib/parser'),
    readLine = require('readline'),
    file     = process.argv[2];

if (!file) {
    console.log('regexes.yaml not found');
    console.log('usage: uap-cli path/to/regexes.yaml');
    process.exit(1);
}

function fileReadPromise(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, 'utf8', function (err, text) {
            if (err) {
                reject(err);
            }
            resolve(text);
        });
    });
}

function createInterface() {
    var interFace = readLine.createInterface({
        input:  process.stdin,
        output: process.stdout
    });

    interFace.setPrompt('> ');
    interFace.prompt();

    return interFace;
}

var parseUapPromise = fileReadPromise(file).catch(function (error) {
    console.error("error: cannot read regexes.yaml", error);
    process.exit(1);
}).then(function (data) {
    var dataYaml = yaml.eval(data);
    return uap(dataYaml);
});

parseUapPromise.catch(function (error) {
    console.error("error: regexes.yaml cannot parse", error);
    process.exit(1);
}).then(function (uap) {
    var userAgent,
        interFace;

    if (process.argv[3]) {
        userAgent = process.argv[3];
        console.log(uap.parse(userAgent));
        process.exit(0);
    }

    interFace = createInterface();

    interFace.on('line', function (line) {
        if (line.trim() !== '') {
            console.log(uap.parse(line));
        }
        interFace.prompt();
    });
});
