/// <reference path='typescript-definitions/node.d.ts'/>
'use strict';
var fs = require('fs');
var path = require('path');
function deepReaddir(dir, cb) {
    var stats;
    if (dir || (typeof dir == 'string')) {
        try {
            stats = fs.statSync(dir);
        }
        catch (e) {
            throw new Error('Argument is not a directory');
        }
        if (!stats.isDirectory()) {
            throw new Error('Argument is not a directory');
        }
    }
    else {
        throw new Error('Missing dir argument');
    }
    if (cb && typeof cb == 'function') {
        var result = [];
        var promises = { quantity: 1 };
        readAsync(dir, cb, result, promises);
        return;
    }
    else {
        return readSync(dir);
    }
}
function readAsync(dir, cb, result, promises) {
    dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;
    fs.readdir(dir, function (err, files) {
        promises.quantity--;
        if (err) {
            return;
        }
        promises.quantity += files.length;
        if (promises.quantity < 1) {
            cb(result);
        }
        files.forEach(function (file) {
            file = dir + file;
            fs.stat(file, function (err, stats) {
                promises.quantity--;
                if (err) {
                    return;
                }
                if (stats.isDirectory()) {
                    promises.quantity++;
                    readAsync(file, cb, result, promises);
                }
                else {
                    result.push(file);
                }
                if (promises.quantity < 1) {
                    cb(result);
                }
            });
        });
    });
}
function readSync(dir) {
    var result = result || [];
    var contents = fs.readdirSync(dir);
    dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;
    contents.forEach(function (item) {
        item = dir + item;
        var stats = fs.statSync(item);
        if (item !== dir && stats.isDirectory()) {
            var recursiveContents = readSync(item);
            result = result.concat(recursiveContents);
            return;
        }
        result.push(item);
    });
    return result;
}
module.exports = deepReaddir;
