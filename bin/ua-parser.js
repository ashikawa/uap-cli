/*jslint node:true, plusplus:true, unparam:true, evil:true*/
/*global Promise*/
'use strict';

var yaml  = require('yamlparser/yamlparser'),
    fs    = require('fs'),
    uap   = require('uap-ref-impl/lib/parser'),
    file  = process.argv[2];

if (!file) {
    console.log('regexes.yaml not found');
    console.log('usage: uapaser path/to/regexes.yaml');
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

fileReadPromise(file).then(function (data) {
    var dataYaml = yaml.eval(data);
    return uap(dataYaml);
}).then(function (uap) {
    if (process.argv[3]) {
        var input = process.argv[3];
        console.log(uap.parse(input));
        return process.exit(0);
    }

    require('readline').createInterface({
        input:  process.stdin,
        output: process.stdout
    }).on('line', function (line) {
        if (line === '') {
            return;
        }
        console.log(uap.parse(line));
    });
});
