/// <reference path='typescript-definitions/node.d.ts'/>

'use strict';

interface Options {
	extension?: string;
	hidden?: boolean;
}

import fs = require('fs');
import path = require('path');

function deepReaddir(dir: string, cb: Function, options: Options): void;
function deepReaddir(dir: string, cb: Function): void;
function deepReaddir(dir: string, options: Options): string[];
function deepReaddir(dir: string): string[];
function deepReaddir(dir, cb?, options?) {

	var stats;

	if ( dir || (typeof dir == 'string') ) {
		try {
			stats = fs.statSync(dir);
		} catch (e) {
			throw e;
		}
		if (!stats.isDirectory()) {
			throw new Error('Node '+dir+' exists but it\'s not a directory');
		}
	} else {
		throw new Error('Missing dir argument');
	}

	if (cb && typeof cb == 'function') {
		var result: string[] = [];
		var promises: {quantity: number} = { quantity: 1 }
		readAsync(dir, cb, options, result, promises);
		return;
	} else {
		return readSync(dir, options);
	}
}

function readAsync(dir: string, cb: Function, options: Options, result: string[], promises: {quantity: number}){

	dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;

	fs.readdir(dir, function (err: Error, files: string[]){
		promises.quantity--;
		if (err) { return; }
		promises.quantity += files.length;

		if (promises.quantity < 1) {
			cb(result);
		}

		files.forEach(function(file: string){
			var filepath = dir + file;
			fs.stat(filepath, function(err: Error, stats: fs.Stats){
				promises.quantity--;
				if (err) { return; }

				if (stats.isDirectory()){
					promises.quantity++;
					readAsync(filepath, cb, options, result, promises);
				} else {
					// Filters...
					if (options) {
						if (applyFilters(file, options)) {
							result.push(filepath);
						}
					} else {
						result.push(filepath);
					}
				}
				if (promises.quantity < 1) {
					cb(result);
				}
			});
		});
	});
}

function applyFilters(file: string, options: Options): boolean {
	if (options.extension != null && options.extension !== '') {
		if (options.extension[0] != '.') { options.extension = '.' + options.extension; }
		if (options.extension != path.extname(file)) {
			return false;
		}
	}
	if (!options.hidden && file[0] == '.') {
		return false;
	}
	return true;
}

function readSync(dir: string, options: Options){

	var result: string[] = result || [];
	var contents: string[] = fs.readdirSync(dir);
	dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;

	contents.forEach(function(item: string){
		item = dir + item;
		var stats: fs.Stats = fs.statSync(item);
		if (item !== dir && stats.isDirectory()){
			var recursiveContents: string[] = readSync(item, options);
			result = result.concat(recursiveContents);
			return;
		}
		result.push( item );
	});

	return result;

}

export = deepReaddir;
