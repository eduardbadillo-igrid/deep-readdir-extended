/// <reference path='typescript-definitions/node.d.ts'/>
'use strict';
var fs = require('fs');
var path = require('path');
function deepReaddir(dir, cb, options) {
    if (!(cb && typeof cb == 'function')) {
        throw new Error('Missing callback argument');
    }
    isDir(dir);
    var result = [];
    var promises = { q: 1 };
    async(dir, cb, options, result, promises);
    return;
}
function async(dir, cb, options, result, promises) {
    dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;
    fs.readdir(dir, function (err, files) {
        promises.q--;
        if (err) {
            return;
        }
        promises.q += files.length;
        if (promises.q < 1) {
            cb(result);
        }
        files.forEach(function (file) {
            var filepath = dir + file;
            fs.stat(filepath, function (err, stats) {
                promises.q--;
                if (err) {
                    return;
                }
                if (stats.isDirectory()) {
                    promises.q++;
                    async(filepath, cb, options, result, promises);
                }
                else {
                    // Filters...
                    if (options) {
                        if (applyFilters(file, options)) {
                            if (!!options && !!options.fullfilePath) {
                                result.push(fileObject(options.fullfilePath ? filepath : file, stats));
                            }
                            else {
                                result.push(fileObject(file, stats));
                            }
                        }
                    }
                    else {
                        if (!!options && !!options.fullfilePath) {
                            result.push(fileObject(options.fullfilePath ? filepath : file, stats));
                        }
                        else {
                            result.push(fileObject(file, stats));
                        }
                    }
                }
                if (promises.q < 1) {
                    cb(result);
                }
            });
        });
    });
}
function deepReaddirSync(dir, options) {
    var result = result || [];
    var contents = fs.readdirSync(dir);
    dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;
    contents.forEach(function (item) {
        var newItem = dir + item;
        var stats = fs.statSync(newItem);
        if (newItem !== dir && stats.isDirectory()) {
            var recursiveContents = deepReaddirSync(newItem, options);
            result = result.concat(recursiveContents);
            return;
        }
        if (!!options && !!options.fullfilePath) {
            item = options.fullfilePath ? newItem : item;
        }
        result.push(fileObject(item, stats));
    });
    return result;
}
function isDir(dir) {
    var stats;
    if (dir && (typeof dir == 'string')) {
        try {
            stats = fs.statSync(dir);
        }
        catch (e) {
            throw e;
        }
        if (!stats.isDirectory()) {
            throw new Error('Node ' + dir + ' exists but it\'s not a directory');
        }
    }
    else {
        throw new Error('Missing dir argument');
    }
    return true;
}
function fileObject(file, stats) {
    return {
        file: file,
        date: stats.ctime,
        size: stats.size
    };
}
function applyFilters(file, options) {
    if (options.extension != null && options.extension !== '') {
        if (options.extension[0] != '.') {
            options.extension = '.' + options.extension;
        }
        if (options.extension != path.extname(file)) {
            return false;
        }
    }
    if (!options.hidden && file[0] == '.') {
        return false;
    }
    return true;
}
module.exports = {
    deepReaddir: deepReaddir,
    deepReaddirSync: deepReaddirSync
};
