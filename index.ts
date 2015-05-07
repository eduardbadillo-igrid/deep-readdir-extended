/// <reference path='typescript-definitions/node.d.ts'/>

'use strict';

import fs = require('fs');
import path = require('path');

function deepReaddir(dir: string, cb: Function): void;
function deepReaddir(dir: string): string[];
function deepReaddir(dir, cb?): any {

	var stats;
	if ( dir || (typeof dir == 'string') ) {
		try {
			stats = fs.statSync(dir);
		} catch (e) {
			throw new Error('Argument is not a directory');
		}
		if (!stats.isDirectory()) {
			throw new Error('Argument is not a directory');
		}
	} else {
		throw new Error('Missing dir argument');
	}

	if (cb && typeof cb == 'function') {
		var result: string[] = [];
		var promises: {quantity: number} = { quantity: 1 }
		readAsync(dir, cb, result, promises);
		return;
	} else {
		return readSync(dir);
	}
}

function readAsync(dir: string, cb: Function, result: string[], promises: {quantity: number}){

	dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;

	fs.readdir(dir, function (err: Error, files: string[]){
		promises.quantity--;
		if (err) { return; }
		promises.quantity += files.length;

		if (promises.quantity < 1) {
			cb(result);
		}

		files.forEach(function(file: string){
			file = dir + file;
			fs.stat(file, function(err: Error, stats: fs.Stats){
				promises.quantity--;
				if (err) { return; }

				if (stats.isDirectory()){
					promises.quantity++;
					readAsync(file, cb, result, promises);
				} else {
					result.push(file);
				}
				if (promises.quantity < 1) {
					cb(result);
				}
			});
		});
	});
}

function readSync(dir: string){

	var result: string[] = result || [];
	var contents: string[] = fs.readdirSync(dir);
	dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;

	contents.forEach(function(item: string){
		item = dir + item;
		var stats: fs.Stats = fs.statSync(item);
		if (item !== dir && stats.isDirectory()){
			var recursiveContents: string[] = readSync(item);
			result = result.concat(recursiveContents);
			return;
		}
		result.push( item );
	});

	return result;

}

export = deepReaddir;
